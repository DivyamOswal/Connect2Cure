// client/src/components/ChatAndVideo/ChatSidebar.jsx
import React from "react";

const ChatSidebar = ({ threads, selected, onSelect }) => {
  return (
    <div className="w-1/3 max-w-xs border-r bg-white flex flex-col">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold text-lg">Chats</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(!threads || threads.length === 0) && (
          <p className="p-4 text-sm text-gray-500">
            No active chats yet. Book an appointment to start chatting.
          </p>
        )}

        {threads.map((thread) => {
          const user = thread.user;
          const last = thread.lastMessage;
          const isActive = selected && selected._id === user._id;

          return (
            <button
              key={user._id}
              type="button"
              onClick={() => onSelect(user)}
              className={`w-full text-left px-4 py-3 border-b flex flex-col hover:bg-gray-50 ${
                isActive ? "bg-gray-100" : ""
              }`}
            >
              <span className="font-medium text-sm text-gray-900">
                {user.name}
              </span>
              <span className="text-xs text-gray-500">
                {last?.text
                  ? last.text.length > 40
                    ? last.text.slice(0, 40) + "..."
                    : last.text
                  : "No messages yet"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
