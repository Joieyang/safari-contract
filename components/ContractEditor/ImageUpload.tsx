"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import type { ExtractResult } from "@/lib/gemini";

type Status = "idle" | "loading" | "done" | "error";

export default function ImageUpload({ onExtracted }: { onExtracted: (r: ExtractResult) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setMsg("请上传图片文件（PNG / JPG）");
      return;
    }
    setStatus("loading");
    setMsg(`识别中…（${file.name}）约 5–15 秒`);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/extract", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMsg(data.error || `识别失败 (HTTP ${res.status})`);
        return;
      }
      onExtracted(data as ExtractResult);
      setStatus("done");
      setMsg("✅ 已识别并填入下方表单，请逐项核对");
    } catch (e) {
      setStatus("error");
      setMsg("识别出错：" + String(e));
    }
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    e.target.value = "";
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  return (
    <div
      className={`upload-bar no-print${dragOver ? " drag" : ""}${status === "loading" ? " busy" : ""}`}
      onClick={() => status !== "loading" && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onPick} />
      <span className="upload-icon">{status === "loading" ? "⏳" : "📎"}</span>
      <span>
        {status === "idle"
          ? "上传行程截图，AI 自动识别填充旅行者 / 日期 / 住宿 / 金额（点击或拖入图片，可选）"
          : msg}
      </span>
    </div>
  );
}
