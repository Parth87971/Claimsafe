import { useState } from "react";
import { Shield, ArrowRight, Check } from "lucide-react";

export function ClaimDetailsScreen({ onSubmit }) {
  const [data, setData] = useState({
    treatmentType: "",
    claimAmount: "",
    policyAge: "",
    isPreExisting: false,
    wasDisclosed: false,
    hospitalType: "",
  });

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stepper with Arrows */}
        <Stepper step={2} />

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Claim Details</h2>
          <p className="text-gray-600 mb-8">
            Provide details about your claim to assess the risk
          </p>

        <Input label="Treatment" onChange={(v) => setData({ ...data, treatmentType: v })} />
        <Input label="Claim Amount (₹)" type="number" onChange={(v) => setData({ ...data, claimAmount: v })} />
        <Input label="Policy Age (months)" type="number" onChange={(v) => setData({ ...data, policyAge: v })} />
        
        <Select
          label="Hospital Type *"
          value={data.hospitalType}
          onChange={(v) => setData({ ...data, hospitalType: v })}
          options={[
            { value: "network", label: "Network Hospital" },
            { value: "non_network", label: "Non-Network Hospital" },
            { value: "unknown", label: "Not Sure" },
          ]}
        />
        <p className="text-xs text-gray-500 mt-1 mb-4">
          Hospital network status depends on insurer hospital lists. Please confirm with your insurer.
        </p>

        <Checkbox
          label="This is a pre-existing condition"
          description="A medical condition you had before purchasing the policy"
          checked={data.isPreExisting}
          onChange={(v) => setData({ ...data, isPreExisting: v, wasDisclosed: v ? data.wasDisclosed : false })}
        />

        <Checkbox
          label="Condition was disclosed during policy purchase"
          description="You informed the insurer about this condition when buying the policy"
          checked={data.wasDisclosed}
          onChange={(v) => setData({ ...data, wasDisclosed: v })}
          disabled={!data.isPreExisting}
        />

        {!data.wasDisclosed && data.isPreExisting && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-sm text-red-700 mt-4">
            ⚠️ Undisclosed pre-existing conditions are often rejected
          </div>
        )}

          <button
            onClick={() => {
              if (!data.hospitalType) {
                alert("Please select a Hospital Type");
                return;
              }
              onSubmit(data);
            }}
            className="mt-8 w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg"
          >
            Analyze Claim →
          </button>
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Step active={step === 1} number={1}>
        Policy Analysis
      </Step>
      <ArrowRight className="w-5 h-5 text-gray-400" />
      <Step active={step === 2} number={2}>
        Claim Details
      </Step>
      <ArrowRight className="w-5 h-5 text-gray-400" />
      <Step active={step === 3} number={3}>
        Risk Assessment
      </Step>
    </div>
  );
}

function Step({ active, number, children }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
          active
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {active ? <Check className="w-5 h-5" /> : number}
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

function Input({ label, type = "text", onChange }) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({ label, description, checked, onChange, disabled = false }) {
  return (
    <div className="mt-4">
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={`mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        <div className="ml-3 flex-1">
          <label className={`text-sm font-medium text-gray-700 ${disabled ? "opacity-50" : ""}`}>
            {label}
          </label>
          {description && (
            <p className={`text-xs text-gray-500 mt-1 ${disabled ? "opacity-50" : ""}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
