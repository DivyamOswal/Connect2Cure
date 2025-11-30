import React from "react";

const MessageBubble = ({ isMine, text }) => {
  return (
    <div
      className={`max-w-xs p-3 rounded-lg ${
        isMine
          ? "bg-[#FF8040] text-white ml-auto"
          : "bg-gray-300 text-black mr-auto"
      }`}
    >
      {text}
    </div>
  );
};

export default MessageBubble;
