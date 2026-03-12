import React from "react";

const ChatSidebar = ({ threads = [], selected, onSelect }) => {
  return (
    <div className="w-1/3 max-w-xs border-r bg-white flex flex-col">

      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold text-lg">Chats</h2>
      </div>

      <div className="flex-1 overflow-y-auto">

        {(!Array.isArray(threads) || threads.length === 0) && (
          <p className="p-4 text-sm text-gray-500">
            No active chats yet
          </p>
        )}

        {Array.isArray(threads) &&
          threads.map((thread) => {
            const user = thread.user;
            const last = thread.lastMessage;
            const isActive = selected && selected._id === user._id;

            return (
              <button
                key={user._id}
                onClick={() => onSelect(user)}
                className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 ${
                  isActive ? "bg-gray-100" : ""
                }`}
              >
                <div className="font-medium text-sm">
                  {user.name}
                </div>

                <div className="text-xs text-gray-500">
                  {last?.text
                    ? last.text.slice(0, 40)
                    : "No messages yet"}
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default ChatSidebar;