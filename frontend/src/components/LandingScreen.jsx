import { Shield, TrendingUp, Clock, CheckCircle, Upload, FileText, BarChart3, ArrowRight } from "lucide-react";

export function LandingScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">ClaimSafe</span>
          </div>
          <span className="text-sm text-gray-600">AI Claim Risk Advisor</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight max-w-4xl mx-auto mb-6">
            Stop Health Insurance Claim Rejections
            <br /> Before They Happen
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            42% of claims in India are rejected.  
            ClaimSafe predicts rejection risk <strong>before</strong> you file.
          </p>

          <button
            onClick={onStart}
            className="bg-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-purple-700 transition-colors text-lg"
          >
            Check Your Claim Risk →
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Stat icon={<TrendingUp className="w-8 h-8" />} title="₹60L+" text="Losses Prevented" />
          <Stat icon={<CheckCircle className="w-8 h-8" />} title="94%" text="Risk Accuracy" />
          <Stat icon={<Clock className="w-8 h-8" />} title="10 sec" text="Analysis Time" />
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowItWorksStep
              number={1}
              icon={<Upload className="w-6 h-6" />}
              title="Upload Policy"
              description="Upload your health insurance policy document. We securely analyze it to extract waiting periods, exclusions, and coverage limits."
            />
            <HowItWorksStep
              number={2}
              icon={<FileText className="w-6 h-6" />}
              title="Enter Claim Details"
              description="Provide details about your claim: treatment type, amount, policy age, and pre-existing conditions."
            />
            <HowItWorksStep
              number={3}
              icon={<BarChart3 className="w-6 h-6" />}
              title="Get Risk Assessment"
              description="Receive an instant risk analysis with specific factors and actionable recommendations to reduce rejection risk."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ icon, title, text }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
      <div className="flex justify-center mb-4 text-purple-600">{icon}</div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{title}</div>
      <div className="text-gray-600">{text}</div>
    </div>
  );
}

function HowItWorksStep({ number, icon, title, description }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
        {icon}
      </div>
      <div className="text-2xl font-bold text-purple-600 mb-2">{number}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
