import { ArrowLeft, Send, Paperclip, Image as ImageIcon, Phone, Video } from "lucide-react";
import * as React from "react";

interface ChatScreenProps {
  onBack: () => void;
}

export function ChatScreen({ onBack }: ChatScreenProps) {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      sender: "technician",
      text: "Olá! Recebi sua solicitação de serviço. Posso confirmar que estarei aí amanhã às 15:00.",
      timestamp: "14:30",
    },
    {
      id: 2,
      sender: "user",
      text: "Perfeito! Você pode trazer uma tela nova caso precise trocar?",
      timestamp: "14:32",
    },
    {
      id: 3,
      sender: "technician",
      text: "Sim, tenho telas originais em estoque. Vou levar algumas opções.",
      timestamp: "14:33",
    },
    {
      id: 4,
      sender: "user",
      text: "Ótimo! Muito obrigada.",
      timestamp: "14:34",
    },
    {
      id: 5,
      sender: "technician",
      text: "Por nada! Qualquer dúvida estou à disposição. Até amanhã! 👍",
      timestamp: "14:35",
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "user",
          text: message,
          timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setMessage("");
    }
  };

  const technician = {
    name: "Carlos Silva",
    status: "online",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] flex flex-col">
      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-4 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <img
            src={technician.avatar}
            alt={technician.name}
            className="w-12 h-12 rounded-full bg-white"
          />
          <div className="flex-1">
            <h3 className="text-white">{technician.name}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-white/80">{technician.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm text-[rgb(var(--color-text-muted))]">
            Hoje
          </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.sender === "user"
                  ? "bg-[rgb(var(--color-primary))] text-white rounded-br-sm"
                  : "bg-white text-[rgb(var(--color-text-primary))] shadow-sm rounded-bl-sm"
              }`}
            >
              <p className="mb-1">{msg.text}</p>
              <span
                className={`${
                  msg.sender === "user" ? "text-white/70" : "text-[rgb(var(--color-text-muted))]"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-[rgb(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-background))] flex items-center justify-center">
            <Paperclip className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[rgb(var(--color-background))] flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-[rgb(var(--color-primary))]" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite uma mensagem..."
            className="flex-1 px-4 py-3 bg-[rgb(var(--color-background))] rounded-full focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-12 h-12 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
