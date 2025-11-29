import { useEffect, useState } from "react";
import api from "../../api/axios";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api
      .get("/appointments/my")
      .then((res) => setAppointments(res.data))
      .catch((err) => {
        console.error("Failed to load patient appointments", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Appointments</h1>

      {appointments.length === 0 && (
        <p className="text-gray-600">No appointments yet.</p>
      )}

      <div className="space-y-3">
        {appointments.map((a) => (
          <div
            key={a._id}
            className="border rounded-lg p-3 flex justify-between items-center bg-white"
          >
            <div>
              <p className="font-semibold">
                {a.doctor?.name || "Doctor"}
              </p>
              <p className="text-sm text-gray-600">
                {a.date} at {a.time}
              </p>
              <p className="text-sm text-gray-600">
                Status: {a.status}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">Fee</p>
              <p className="font-semibold">₹{a.fee}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientAppointments;
