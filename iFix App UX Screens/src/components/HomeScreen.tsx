import { Search, Bell, Calendar, Home, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useOrder, OrderStatusLabels, OrderStatusColors } from "../contexts/OrderContext";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { orders, setActiveOrder } = useOrder();

  const services = [
    {
      icon: "📱",
      name: "Smartphones",
      count: "45 técnicos",
    },
    {
      icon: "💻",
      name: "Computadores",
      count: "38 técnicos",
    },
    {
      icon: "🖨️",
      name: "Impressoras",
      count: "22 técnicos",
    },
  ];

  const topTechnicians = [
    {
      id: 1,
      name: "Lucas Souza",
      specialty: "Manutenção de smartphones",
      rating: 5.0,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1746005718004-1f992c399428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwcmVwYWlyJTIwdGVjaG5pY2lhbnxlbnwxfHx8fDE3NjQwNzE0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      name: "Carlos Silva",
      specialty: "Manutenção de computação",
      rating: 4.9,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1761207850745-d41a776ef897?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHJlcGFpciUyMHNlcnZpY2V8ZW58MXx8fHwxNzY0MDkxMjM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  // Filtra pedidos ativos (não cancelados e não avaliados)
  const activeAppointments = orders.filter(
    (order) => 
      order.currentStatus !== "CANCELLED" && 
      order.currentStatus !== "EVALUATED"
  );

  const handleViewAppointment = (orderId: string) => {
    setActiveOrder(orderId);
    onNavigate('appointment-detail');
  };

  const handleChatAppointment = (orderId: string) => {
    setActiveOrder(orderId);
    onNavigate('chat');
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-24">
      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/80 mb-1">Olá,</p>
            <h2 className="text-white">Maria Santos</h2>
          </div>
          <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="Buscar técnicos..."
            onClick={() => onNavigate('search')}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-dark))] cursor-pointer"
            readOnly
          />
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Services Grid */}
        <div className="mb-8">
          <h3 className="mb-4 text-[rgb(var(--color-secondary))]">Categorias</h3>
          <div className="grid grid-cols-3 gap-4">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => onNavigate('search')}
                className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl">{service.icon}</div>
                <div className="text-center">
                  <p className="text-[rgb(var(--color-text-primary))] mb-1">{service.name}</p>
                  <p className="text-[rgb(var(--color-text-muted))]">{service.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Appointments */}
        {activeAppointments.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[rgb(var(--color-secondary))]">Agendamentos Ativos</h3>
            </div>
            {activeAppointments.map((appointment) => {
              const statusColor = OrderStatusColors[appointment.currentStatus];
              const statusLabel = OrderStatusLabels[appointment.currentStatus];
              
              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-sm p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-[rgb(var(--color-secondary))] mb-1">{appointment.technician.name}</h4>
                      <p className="text-[rgb(var(--color-text-secondary))]">{appointment.service}</p>
                    </div>
                    <div 
                      className="px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${statusColor}15`,
                        color: statusColor
                      }}
                    >
                      {statusLabel}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAppointment(appointment.id);
                      }}
                      className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatAppointment(appointment.id);
                      }}
                      className="px-4 py-2 bg-white text-[rgb(var(--color-primary))] border-2 border-[rgb(var(--color-primary))] rounded-xl hover:bg-[rgb(var(--color-primary-light))]/20 transition-colors"
                    >
                      Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Top Technicians */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[rgb(var(--color-secondary))]">Técnicos em Destaque</h3>
            <button onClick={() => onNavigate('search')} className="text-[rgb(var(--color-primary))]">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {topTechnicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => onNavigate('technician-detail')}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <ImageWithFallback
                  src={tech.image}
                  alt={tech.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-[rgb(var(--color-secondary))] mb-1">{tech.name}</h4>
                  <p className="text-[rgb(var(--color-text-secondary))] mb-2">{tech.specialty}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[rgb(var(--color-warning))]">★</span>
                    ))}
                    <span className="text-[rgb(var(--color-text-secondary))] ml-2">{tech.rating}</span>
                    <span className="text-[rgb(var(--color-text-muted))]">({tech.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgb(var(--color-border))] px-6 py-4">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-[rgb(var(--color-primary))]" />
            <span className="text-[rgb(var(--color-primary))]">Início</span>
          </button>
          <button onClick={() => onNavigate('search')} className="flex flex-col items-center gap-1">
            <Search className="w-6 h-6 text-[rgb(var(--color-text-muted))]" />
            <span className="text-[rgb(var(--color-text-muted))]">Buscar</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Calendar className="w-6 h-6 text-[rgb(var(--color-text-muted))]" />
            <span className="text-[rgb(var(--color-text-muted))]">Agendamentos</span>
          </button>
          <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-[rgb(var(--color-text-muted))]" />
            <span className="text-[rgb(var(--color-text-muted))]">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}