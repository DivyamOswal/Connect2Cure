import React from "react";

const ChatSidebar = ({ threads, selected, onSelect }) => {
  return (
    <div className="w-[40%] border-r bg-white h-160 overflow-y-auto">
      <h2 className="p-4 text-lg font-semibold border-b">Chats</h2>

      {threads.map((t) => (
        <div
          key={t.user._id}
          onClick={() => onSelect(t.user)}
          className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
            selected?._id === t.user._id ? "bg-gray-200" : ""
          }`}
        >
          <h3 className="font-medium">{t.user.name}</h3>
          <p className="text-gray-500 text-sm">
            {t.lastMessage?.text || "No messages yet"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
