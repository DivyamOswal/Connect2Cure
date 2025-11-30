// client/src/components/ChatAndVideo/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";

const ChatWindow = ({ user, messages, onSend, onCall }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const bottomRef = useRef(null);

  // auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!user)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation
      </div>
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    if (typeof onSend === "function") {
      onSend({ text: text.trim(), file });
    }

    setText("");
    setFile(null);

    // clear file input visually
    if (e.target && e.target.reset) {
      e.target.reset();
    }
  };

  const renderAttachment = (msg) => {
    if (!msg.attachment) return null;

    const { url, originalName, mimeType } = msg.attachment;

    if (!url) return null;

    // If image, show preview
    if (mimeType?.startsWith("image/")) {
      return (
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={url}
            alt={originalName || "attachment"}
            className="mt-2 max-w-xs max-h-64 rounded border"
          />
        </a>
      );
    }

    // Otherwise show download link
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs text-blue-100 underline"
      >
        📎 {originalName || "Download file"}
      </a>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg text-gray-900">
            {user.name || "Chat"}
          </h2>
          {user.email && (
            <p className="text-xs text-gray-500">{user.email}</p>
          )}
        </div>
        {onCall && (
          <button
            type="button"
            onClick={() => onCall(user._id)}
            className="bg-green-600 text-white px-3 py-1 rounded-full text-sm"
          >
            📞 Call
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
        {messages.map((msg) => {
          const isFromOther =
            String(msg.sender?._id || msg.sender) === String(user._id);

          return (
            <div
              key={msg._id || `${msg.createdAt}-${Math.random()}`}
              className={`max-w-xs p-3 rounded-lg text-sm ${
                isFromOther
                  ? "bg-gray-300 text-gray-900 mr-auto"
                  : "bg-[#FF8040] text-white ml-auto"
              }`}
            >
              {msg.text && <div>{msg.text}</div>}
              {renderAttachment(msg)}
              {msg.pending && (
                <div className="mt-1 text-[10px] opacity-70">Sending...</div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input + file attach */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t flex flex-col gap-2 bg-white"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-full px-3 py-2 text-sm"
            placeholder="Type message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#FF8040] text-white px-4 rounded-full text-sm"
          >
            Send
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <label className="cursor-pointer">
            <span className="px-3 py-1 border rounded-full bg-gray-100 hover:bg-gray-200">
              📎 Attach file
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          {file && (
            <span>
              Selected: <strong>{file.name}</strong>
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
