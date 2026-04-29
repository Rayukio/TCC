import { ArrowLeft, Send, Paperclip, Image as ImageIcon, Phone, Video } from "lucide-react";
import * as React from "react";
import { getMessages, sendMessage, markAsRead } from "../services/chatService";
import { getStoredUser } from "../services/auth";
import type { Message } from "../types/chat";

interface ChatScreenProps {
  onBack: () => void;
  appointmentId?: string;
}

export function ChatScreen({ onBack, appointmentId }: ChatScreenProps) {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const currentUser = getStoredUser();

  // Carrega mensagens e marca como lidas
  React.useEffect(() => {
    if (!appointmentId) { setLoading(false); return; }
    getMessages(appointmentId)
      .then((data) => { setMessages(data); markAsRead(appointmentId).catch(() => {}); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [appointmentId]);

  // Scroll para última mensagem
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    // Otimista: adiciona mensagem localmente enquanto envia
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      appointmentId: appointmentId ?? "",
      senderId: currentUser?.id ?? "user",
      senderRole: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    if (appointmentId) {
      try {
        const saved = await sendMessage(appointmentId, text);
        setMessages((prev) => prev.map((m) => m.id === tempMsg.id ? saved : m));
      } catch {
        // mantém a mensagem otimista mesmo em caso de erro
      }
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const technician = { name: "Técnico", status: "online", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech" };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex flex-col">
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <img src={technician.avatar} alt={technician.name} className="w-12 h-12 rounded-full bg-white" />
          <div className="flex-1">
            <h3 className="text-white">{technician.name}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-white/80">{technician.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Phone className="w-5 h-5 text-white" /></button>
            <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Video className="w-5 h-5 text-white" /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm text-[rgb(var(--color-text-muted))]">Hoje</div>
        </div>

        {loading && (
          <p className="text-center text-[rgb(var(--color-text-muted))]">Carregando mensagens...</p>
        )}

        {!loading && messages.length === 0 && (
          <p className="text-center text-[rgb(var(--color-text-muted))]">Nenhuma mensagem ainda.</p>
        )}

        {messages.map((msg) => {
          const isUser = msg.senderRole === "user";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isUser ? "bg-[rgb(var(--color-primary))] text-white rounded-br-sm" : "bg-white text-[rgb(var(--color-text-primary))] shadow-sm rounded-bl-sm"}`}>
                <p className="mb-1">{msg.content}</p>
                <span className={isUser ? "text-white/70" : "text-[rgb(var(--color-text-muted))]"}>
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-[rgb(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-background))] flex items-center justify-center"><Paperclip className="w-5 h-5 text-[rgb(var(--color-primary))]" /></button>
          <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-background))] flex items-center justify-center"><ImageIcon className="w-5 h-5 text-[rgb(var(--color-primary))]" /></button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
            placeholder="Digite uma mensagem..."
            className="flex-1 px-4 py-3 bg-[rgb(var(--color-background))] rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
          />
          <button onClick={handleSend} disabled={!input.trim()}
            className="w-12 h-12 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}