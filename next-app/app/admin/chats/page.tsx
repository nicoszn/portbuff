"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/stores/useStore";
import AdminLayout from "@/components/layout/AdminLayout";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { MessageSquare, Search, ArrowLeft, Send } from "lucide-react";

export default function AdminChatsPage() {
  return (
    <AdminLayout>
      <AdminChatsContent />
    </AdminLayout>
  );
}

function AdminChatsContent() {
  const { t } = useTranslation();
  const { users, chatMessages, addChatMessage } = useStore();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const activeChatUsers = chatMessages.reduce<
    Record<string, { user: (typeof users)[0] | null; lastMessage: (typeof chatMessages)[0] | null }>
  >((acc, msg) => {
    const key = msg.senderId === "admin-1" ? msg.receiverId : msg.senderId;
    const user = users.find((u) => u.id === key);
    if (!user) return acc;
    const existing = acc[key];
    if (!existing || new Date(msg.createdAt).getTime() > new Date(existing.lastMessage?.createdAt ?? 0).getTime()) {
      acc[key] = { user, lastMessage: msg };
    }
    return acc;
  }, {});

  const sideMessages = selectedUser
    ? chatMessages
        .filter(
          (m) =>
            (m.senderId === selectedUser && m.receiverId === "admin-1") ||
            (m.senderId === "admin-1" && m.receiverId === selectedUser)
        )
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    : [];

  const filteredUsers = search.trim() === ""
    ? Object.values(activeChatUsers)
    : Object.values(activeChatUsers).filter((item) => {
        if (!item.user) return false;
        return (
          item.user.email.toLowerCase().includes(search.toLowerCase()) ||
          `${item.user.firstName} ${item.user.lastName}`.toLowerCase().includes(search.toLowerCase())
        );
      });

  const selectedUserObj = selectedUser
    ? users.find((u) => u.id === selectedUser) ?? null
    : null;

  const handleSend = () => {
    if (!message.trim() || !selectedUser) return;
    addChatMessage({
      id: `msg-${Date.now()}`,
      senderId: "admin-1",
      receiverId: selectedUser,
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    });
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gold-200">
            {t("admin.chats")}
          </h1>
          <p className="mt-1 text-sm text-navy-300">
            Chat with users
          </p>
        </div>
      </div>

      <div className="flex gap-4 lg:flex-row lg:flex-1">
        <div className="w-full lg:w-72 shrink-0">
          <div className="mb-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-navy-400" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="input-field w-full pl-9"
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/70 p-2 backdrop-blur-sm">
            {filteredUsers.length === 0 ? (
              <div className="py-6 text-center text-sm text-navy-400">
                No active chats
              </div>
            ) : (
              filteredUsers.map(({ user, lastMessage }) => (
                <button
                  key={user?.id}
                  onClick={() => setSelectedUser(user?.id ?? null)}
                  className={`flex w-full flex-col gap-1 rounded-xl p-3 text-left transition ${
                    selectedUser === user?.id
                      ? "bg-gold-400/15 border border-gold-400/30"
                      : "hover:bg-navy-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-300/20 to-amber-500/20 text-xs font-bold text-gold-300">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </div>
                    <span className="truncate text-sm font-medium text-navy-200">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {lastMessage && (
                      <span className="truncate text-xs text-navy-400">
                        {lastMessage.senderId === "admin-1" ? "You: " : ""}
                        {lastMessage.message}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-navy-500">
                    {format(new Date(lastMessage?.createdAt ?? 0), "MMM d, h:mm a")}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          {selectedUser && selectedUserObj ? (
            <>
              <div className="flex items-center gap-3 rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-900/70 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-300/20 to-amber-500/20 text-sm font-bold text-gold-300">
                  {selectedUserObj.firstName?.charAt(0)}
                  {selectedUserObj.lastName?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-navy-200">
                    {selectedUserObj.firstName} {selectedUserObj.lastName}
                  </div>
                  <div className="text-xs text-navy-400 truncate">
                    {selectedUserObj.email}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="ml-auto flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs text-navy-400 transition hover:text-gold-300"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  Close
                </button>
              </div>
              <div className="mt-2 flex-1 overflow-y-auto rounded-2xl border border-[rgba(255,215,120,0.12)] bg-navy-800/40 p-4">
                {sideMessages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-navy-400">
                    {t("chat.noMessages")}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {sideMessages.map((msg) => {
                      const isMine = msg.senderId === "admin-1";
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                              isMine
                                ? "rounded-br-md bg-gold-400/15 text-gold-200 border border-gold-400/20"
                                : "rounded-bl-md bg-navy-800/60 text-navy-200 border border-[rgba(255,215,120,0.1)]"
                            }`}
                          >
                            {msg.message}
                          </div>
                          <div className={`mt-1 text-[10px] text-navy-500 ${isMine ? "text-right" : "text-left"}`}>
                            {format(new Date(msg.createdAt), "h:mm a")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={t("chat.placeholder") || "Type a message..."}
                  className="input-field flex-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="btn-primary shrink-0"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  {t("chat.send") || "Send"}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center rounded-2xl border border-dashed border-[rgba(255,215,120,0.12)] bg-navy-900/30 text-center text-sm text-navy-400">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-navy-500" aria-hidden />
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
