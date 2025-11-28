// src/components/doctor/RecentAppointmentsRow.jsx
import React from "react";
import { BadgeCheck, XCircle, Clock, PhoneCall } from "lucide-react";

const statusConfig = {
  completed: {
    label: "Completed",
    icon: BadgeCheck,
    className: "text-green-600 bg-green-50",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "text-red-600 bg-red-50",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-600 bg-amber-50",
  },
};

const RecentAppointmentsRow = ({ index, appointment }) => {
  const { patientName, date, status, type } = appointment;

  const statusKey = status?.toLowerCase() || "pending";
  const statusInfo = statusConfig[statusKey] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <tr className="border-t hover:bg-gray-50/60">
      <td className="px-2 py-4 xl:px-6 whitespace-nowrap text-xs">
        {index}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="font-medium text-gray-700 text-sm">
            {patientName}
          </span>
          {type && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <PhoneCall className="w-3 h-3" />
              {type}
            </span>
          )}
        </div>
      </td>
      <td className="px-2 py-4 max-sm:hidden text-xs text-gray-500">
        {new Date(date).toLocaleString()}
      </td>
      <td className="px-2 py-4 max-sm:hidden">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${statusInfo.className}`}
        >
          <StatusIcon className="w-3 h-3" />
          {statusInfo.label}
        </span>
      </td>
      <td className="px-2 py-4 text-right">
        <button className="text-xs text-[#FF8040] hover:underline">
          View
        </button>
      </td>
    </tr>
  );
};

export default RecentAppointmentsRow;
