import { useState } from "react";
import { LandingScreen } from "./components/LandingScreen";
import { PolicyUploadScreen } from "./components/PolicyUploadScreen";
import { ClaimDetailsScreen } from "./components/ClaimDetailsScreen";
import RiskResultScreen from "./components/RiskResultScreen";

export default function App() {
  const [step, setStep] = useState("landing");
  const [policyId, setPolicyId] = useState(null);
  const [claimData, setClaimData] = useState(null);

  return (
    <>
      {step === "landing" && (
        <LandingScreen onStart={() => setStep("policy")} />
      )}

      {step === "policy" && (
        <PolicyUploadScreen
          onUploaded={(pid) => {
            setPolicyId(pid);
            setStep("claim");
          }}
        />
      )}

      {step === "claim" && (
        <ClaimDetailsScreen
          onSubmit={(data) => {
            setClaimData(data);
            setStep("result");
          }}
        />
      )}

      {step === "result" && (
        <RiskResultScreen
          policyId={policyId}
          claimData={claimData}
          onRestart={() => {
            setPolicyId(null);
            setClaimData(null);
            setStep("landing");
          }}
        />
      )}
    </>
  );
}
