"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import { motion } from "framer-motion";
import { X, Send, MessageCircle } from "lucide-react";
import { formatDateTime, generateId } from "@/lib/utils/helpers";

interface Props {
  onClose: () => void;
}

export default function ChatPopup({ onClose }: Props) {
  const { t } = useTranslation();
  const { currentUser, chatMessages, addChatMessage, markChatRead } = useStore();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const adminId = "admin-1";

  const messages = chatMessages
    .filter(
      (m) =>
        (m.senderId === currentUser?.id && m.receiverId === adminId) ||
        (m.senderId === adminId && m.receiverId === currentUser?.id)
    )
    .sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentUser) {
      markChatRead(adminId, currentUser.id);
    }
  }, [currentUser, markChatRead]);

  const handleSend = () => {
    if (!message.trim() || !currentUser) return;

    addChatMessage({
      id: generateId(),
      senderId: currentUser.id,
      receiverId: adminId,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    });

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-[rgba(255,215,120,0.18)] bg-navy-900 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] sm:right-6"
      role="dialog"
      aria-modal="false"
      aria-label={t("chat.title")}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gold-400/15 to-amber-500/10 border-b border-[rgba(255,215,120,0.15)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/20">
            <MessageCircle className="h-4 w-4 text-gold-300" aria-hidden />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gold-200">
              {t("chat.title")}
            </h4>
            <p className="text-xs text-navy-400">{t("chat.admin")}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-navy-300 transition hover:bg-navy-800 hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-gold-400"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Messages */}
      <div className="max-h-[320px] min-h-[220px] flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center">
            <MessageCircle className="mb-3 h-10 w-10 text-navy-600" aria-hidden />
            <p className="text-sm text-navy-400">{t("chat.noMessages")}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    isMine
                      ? "rounded-br-md bg-gold-400/90 text-navy-950"
                      : "rounded-bl-md border border-[rgba(255,215,120,0.1)] bg-navy-800/80 text-navy-100"
                  }`}
                >
                  <p className="break-words">{msg.message}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMine ? "text-navy-800/70" : "text-navy-500"
                    }`}
                  >
                    {formatDateTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[rgba(255,215,120,0.12)] bg-navy-950/50 p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input-field flex-1 py-2 text-sm"
            placeholder={t("chat.placeholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <motion.button
            onClick={handleSend}
            disabled={!message.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-amber-500 text-navy-950 transition hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
            aria-label={t("chat.send")}
          >
            <Send className="h-4 w-4" aria-hidden />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
