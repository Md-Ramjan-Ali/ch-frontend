import React from "react";
import { Message } from "./types";
import { Send } from "lucide-react";

interface Props {
  conversation: Message[];
  messageInput: string;
  setMessageInput: (value: string) => void;
  onSendMessage: (msg: string) => void;
}

const ConversationBox: React.FC<Props> = ({
  conversation,
  messageInput,
  setMessageInput,
  onSendMessage
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm">
    <div className="p-6 h-[480px] overflow-y-auto">
      {conversation.map(msg => (
        <div
          key={msg.id}
          className={`mb-4 ${msg.isSupport ? "text-right" : "text-left"}`}
        >
          <div
            className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] ${
              msg.isSupport
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
            }`}
          >
            {msg.content}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {msg.time}
          </div>
        </div>
      ))}
    </div>
    <div className="p-4 border-t dark:border-gray-700 flex items-center gap-2">
      <input
        type="text"
        value={messageInput}
        onChange={e => setMessageInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onSendMessage(messageInput);
          }
        }}
      />
      <button
        onClick={() => onSendMessage(messageInput)}
        disabled={!messageInput.trim()}
        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Send size={18} />
      </button>
    </div>
  </div>
);

export default ConversationBox;