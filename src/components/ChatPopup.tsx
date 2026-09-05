import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../stores/useStore';
import { motion } from 'framer-motion';
import { X, Send, MessageCircle } from 'lucide-react';
import { formatDateTime, generateId } from '../utils/helpers';

interface Props {
  onClose: () => void;
}

export default function ChatPopup({ onClose }: Props) {
  const { t } = useTranslation();
  const { currentUser, chatMessages, addChatMessage, markChatRead } = useStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const adminId = 'admin-1';

  const messages = chatMessages
    .filter(
      (m) =>
        (m.senderId === currentUser?.id && m.receiverId === adminId) ||
        (m.senderId === adminId && m.receiverId === currentUser?.id)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-surface-100 z-50 flex flex-col max-h-[500px]"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{t('chat.title')}</h4>
            <p className="text-xs text-primary-200">{t('chat.admin')}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-10 h-10 text-surface-200 mx-auto mb-2" />
            <p className="text-surface-400 text-sm">{t('chat.noMessages')}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    isMine
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-surface-100 text-surface-900 rounded-bl-md'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-200' : 'text-surface-400'}`}>
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
      <div className="p-3 border-t border-surface-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={t('chat.placeholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <motion.button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-9 h-9 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
