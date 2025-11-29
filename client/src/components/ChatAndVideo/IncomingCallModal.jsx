import React from "react";

const IncomingCallModal = ({ caller, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl w-80 text-center">
        <h2 className="text-lg font-semibold">Incoming Call</h2>
        <p className="text-gray-600 mt-2">{caller?.name} is calling...</p>

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={onAccept}
            className="bg-green-600 px-4 py-2 text-white rounded"
          >
            Accept
          </button>

          <button
            onClick={onReject}
            className="bg-red-600 px-4 py-2 text-white rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
