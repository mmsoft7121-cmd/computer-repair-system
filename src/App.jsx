import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Plus, Download, Upload, Edit2, Trash2, X, Save, Filter } from 'lucide-react';

const RepairManagementSystem = () => {
  const [repairs, setRepairs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const [formData, setFormData] = useState({
    customerName: '',
    deviceType: '',
    serialNumber: '',
    partNumber: '',
    issue: '',
    status: 'Pending',
    priority: 'Medium',
    technician: '',
    estimatedCost: '',
    actualCost: '',
    dateReceived: new Date().toISOString().split('T')[0],
    dateCompleted: '',
    adminComments: ''
  });

  const statuses = ['Pending', 'In Repair', 'Waiting for Parts', 'Completed', 'Cancelled'];
  const priorities = ['Low', 'Medium', 'High'];
  const technicians = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'];

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#6b7280'];

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = () => {
    const saved = localStorage.getItem('repairs');
    if (saved) {
      setRepairs(JSON.parse(saved));
    } else {
      const sample = [
        {
          id: 1,
          customerName: 'Alice Brown',
          deviceType: 'Laptop',
          serialNumber: 'LP123456',
          partNumber: 'PN-001',
          issue: 'Screen not turning on',
          status: 'In Repair',
          priority: 'High',
          technician: 'John Doe',
          estimatedCost: '150',
          actualCost: '145',
          dateReceived: '2024-12-01',
          dateCompleted: '',
          adminComments: 'Ordered new screen'
        },
        {
          id: 2,
          customerName: 'Bob Smith',
          deviceType: 'Desktop',
          serialNumber: 'DT789012',
          partNumber: 'PN-002',
          issue: 'Won\'t boot',
          status: 'Pending',
          priority: 'Medium',
          technician: 'Jane Smith',
          estimatedCost: '200',
          actualCost: '',
          dateReceived: '2024-12-05',
          dateCompleted: '',
          adminComments: ''
        }
      ];
      setRepairs(sample);
      localStorage.setItem('repairs', JSON.stringify(sample));
    }
  };

  const saveRepairs = (updatedRepairs) => {
    localStorage.setItem('repairs', JSON.stringify(updatedRepairs));
    setRepairs(updatedRepairs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRepair) {
      const updated = repairs.map(r => r.id === editingRepair.id ? { ...formData, id: r.id } : r);
      saveRepairs(updated);
    } else {
      const newRepair = { ...formData, id: Date.now() };
      saveRepairs([...repairs, newRepair]);
    }
    resetForm();
  };

  const handleEdit = (repair) => {
    setEditingRepair(repair);
    setFormData(repair);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this repair record?')) {
      saveRepairs(repairs.filter(r => r.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      deviceType: '',
      serialNumber: '',
      partNumber: '',
      issue: '',
      status: 'Pending',
      priority: 'Medium',
      technician: '',
      estimatedCost: '',
      actualCost: '',
      dateReceived: new Date().toISOString().split('T')[0],
      dateCompleted: '',
      adminComments: ''
    });
    setEditingRepair(null);
    setShowModal(false);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Customer', 'Device', 'Serial#', 'Part#', 'Issue', 'Status', 'Priority', 'Technician', 'Est.Cost', 'Actual Cost', 'Date Received', 'Date Completed', 'Comments'];
    const rows = repairs.map(r => [
      r.id, r.customerName, r.deviceType, r.serialNumber, r.partNumber, r.issue, r.status, r.priority, r.technician, r.estimatedCost, r.actualCost, r.dateReceived, r.dateCompleted, r.adminComments
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repairs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const importFromCSV = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n').slice(1);
        const imported = lines.filter(line => line.trim()).map((line, idx) => {
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g).map(v => v.replace(/^"|"$/g, ''));
          return {
            id: Date.now() + idx,
            customerName: values[1] || '',
            deviceType: values[2] || '',
            serialNumber: values[3] || '',
            partNumber: values[4] || '',
            issue: values[5] || '',
            status: values[6] || 'Pending',
            priority: values[7] || 'Medium',
            technician: values[8] || '',
            estimatedCost: values[9] || '',
            actualCost: values[10] || '',
            dateReceived: values[11] || new Date().toISOString().split('T')[0],
            dateCompleted: values[12] || '',
            adminComments: values[13] || ''
          };
        });
        saveRepairs([...repairs, ...imported]);
      };
      reader.readAsText(file);
    }
  };

  const getFilteredAndSortedRepairs = () => {
    let filtered = repairs.filter(r => {
      const matchesSearch = r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           r.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           r.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           r.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || r.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'estimatedCost' || sortField === 'actualCost') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const getStats = () => {
    const total = repairs.length;
    const pending = repairs.filter(r => r.status === 'Pending').length;
    const inRepair = repairs.filter(r => r.status === 'In Repair').length;
    const completed = repairs.filter(r => r.status === 'Completed').length;
    const totalRevenue = repairs.reduce((sum, r) => sum + (parseFloat(r.actualCost) || 0), 0);
    const avgCost = total > 0 ? totalRevenue / total : 0;
    
    return { total, pending, inRepair, completed, totalRevenue, avgCost };
  };

  const getStatusData = () => {
    return statuses.map(status => ({
      name: status,
      value: repairs.filter(r => r.status === status).length
    })).filter(d => d.value > 0);
  };

  const getPriorityData = () => {
    return priorities.map(priority => ({
      name: priority,
      value: repairs.filter(r => r.priority === priority).length
    }));
  };

  const stats = getStats();
  const filteredRepairs = getFilteredAndSortedRepairs();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Computer Repair Management System</h1>
          <p className="text-gray-600">Track and manage all repair orders efficiently</p>
        </div>

        {/* Stats Cards */}
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={getStatusData()} cx="50%" cy="50%" labelLine={false} label={entry => entry.name} outerRadius={80} fill="#8884d8" dataKey="value">
                  {getStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Priority Levels</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getPriorityData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search repairs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} /> Add Repair
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download size={20} /> Export
            </button>

            <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
              <Upload size={20} /> Import
              <input type="file" accept=".csv" onChange={importFromCSV} className="hidden" />
            </label>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Customer', 'Device', 'Serial#', 'Part#', 'Status', 'Priority', 'Technician', 'Est.Cost', 'Date', 'Actions'].map(header => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRepairs.map(repair => (
                  <tr key={repair.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{repair.customerName}</td>
                    <td className="px-4 py-3 text-sm">{repair.deviceType}</td>
                    <td className="px-4 py-3 text-sm">{repair.serialNumber}</td>
                    <td className="px-4 py-3 text-sm">{repair.partNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        repair.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        repair.status === 'In Repair' ? 'bg-blue-100 text-blue-800' :
                        repair.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        repair.priority === 'High' ? 'bg-red-100 text-red-800' :
                        repair.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {repair.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{repair.technician}</td>
                    <td className="px-4 py-3 text-sm">${repair.estimatedCost}</td>
                    <td className="px-4 py-3 text-sm">{repair.dateReceived}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(repair)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(repair.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{editingRepair ? 'Edit' : 'Add'} Repair</h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Customer Name</label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Device Type</label>
                      <input
                        type="text"
                        required
                        value={formData.deviceType}
                        onChange={(e) => setFormData({...formData, deviceType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Serial Number</label>
                      <input
                        type="text"
                        required
                        value={formData.serialNumber}
                        onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Part Number</label>
                      <input
                        type="text"
                        value={formData.partNumber}
                        onChange={(e) => setFormData({...formData, partNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Technician</label>
                      <select
                        value={formData.technician}
                        onChange={(e) => setFormData({...formData, technician: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Technician</option>
                        {technicians.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Estimated Cost</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.estimatedCost}
                        onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Actual Cost</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.actualCost}
                        onChange={(e) => setFormData({...formData, actualCost: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Date Received</label>
                      <input
                        type="date"
                        required
                        value={formData.dateReceived}
                        onChange={(e) => setFormData({...formData, dateReceived: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Date Completed</label>
                      <input
                        type="date"
                        value={formData.dateCompleted}
                        onChange={(e) => setFormData({...formData, dateCompleted: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Issue Description</label>
                    <textarea
                      required
                      value={formData.issue}
                      onChange={(e) => setFormData({...formData, issue: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Admin Comments</label>
                    <textarea
                      value={formData.adminComments}
                      onChange={(e) => setFormData({...formData, adminComments: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Save size={20} /> {editingRepair ? 'Update' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairManagementSystem;