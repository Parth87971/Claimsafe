import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, X, Shield, Clock, CheckSquare, ArrowRight, Check } from "lucide-react";

const API = "http://localhost:5000/api";

export default function RiskResultScreen({ policyId, claimData, onRestart }) {
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("alerts");

  useEffect(() => {
    fetch(`${API}/claim/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        policy_id: policyId || "policy_default",
        treatment_type: claimData.treatmentType,
        claim_amount: Number(claimData.claimAmount),
        policy_age_months: Number(claimData.policyAge),
        is_pre_existing: claimData.isPreExisting,
        pre_existing_disclosed: claimData.wasDisclosed,
        hospital_type: claimData.hospitalType || "unknown"
      })
    })
      .then((r) => r.json())
      .then(setResult);
  }, [policyId, claimData]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Analyzing claim risk…</p>
        </div>
      </div>
    );
  }

  // Determine risk level
  const isLowRisk = result.risk_score < 30;
  const isHighRisk = result.risk_score >= 70;
  const hasRiskFactors = result.risk_factors && result.risk_factors.length > 0;
  const hasApprovalReasons = result.approval_reasons && result.approval_reasons.length > 0;
  
  // Check if recommendations are only generic
  const genericRecommendations = [
    "Ensure all documents are submitted within policy timelines",
    "Obtain pre-authorization from insurer before treatment if required"
  ];
  const hasOnlyGenericRecs = result.recommendations && 
    result.recommendations.length > 0 &&
    result.recommendations.every(rec => 
      genericRecommendations.some(gen => rec.includes(gen) || gen.includes(rec))
    ) && !hasRiskFactors;

  // Progress bar styling based on risk level
  const progressColor = isLowRisk ? "bg-green-500" : 
    result.color === "red" ? "bg-red-600" : 
    result.color === "orange" ? "bg-orange-500" : "bg-green-600";
  
  // Progress bar width - show 5% minimum for zero risk
  const progressWidth = result.risk_score === 0 ? 5 : Math.max(result.risk_score, 5);

  // Determine card styling based on risk
  const scoreCardStyle = isLowRisk 
    ? "bg-green-50 border border-green-200" 
    : isHighRisk 
      ? "bg-red-50 border border-red-200"
      : "bg-white";

  const scoreTextStyle = isLowRisk 
    ? "text-green-700" 
    : isHighRisk 
      ? "text-red-700"
      : "text-gray-900";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">ClaimSafe</span>
          </div>
          <span className="text-sm text-gray-600">Check claim risk before you file</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stepper with Arrows */}
        <Stepper step={3} />

        {/* Risk Assessment Section */}
        <div className="mb-6 mt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Assessment</h1>
        </div>

        {/* Risk Score Section */}
        <div className={`rounded-xl shadow-sm p-6 mb-6 ${scoreCardStyle}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Risk Score</h3>
            <span className={`text-2xl font-bold ${scoreTextStyle}`}>
              {result.risk_score}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`${progressColor} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
          <p className={`text-sm font-medium ${scoreTextStyle}`}>
            {result.risk_level}
          </p>
          <p className={`text-xs mt-1 ${isLowRisk ? "text-green-600" : isHighRisk ? "text-red-600" : "text-gray-500"}`}>
            {isLowRisk 
              ? "This claim meets standard policy conditions"
              : isHighRisk
                ? "This claim has significant risk factors that may lead to rejection"
                : "Higher scores indicate greater likelihood of claim scrutiny"
            }
          </p>
        </div>

        {/* Risk Analysis Section - Shows different content based on risk level */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          
          {/* LOW RISK: Show approval reasons */}
          {isLowRisk && !hasRiskFactors && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <h3 className="text-lg font-semibold text-green-800">
                    Why this claim is likely to be approved
                  </h3>
                </div>
                {hasApprovalReasons && (
                  <div className="space-y-3">
                    {result.approval_reasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-green-600 text-xl mt-0.5">✓</span>
                        <p className="text-green-800 flex-1">{reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* HAS RISK FACTORS: Show risk factors */}
          {hasRiskFactors && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                {isHighRisk ? "Why this claim is likely to be rejected" : "Why this claim needs review"}
              </h3>
              <div className="space-y-3 mb-6">
                {result.risk_factors.map((factor, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`text-xl mt-0.5 ${isHighRisk ? "text-red-500" : "text-orange-500"}`}>•</span>
                    <p className="text-gray-700 flex-1">{factor}</p>
                  </div>
                ))}
              </div>

              {/* Show approval reasons even when there are risk factors (if any) */}
              {hasApprovalReasons && result.approval_reasons.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Positive factors
                  </h4>
                  <div className="space-y-2">
                    {result.approval_reasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-green-600 text-sm">✓</span>
                        <p className="text-green-700 text-sm flex-1">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Recommendations Section */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className={`rounded-lg p-6 ${
              isLowRisk && !hasRiskFactors
                ? "bg-gray-50 border border-gray-200" 
                : "bg-blue-50 border border-blue-200"
            }`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isLowRisk && !hasRiskFactors ? "text-gray-900" : "text-blue-900"
              }`}>
                <CheckCircle className={`w-5 h-5 ${
                  isLowRisk && !hasRiskFactors ? "text-gray-600" : "text-blue-600"
                }`} />
                {isLowRisk && !hasRiskFactors
                  ? "Optional best practices"
                  : "What you can do to improve approval chances"
                }
              </h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className={`mt-1 w-5 h-5 border-gray-300 rounded focus:ring-2 ${
                        isLowRisk && !hasRiskFactors
                          ? "text-gray-600 focus:ring-gray-600" 
                          : "text-blue-600 focus:ring-blue-600"
                      }`}
                    />
                    <label className="text-gray-700 flex-1">{rec}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200 mb-0">
          <div className="flex gap-1 px-4">
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === "alerts"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Claim Mistake Alerts
            </button>
            <button
              onClick={() => setActiveTab("coverage")}
              className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === "coverage"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Clock className="w-4 h-4" />
              Coverage Clarity
            </button>
            <button
              onClick={() => setActiveTab("checklist")}
              className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === "checklist"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Document Checklist
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-sm p-6 mb-6">
          {activeTab === "alerts" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Reasons Similar Claims Get Rejected</h3>
              <div className="space-y-3">
                {[
                  {
                    title: "Non-disclosure of medical history",
                    description: "Failing to disclose pre-existing conditions leads to immediate claim rejection"
                  },
                  {
                    title: "Incomplete documentation",
                    description: "Missing discharge summary, original bills, or diagnostic reports"
                  },
                  {
                    title: "Treatment not covered by policy",
                    description: "Cosmetic procedures, alternative medicine, or experimental treatments"
                  },
                  {
                    title: "Filing claims after policy lapse",
                    description: "Claims filed for treatment dates when the policy was not active"
                  },
                  {
                    title: "Specific disease waiting period not met",
                    description: "Treatments like cataract, hernia, or joint replacement have 2-4 year waiting periods"
                  }
                ].map((reason, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center mt-0.5">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-900 mb-1">{reason.title}</p>
                      <p className="text-sm text-red-700">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "coverage" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Understanding Your Coverage Limitations</h3>
              <div className="space-y-4">
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Waiting Periods</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Most health insurance policies have waiting periods: 30 days initial waiting period, 2-4 years for pre-existing conditions, and 2-4 years for specific treatments like cataract, hernia, joint replacement, and maternity.
                  </p>
                </div>
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Sub-limits</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Your policy may have sub-limits on room rent, ICU charges, and specific treatments. Exceeding these limits can lead to proportionate claim deductions.
                  </p>
                </div>
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Pre-authorization Requirements</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Planned hospitalizations typically require pre-authorization 48-72 hours before admission. Emergency admissions should be notified within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "checklist" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              <div className="space-y-3">
                {[
                  "Original claim form (duly filled and signed)",
                  "Discharge summary from hospital",
                  "Original hospital bills and receipts",
                  "Diagnostic reports and lab tests",
                  "Doctor's prescription and consultation notes",
                  "Pre-authorization approval (if applicable)",
                  "Policy copy and ID proof",
                  "Bank account details for reimbursement"
                ].map((doc, i) => (
                  <div key={i} className="flex items-start gap-3 p-3">
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
                    />
                    <label className="text-gray-700 flex-1">{doc}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Your Claim Details Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Claim Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Treatment Type</p>
              <p className="font-medium text-purple-600">{claimData.treatmentType || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Claim Amount</p>
              <p className="font-medium text-purple-600">₹{Number(claimData.claimAmount).toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Policy Age</p>
              <p className="font-medium text-purple-600">{claimData.policyAge} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Pre-existing Condition</p>
              <p className="font-medium text-purple-600">
                {claimData.isPreExisting ? "Yes" : "No"}
                {claimData.isPreExisting && (
                  <span className="ml-2">
                    ({claimData.wasDisclosed ? "Disclosed" : "Not Disclosed"})
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Hospital Type</p>
              <p className="font-medium text-purple-600">
                {claimData.hospitalType === "network" ? "Network Hospital" : 
                 claimData.hospitalType === "non_network" ? "Non-Network Hospital" : "Not Sure"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Start Over
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Step active={step >= 1} completed={step > 1} number={1}>
        Policy Analysis
      </Step>
      <ArrowRight className="w-5 h-5 text-gray-400" />
      <Step active={step >= 2} completed={step > 2} number={2}>
        Claim Details
      </Step>
      <ArrowRight className="w-5 h-5 text-gray-400" />
      <Step active={step >= 3} completed={false} number={3}>
        Risk Assessment
      </Step>
    </div>
  );
}

function Step({ active, completed, number, children }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
          active
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {completed ? <Check className="w-5 h-5" /> : active ? <Check className="w-5 h-5" /> : number}
      </div>
      <span
        className={`font-medium ${
          active ? "text-purple-600" : "text-gray-500"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
