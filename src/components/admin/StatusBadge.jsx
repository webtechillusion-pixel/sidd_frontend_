// frontend/src/components/admin/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const config = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      APPROVED: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      REJECTED: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      SUSPENDED: { color: 'bg-gray-100 text-gray-800', label: 'Suspended' },
      ACTIVE: { color: 'bg-blue-100 text-blue-800', label: 'Active' },
      INACTIVE: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      ONGOING: { color: 'bg-blue-100 text-blue-800', label: 'Ongoing' },
      ACCEPTED: { color: 'bg-purple-100 text-purple-800', label: 'Accepted' },
    };
    
    return config[status] || { color: 'bg-gray-100 text-gray-800', label: status };
  };

  const { color, label } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
};

export default StatusBadge;