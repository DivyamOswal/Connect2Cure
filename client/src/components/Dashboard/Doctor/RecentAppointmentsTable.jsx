// src/components/doctor/RecentAppointmentsTable.jsx
import React from "react";
import { MoreVertical } from "lucide-react";
import RecentAppointmentsRow from "./RecentAppointmentsRow";

const RecentAppointmentsTable = ({ recentAppointments = [], onRefresh }) => {
  return (
    <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
      <table className="w-full text-sm text-gray-600">
        <thead className="text-xs text-gray-500 text-left uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-2 py-4 xl:px-6">
              #
            </th>
            <th scope="col" className="px-2 py-4">
              Patient
            </th>
            <th scope="col" className="px-2 py-4 max-sm:hidden">
              Date
            </th>
            <th scope="col" className="px-2 py-4 max-sm:hidden">
              Status
            </th>
            <th scope="col" className="px-2 py-4 text-right">
              <MoreVertical className="inline-block w-4 h-4" />
            </th>
          </tr>
        </thead>
        <tbody>
          {recentAppointments.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-gray-400 text-sm"
              >
                No recent appointments found
              </td>
            </tr>
          ) : (
            recentAppointments.map((appointment, index) => (
              <RecentAppointmentsRow
                key={appointment._id}
                index={index + 1}
                appointment={appointment}
                onRefresh={onRefresh}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentAppointmentsTable;
