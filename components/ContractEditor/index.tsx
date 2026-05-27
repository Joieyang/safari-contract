"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type {
  ContractData,
  Tour,
  ServiceProvider,
  Payment,
  Traveler,
  AccommodationNight,
  BilingualItem,
} from "@/lib/types";
import { emptyContract } from "@/lib/default-contract";
import EditableHeader from "./EditableHeader";
import EditableMeta from "./EditableMeta";
import EditableParties from "./EditableParties";
import EditableTour from "./EditableTour";
import EditableAccommodation from "./EditableAccommodation";
import EditableInclusions from "./EditableInclusions";
import EditablePayment from "./EditablePayment";
// 固定条款复用 M1 的静态组件
import CancellationSection from "../ContractForm/CancellationSection";
import ChangesSection from "../ContractForm/ChangesSection";
import LiabilitySection from "../ContractForm/LiabilitySection";
import ConfirmationSection from "../ContractForm/ConfirmationSection";
import SignatureSection from "../ContractForm/SignatureSection";
import ContractFooter from "../ContractForm/ContractFooter";
import ImageUpload from "./ImageUpload";
import type { ExtractResult, PassportResult } from "@/lib/gemini";

const DRAFT_KEY = "safari-contract-draft-v3";

// 只保留非空字段，避免 AI 返回的 null 覆盖已有值
function pickDefined(o?: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (o) for (const [k, v] of Object.entries(o)) if (v !== null && v !== undefined && v !== "") out[k] = v;
  return out;
}

// Gemini 有时把数字字段以字符串形式返回，强制转 number（NaN→null）
function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function PhaseDivider() {
  return (
    <div className="phase-divider">
      <span className="dot"></span>
    </div>
  );
}

export default function ContractEditor({
  initial,
  contractId,
}: {
  initial?: ContractData;
  contractId?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(contractId);

  const [data, setData] = useState<ContractData>(initial ?? emptyContract);
  // 编辑模式已有数据，无需载入草稿
  const [loaded, setLoaded] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  // 新建模式：仅客户端载入本地草稿
  useEffect(() => {
    if (isEdit) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ContractData>;
        // 深合并嵌套对象，旧草稿缺的新字段回退到默认值
        setData({
          ...emptyContract,
          ...parsed,
          serviceProvider: { ...emptyContract.serviceProvider, ...parsed.serviceProvider },
          payment: { ...emptyContract.payment, ...parsed.payment },
          tour: { ...emptyContract.tour, ...parsed.tour },
        });
      }
    } catch {
      /* 忽略坏草稿 */
    }
    setLoaded(true);
  }, [isEdit]);

  // 新建模式：自动保存本地草稿
  useEffect(() => {
    if (isEdit || !loaded) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch {
      /* 容量满等忽略 */
    }
  }, [data, loaded, isEdit]);

  // ---- 字段更新 ----
  const setSignDate = (signDate: string) => setData((p) => ({ ...p, signDate }));
  const updateProvider = (patch: Partial<ServiceProvider>) =>
    setData((p) => ({ ...p, serviceProvider: { ...p.serviceProvider, ...patch } }));
  const updatePayment = (patch: Partial<Payment>) =>
    setData((p) => ({ ...p, payment: { ...p.payment, ...patch } }));

  const updateTour = (patch: Partial<Tour>) =>
    setData((p) => {
      const tour: Tour = { ...p.tour, ...patch };
      const recalc = "totalAmount" in patch || "adults" in patch || "children" in patch;
      if (recalc && tour.totalAmount != null) {
        const people = (tour.adults ?? 0) + (tour.children ?? 0);
        tour.perPersonAmount = people > 0 ? Math.round(tour.totalAmount / people) : tour.totalAmount;
        tour.depositAmount = Math.round(tour.totalAmount * 0.3);
        tour.balanceAmount = tour.totalAmount - Math.round(tour.totalAmount * 0.3);
      }
      return { ...p, tour };
    });

  const updateTraveler = (i: number, patch: Partial<Traveler>) =>
    setData((p) => ({ ...p, travelers: p.travelers.map((t, idx) => (idx === i ? { ...t, ...patch } : t)) }));
  const addTraveler = () =>
    setData((p) => ({ ...p, travelers: [...p.travelers, { name: "", passport: "", nationality: "" }] }));
  const removeTraveler = (i: number) =>
    setData((p) => ({
      ...p,
      travelers: p.travelers.length > 1 ? p.travelers.filter((_, idx) => idx !== i) : p.travelers,
    }));

  // 护照批量识别结果：依次填入现有空行，多余的追加新行
  const applyPassports = (results: PassportResult[]) =>
    setData((prev) => {
      const travelers = [...prev.travelers];
      results.forEach((r) => {
        if (!r.name && !r.passport && !r.nationality) return;
        const emptyIdx = travelers.findIndex((t) => !t.name && !t.passport && !t.nationality);
        const entry: Traveler = { name: r.name ?? "", passport: r.passport ?? "", nationality: r.nationality ?? "" };
        if (emptyIdx !== -1) {
          travelers[emptyIdx] = entry;
        } else {
          travelers.push(entry);
        }
      });
      return { ...prev, travelers };
    });

  const updateNight = (i: number, patch: Partial<AccommodationNight>) =>
    setData((p) => ({ ...p, accommodation: p.accommodation.map((n, idx) => (idx === i ? { ...n, ...patch } : n)) }));
  const addNight = () =>
    setData((p) => ({
      ...p,
      accommodation: [...p.accommodation, { date: "", region: "", hotel: "", roomType: "", meals: "" }],
    }));
  const removeNight = (i: number) =>
    setData((p) => ({
      ...p,
      accommodation: p.accommodation.length > 1 ? p.accommodation.filter((_, idx) => idx !== i) : p.accommodation,
    }));

  const updateIncl = (i: number, patch: Partial<BilingualItem>) =>
    setData((p) => ({ ...p, inclusions: p.inclusions.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));
  const addIncl = () => setData((p) => ({ ...p, inclusions: [...p.inclusions, { en: "", zh: "" }] }));
  const removeIncl = (i: number) => setData((p) => ({ ...p, inclusions: p.inclusions.filter((_, idx) => idx !== i) }));
  const updateExcl = (i: number, patch: Partial<BilingualItem>) =>
    setData((p) => ({ ...p, exclusions: p.exclusions.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));
  const addExcl = () => setData((p) => ({ ...p, exclusions: [...p.exclusions, { en: "", zh: "" }] }));
  const removeExcl = (i: number) => setData((p) => ({ ...p, exclusions: p.exclusions.filter((_, idx) => idx !== i) }));

  // ---- AI 识别结果合并进表单 ----
  const applyExtracted = (r: ExtractResult) =>
    setData((prev) => {
      const travelers =
        r.travelers && r.travelers.length
          ? r.travelers.map((t) => ({
              name: t.name || "",
              passport: t.passport || "",
              nationality: t.nationality || "",
            }))
          : prev.travelers;
      const accommodation =
        r.accommodation && r.accommodation.length
          ? r.accommodation.map((n) => ({
              date: n.date || "",
              region: n.region || "",
              hotel: n.hotel || "",
              roomType: n.roomType || "",
              meals: n.meals || "",
            }))
          : prev.accommodation;
      // 合并 tour：先把 r.tour 数字字段强转 number，再用 pickDefined 过滤 null
      const rawTour = r.tour ?? {};
      const coercedTour: Partial<Tour> = {
        ...(rawTour.departureDate ? { departureDate: rawTour.departureDate } : {}),
        ...(rawTour.returnDate ? { returnDate: rawTour.returnDate } : {}),
        ...(toNum(rawTour.adults) !== null ? { adults: toNum(rawTour.adults) } : {}),
        ...(toNum(rawTour.children) !== null ? { children: toNum(rawTour.children) } : {}),
        ...(toNum(rawTour.totalAmount) !== null ? { totalAmount: toNum(rawTour.totalAmount) } : {}),
        ...(toNum(rawTour.perPersonAmount) !== null ? { perPersonAmount: toNum(rawTour.perPersonAmount) } : {}),
        ...(toNum(rawTour.depositAmount) !== null ? { depositAmount: toNum(rawTour.depositAmount) } : {}),
        ...(toNum(rawTour.balanceAmount) !== null ? { balanceAmount: toNum(rawTour.balanceAmount) } : {}),
      };
      const tour: Tour = { ...prev.tour, ...coercedTour };
      // 识别到总额但没识别到分项时，自动补算
      if (tour.totalAmount != null) {
        const people = (tour.adults ?? 0) + (tour.children ?? 0);
        if (tour.perPersonAmount == null)
          tour.perPersonAmount = people > 0 ? Math.round(tour.totalAmount / people) : tour.totalAmount;
        if (tour.depositAmount == null) tour.depositAmount = Math.round(tour.totalAmount * 0.3);
        if (tour.balanceAmount == null) tour.balanceAmount = tour.totalAmount - Math.round(tour.totalAmount * 0.3);
      }
      return { ...prev, travelers, accommodation, tour };
    });

  // ---- 保存到云端 ----
  const save = async () => {
    setSaving(true);
    setStatus("保存中…");
    try {
      const res = await fetch(isEdit ? `/api/contracts/${contractId}` : "/api/contracts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        setStatus("");
        alert("保存失败：" + (e.error || `HTTP ${res.status}`));
        return;
      }
      const saved = await res.json();
      if (!isEdit) {
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
        router.push(`/${saved.id}`);
      } else {
        setStatus("已保存 ✓");
        setTimeout(() => setStatus(""), 2500);
      }
    } catch (err) {
      setStatus("");
      alert("保存出错：" + String(err));
    } finally {
      setSaving(false);
    }
  };

  const resetDraft = () => {
    if (!window.confirm("确定清空当前草稿并恢复空白合同？")) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setData(emptyContract);
  };

  return (
    <>
      <div className="editor-toolbar no-print">
        <Link href="/" className="ce-btn ce-btn-ghost">
          ← 合同列表
        </Link>
        <span className="editor-toolbar-title">
          {isEdit ? "编辑合同" : "新建合同 · 草稿自动存本地，刷新不丢"}
          {status && <span className="editor-status"> · {status}</span>}
        </span>
        {!isEdit && (
          <button type="button" className="ce-btn ce-btn-ghost" onClick={resetDraft}>
            清空草稿
          </button>
        )}
        <button type="button" className="ce-btn" onClick={save} disabled={saving}>
          {saving ? "保存中…" : "保存合同"}
        </button>
        <button
          type="button"
          className="ce-btn"
          onClick={() => {
            alert("打印前请在 Chrome 打印对话框中取消勾选「页眉和页脚」，否则浏览器会在左上角自动加日期。");
            window.print();
          }}
        >
          打印 / 导出
        </button>
      </div>
      <ImageUpload onExtracted={applyExtracted} />
      <div className="running-header-print">Veilscape Safari</div>
      <div className="page">
        <EditableHeader />
        <EditableMeta contractNo={data.contractNo} signDate={data.signDate} onSignDateChange={setSignDate} />
        <EditableParties
          travelers={data.travelers}
          provider={data.serviceProvider}
          onTraveler={updateTraveler}
          onAddTraveler={addTraveler}
          onRemoveTraveler={removeTraveler}
          onProvider={updateProvider}
          onPassportsRecognized={applyPassports}
        />
        <EditableTour tour={data.tour} onChange={updateTour} />
        <EditableAccommodation
          nights={data.accommodation}
          onNight={updateNight}
          onAddNight={addNight}
          onRemoveNight={removeNight}
        />
        <EditableInclusions
          inclusions={data.inclusions}
          exclusions={data.exclusions}
          onIncl={updateIncl}
          onAddIncl={addIncl}
          onRemoveIncl={removeIncl}
          onExcl={updateExcl}
          onAddExcl={addExcl}
          onRemoveExcl={removeExcl}
        />
        <PhaseDivider />
        <EditablePayment payment={data.payment} onChange={updatePayment} />
        <CancellationSection />
        <PhaseDivider />
        <ChangesSection />
        <LiabilitySection />
        <ConfirmationSection />
        <SignatureSection travelers={data.travelers} />
        <ContractFooter />
      </div>
    </>
  );
}
