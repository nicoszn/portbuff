"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from "@/lib/store/useStore";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, User, Search, ArrowLeft, MoreVertical } from 'lucide-react';
import { formatDateTime, generateId } from "@/lib/utils/helpers";

export default function AdminChats() {
  const { t } = useTranslation();
  const { currentUser, users, chatMessages, addChatMessage, markChatRead } = useStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const regularUsers = users.filter((u) => u.role === 'user');

  const conversations = regularUsers.map((user) => {
    const userMsgs = chatMessages.filter(
      (m) =>
        (m.senderId === user.id && m.receiverId === currentUser?.id) ||
        (m.senderId === currentUser?.id && m.receiverId === user.id)
    );
    const lastMsg = userMsgs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    const unread = userMsgs.filter((m) => m.senderId === user.id && !m.read).length;

    return { user, lastMsg, unread };
  }).filter((c) =>
    c.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
    c.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
    c.user.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedMessages = selectedUserId
    ? chatMessages
        .filter(
          (m) =>
            (m.senderId === selectedUserId && m.receiverId === currentUser?.id) ||
            (m.senderId === currentUser?.id && m.receiverId === selectedUserId)
        )
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedMessages, selectedUserId]);

  useEffect(() => {
    if (selectedUserId && currentUser) {
      markChatRead(selectedUserId, currentUser.id);
    }
  }, [selectedUserId, currentUser, markChatRead]);

  const handleSend = () => {
    if (!message.trim() || !currentUser || !selectedUserId) return;

    addChatMessage({
      id: generateId(),
      senderId: currentUser.id,
      receiverId: selectedUserId,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    });

    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100dvh-120px)] lg:h-[calc(100dvh-140px)] max-h-[900px]"
    >
      {/* Header - Hidden on mobile when a chat is open to save space */}
      <div className={`mb-4 shrink-0 transition-all ${selectedUserId ? 'hidden md:block' : 'block'}`}>
        <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">{t('admin.chats')}</h1>
        <p className="text-surface-500 mt-1 text-sm lg:text-base">Chat with your users</p>
      </div>

      {/* Main Chat Interface Container */}
      <div className="flex-1 flex gap-0 md:gap-6 overflow-hidden relative rounded-2xl md:rounded-none bg-white md:bg-transparent">
        
        {/* User List Panel */}
        <div 
          className={`w-full md:w-[350px] lg:w-[400px] bg-white md:rounded-2xl border border-surface-100 flex-col overflow-hidden shrink-0 transition-all duration-300 ${
            selectedUserId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b border-surface-100 bg-white sticky top-0 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                className="w-full bg-surface-50 border border-surface-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-surface-400">
                <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.user.id}
                  onClick={() => setSelectedUserId(conv.user.id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-surface-50 transition-colors border-b border-surface-50 last:border-0 ${
                    selectedUserId === conv.user.id ? 'bg-primary-50/50' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center border border-primary-200">
                      <User className="w-6 h-6 text-primary-700" />
                    </div>
                    {/* Online indicator placeholder */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-semibold text-sm truncate ${selectedUserId === conv.user.id ? 'text-primary-900' : 'text-surface-900'}`}>
                        {conv.user.firstName} {conv.user.lastName}
                      </p>
                      {conv.lastMsg && (
                        <span className="text-[10px] text-surface-400 shrink-0 ml-2">
                          {new Date(conv.lastMsg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs truncate ${conv.unread > 0 ? 'text-surface-900 font-medium' : 'text-surface-500'}`}>
                        {conv.lastMsg?.message || 'No messages yet'}
                      </p>
                      {conv.unread > 0 && (
                        <span className="bg-primary-600 text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shrink-0">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area Panel */}
        <div 
          className={`flex-1 bg-white md:rounded-2xl border-0 md:border border-surface-100 flex-col overflow-hidden relative ${
            !selectedUserId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedUserId && selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 md:p-4 border-b border-surface-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button 
                    onClick={() => setSelectedUserId(null)}
                    className="md:hidden p-2 -ml-2 text-surface-500 hover:text-surface-900 rounded-full hover:bg-surface-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900 text-sm md:text-base leading-tight">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <p className="text-xs text-surface-500 leading-tight">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-surface-400 hover:text-surface-600 rounded-full hover:bg-surface-50 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50/30">
                {selectedMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="w-8 h-8 text-surface-300" />
                    </div>
                    <p className="text-surface-900 font-medium mb-1">No messages yet</p>
                    <p className="text-surface-500 text-sm max-w-xs">
                      Send a message to start the conversation with {selectedUser.firstName}.
                    </p>
                  </div>
                ) : (
                  selectedMessages.map((msg, index) => {
                    const isMine = msg.senderId === currentUser?.id;
                    const showAvatar = !isMine && (index === 0 || selectedMessages[index - 1].senderId !== msg.senderId);
                    
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                        {!isMine && (
                          <div className={`w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                            <User className="w-4 h-4 text-primary-600" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 shadow-sm text-sm ${
                            isMine
                              ? 'bg-primary-600 text-white rounded-2xl rounded-br-sm'
                              : 'bg-white border border-surface-100 text-surface-900 rounded-2xl rounded-bl-sm'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <p className={`text-[10px] mt-1.5 text-right ${isMine ? 'text-primary-200' : 'text-surface-400'}`}>
                            {formatDateTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>

              {/* Input Area */}
              <div className="p-3 md:p-4 border-t border-surface-100 bg-white">
                <div className="flex items-end gap-2 bg-surface-50 border border-surface-200 rounded-2xl p-1 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
                  <textarea
                    rows={1}
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm resize-none focus:outline-none max-h-32 min-h-[44px]"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                    }}
                  />
                  <motion.button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="p-2.5 mb-0.5 mr-0.5 rounded-xl bg-primary-600 text-white disabled:opacity-50 disabled:bg-surface-300 transition-colors shrink-0 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State - Desktop only */
            <div className="flex-1 flex items-center justify-center bg-surface-50/50">
              <div className="text-center max-w-sm px-6">
                <div className="w-20 h-20 bg-white shadow-sm border border-surface-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <MessageCircle className="w-10 h-10 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">Your Messages</h3>
                <p className="text-surface-500 text-sm">
                  Select a user from the list to view your conversation history and start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
