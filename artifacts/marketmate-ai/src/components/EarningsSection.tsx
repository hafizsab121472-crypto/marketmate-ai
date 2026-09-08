import React from 'react';

export const EarningsSection: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Earnings & Revenue</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-600 font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-purple-900">$0.00</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-600 font-medium">Monthly Active Earnings</p>
          <p className="text-2xl font-bold text-green-900">$0.00</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Pending Payouts</p>
          <p className="text-2xl font-bold text-blue-900">$0.00</p>
        </div>
      </div>
    </div>
  );
};
