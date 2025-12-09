export const exportToCSV = (repairs) => {
  const headers = [
    'ID', 'Customer', 'Device', 'Serial#', 'Part#', 'Issue', 
    'Status', 'Priority', 'Technician', 'Est.Cost', 'Actual Cost', 
    'Date Received', 'Date Completed', 'Comments'
  ];
  
  const rows = repairs.map(r => [
    r.id, r.customerName, r.deviceType, r.serialNumber, r.partNumber,
    r.issue, r.status, r.priority, r.technician, r.estimatedCost,
    r.actualCost, r.dateReceived, r.dateCompleted, r.adminComments
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
    
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `repairs_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};

export const importFromCSV = (file, currentRepairs, callback) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    const lines = text.split('\n').slice(1);
    
    const imported = lines.filter(line => line.trim()).map((line, idx) => {
      const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
        .map(v => v.replace(/^"|"$/g, ''));
        
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
    
    callback([...currentRepairs, ...imported]);
  };
  reader.readAsText(file);
};