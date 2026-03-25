import React, { useEffect, useRef } from "react";

const IncomingCallModal = ({ caller, onAccept, onReject }) => {
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);

  // 🔊 Play ringtone + auto-missed
  useEffect(() => {
    // Play ringtone
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    }

    // ⏱ Auto reject after 30 sec
    timeoutRef.current = setTimeout(() => {
      onReject && onReject("missed");
    }, 30000);

    return () => {
      // cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAccept = () => {
    stopAll();
    onAccept && onAccept();
  };

  const handleReject = () => {
    stopAll();
    onReject && onReject("rejected");
  };

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    clearTimeout(timeoutRef.current);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      {/* 🔊 Hidden ringtone */}
      <audio ref={audioRef} src="/ringtone.mp3" />

      <div className="bg-white rounded-lg p-6 shadow-xl w-80 text-center">
        <h2 className="text-lg font-semibold">Incoming Call</h2>

        <p className="text-gray-600 mt-2">
          {(caller?.name || "Someone")} is calling...
        </p>

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={handleAccept}
            className="bg-green-600 px-4 py-2 text-white rounded"
          >
            Accept
          </button>

          <button
            onClick={handleReject}
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