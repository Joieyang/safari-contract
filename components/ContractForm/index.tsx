import type { ContractData } from "@/lib/types";
import ContractHeader from "./ContractHeader";
import ContractMeta from "./ContractMeta";
import PartiesSection from "./PartiesSection";
import TourSection from "./TourSection";
import AccommodationSection from "./AccommodationSection";
import InclusionsSection from "./InclusionsSection";
import PaymentSection from "./PaymentSection";
import CancellationSection from "./CancellationSection";
import ChangesSection from "./ChangesSection";
import LiabilitySection from "./LiabilitySection";
import ConfirmationSection from "./ConfirmationSection";
import SignatureSection from "./SignatureSection";
import ContractFooter from "./ContractFooter";

function PhaseDivider() {
  return (
    <div className="phase-divider">
      <span className="dot"></span>
    </div>
  );
}

// Milestone 1：纯静态渲染，data 来自 defaultContract。
// 后续里程碑会改成受控表单（M2）+ 从数据库/AI 取数（M3/M4）。
export default function ContractForm({ data }: { data: ContractData }) {
  return (
    <>
      <div className="running-header-print">Veilscape Safari</div>
      <div className="page">
      <ContractHeader />
      <ContractMeta contractNo={data.contractNo} signDate={data.signDate} />
      <PartiesSection travelers={data.travelers} provider={data.serviceProvider} />
      <TourSection tour={data.tour} />
      <AccommodationSection nights={data.accommodation} />
      <InclusionsSection inclusions={data.inclusions} exclusions={data.exclusions} />
      <PhaseDivider />
      <PaymentSection payment={data.payment} />
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
