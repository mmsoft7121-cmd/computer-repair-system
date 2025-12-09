import React from 'react';

const StatsCards = ({ repairs }) => {
  const stats = {
    total: repairs.length,
    pending: repairs.filter(r => r.status === 'Pending').length,
    inRepair: repairs.filter(r => r.status === 'In Repair').length,
    completed: repairs.filter(r => r.status === 'Completed').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-600 mb-1">Total Repairs</div>
        <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-600 mb-1">Pending</div>
        <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-600 mb-1">In Repair</div>
        <div className="text-3xl font-bold text-purple-600">{stats.inRepair}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-sm text-gray-600 mb-1">Completed</div>
        <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
      </div>
    </div>
  );
};

export default StatsCards;