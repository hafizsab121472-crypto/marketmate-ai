import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Sparkles,
} from 'lucide-react';

const EarningsSection: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-6 h-6 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">
                Monetization
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Earnings & Revenue
            </h1>

            <p className="text-slate-400 mt-2 max-w-2xl">
              Track your monetization progress and explore strategies
              to turn your audience into revenue.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-300">
              Demo / Projected Data
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Total Revenue
              </p>

              <p className="text-2xl font-bold text-white mt-2">
                $0.00
              </p>
            </div>

            <div className="p-3 rounded-lg bg-purple-500/10">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            No connected earning accounts
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Monthly Earnings
              </p>

              <p className="text-2xl font-bold text-white mt-2">
                $0.00
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Projected earnings
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Pending Payouts
              </p>

              <p className="text-2xl font-bold text-white mt-2">
                $0.00
              </p>
            </div>

            <div className="p-3 rounded-lg bg-blue-500/10">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Not connected
          </p>
        </div>

      </div>

      {/* Revenue Goal */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-indigo-500/10">
            <Target className="w-5 h-5 text-indigo-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Monthly Revenue Goal
            </h2>

            <p className="text-sm text-slate-400">
              Your target for monthly monetization
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-3xl font-bold text-white">
              $0
            </span>

            <span className="text-slate-500 ml-2">
              earned
            </span>
          </div>

          <span className="text-sm text-slate-400">
            Goal: $2,500
          </span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            style={{ width: '0%' }}
          />
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Connect a monetization source to start tracking real revenue.
        </p>
      </div>

      {/* Monetization Strategies */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Monetization Strategies
            </h2>

            <p className="text-sm text-slate-400">
              Choose ways to turn your content and audience into income.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-colors">
            <h3 className="font-semibold text-white">
              Affiliate Marketing
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Recommend relevant products and earn commissions from
              qualifying sales.
            </p>

            <button
              type="button"
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              Plan Content
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-colors">
            <h3 className="font-semibold text-white">
              Sponsored Content
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Partner with brands and create sponsored social media
              campaigns.
            </p>

            <button
              type="button"
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              Plan Content
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-colors">
            <h3 className="font-semibold text-white">
              Digital Products
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Build and sell digital products, templates, guides or
              resources.
            </p>

            <button
              type="button"
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              Plan Content
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-colors">
            <h3 className="font-semibold text-white">
              Lead Generation
            </h3>

            <p className="text-sm text-slate-400 mt-2">
              Use social content to generate qualified leads for your
              business or services.
            </p>

            <button
              type="button"
              className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
            >
              Plan Content
            </button>
          </div>

        </div>
      </div>

      {/* Connection Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-800">
            <DollarSign className="w-5 h-5 text-slate-300" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Monetization connections
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Real earnings and payouts are not connected yet.
              This dashboard currently shows demo/projected data only.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">
                Payments: Not Connected
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">
                Affiliate Network: Not Connected
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">
                Payouts: Not Connected
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export { EarningsSection };
export default EarningsSection;