// src/components/ChatAndVideo/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";

const ChatWindow = ({ user, messages, onSend, onCall }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const bottomRef = useRef();

  if (!user)
    return (
      <div className="w-2/3 flex items-center justify-center text-gray-500">
        Select a conversation
      </div>
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    onSend({ text: text.trim(), file });
    setText("");
    setFile(null);
    e.target.reset?.(); // clear file input visually
  };

  const renderAttachment = (msg) => {
    if (!msg.attachment) return null;

    const { url, originalName, mimeType } = msg.attachment;

    // If it's an image, show thumbnail
    if (mimeType?.startsWith("image/")) {
      return (
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={url}
            alt={originalName}
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
        className="mt-2 inline-block text-xs text-blue-600 underline"
      >
        📎 {originalName || "Download file"}
      </a>
    );
  };

  return (
    <div className="w-2/3 h-160 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">{user.name}</h2>
        {onCall && (
          <button
            onClick={() => onCall(user._id)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            📞 Call
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs p-3 rounded-lg ${
              String(msg.sender) === String(user._id)
                ? "bg-gray-300 text-black mr-auto"
                : "bg-[#FF8040] text-white ml-auto"
            }`}
          >
            {msg.text && <div>{msg.text}</div>}
            {renderAttachment(msg)}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input + file attach */}
      <form onSubmit={handleSubmit} className="p-4 border-t flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Type message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="bg-[#FF8040] text-white px-4 rounded">
            Send
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600">
          <label className="cursor-pointer">
            <span className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200">
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
