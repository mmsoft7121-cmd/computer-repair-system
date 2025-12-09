export const loadRepairs = () => {
  const saved = localStorage.getItem('repairs');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Sample data
  return [
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
    }
  ];
};

export const saveRepairs = (repairs) => {
  localStorage.setItem('repairs', JSON.stringify(repairs));
};