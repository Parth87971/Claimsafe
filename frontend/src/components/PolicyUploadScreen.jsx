import { useState } from "react";
import { Upload, FileText, Shield, ArrowRight, Check } from "lucide-react";

const API = "http://localhost:5000/api";

export function PolicyUploadScreen({ onUploaded }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [policyId, setPolicyId] = useState(null);

  const upload = async (file) => {
    if (!file) return;
    
    setUploadedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
    });
    
    setIsUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${API}/policy/upload-pdf`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      setIsUploading(false);
      if (data.policy_id) {
        setPolicyId(data.policy_id);
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Upload error:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      upload(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

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
        <Stepper step={1} />

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Policy Document</h2>
          <p className="text-gray-600 mb-8">
            Upload your health insurance policy document (PDF)
          </p>

          {!uploadedFile ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-colors">
              <FileText className="w-16 h-16 text-purple-600 mb-4" />
              <span className="text-lg font-medium text-gray-700 mb-2">Upload Policy PDF</span>
              <span className="text-sm text-gray-500">Click to browse or drag and drop</span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
              <div className="flex flex-col items-center justify-center">
                <FileText className="w-16 h-16 text-purple-600 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-1">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500 mb-6">{uploadedFile.size}</p>
                <label className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer underline">
                  Choose Different File
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-purple-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-sm">Processing document...</span>
              </div>
            </div>
          )}

          {/* Security Message */}
          <div className="mt-8 flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-purple-900">
              Your document is processed securely and not stored. We analyze your policy terms to assess claim risks.
            </p>
          </div>

          {/* Continue Button */}
          {uploadedFile && !isUploading && (
            <button
              onClick={() => onUploaded(policyId || "policy_default")}
              className="mt-8 w-full bg-purple-600 text-white font-semibold py-4 rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
            >
              Continue →
            </button>
          )}

          {/* Skip Option */}
          {!uploadedFile && (
            <button
              onClick={() => onUploaded("policy_default")}
              className="mt-6 text-sm text-purple-600 hover:text-purple-700 underline mx-auto block"
            >
              Skip & use sample policy
            </button>
          )}
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
