import { ArrowLeft, Calendar, Clock, MapPin, MessageCircle, Phone, Navigation } from "lucide-react";
import { useOrder, OrderStatusLabels, OrderStatusColors } from "../contexts/OrderContext";
import { OrderStatusController } from "./OrderStatusController";

interface AppointmentDetailScreenProps {
  onBack: () => void;
  onTrack: () => void;
  onChat: () => void;
}

export function AppointmentDetailScreen({ onBack, onTrack, onChat }: AppointmentDetailScreenProps) {
  const { activeOrder, cancelOrder } = useOrder();

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center">
        <p className="text-[rgb(var(--color-text-secondary))]">Nenhum pedido ativo</p>
      </div>
    );
  }

  const handleCancelOrder = () => {
    if (window.confirm("Deseja realmente cancelar este agendamento?")) {
      cancelOrder(activeOrder.id, "Cancelado pelo cliente");
      onBack();
    }
  };

  const statusColor = OrderStatusColors[activeOrder.currentStatus];
  const statusLabel = OrderStatusLabels[activeOrder.currentStatus];

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-6">
      {/* Order Status Controller for testing */}
      <OrderStatusController />
      
      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Agendamento</h2>
        </div>

        {/* Status Badge */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[rgb(var(--color-secondary))] mb-1">{activeOrder.service}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">#{activeOrder.id.padStart(4, '0')}</p>
            </div>
            <div 
              className="px-4 py-2 rounded-full"
              style={{ 
                backgroundColor: `${statusColor}15`,
                color: statusColor
              }}
            >
              {statusLabel}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-3 text-[rgb(var(--color-text-secondary))]">
              <Calendar className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              <span>{activeOrder.date}</span>
            </div>
            <div className="flex items-center gap-3 text-[rgb(var(--color-text-secondary))]">
              <Clock className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              <span>{activeOrder.time}</span>
            </div>
            <div className="flex items-center gap-3 text-[rgb(var(--color-text-secondary))]">
              <MapPin className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              <span>{activeOrder.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Technician Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h4 className="text-[rgb(var(--color-secondary))] mb-4">Técnico</h4>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={activeOrder.technician.avatar}
              alt={activeOrder.technician.name}
              className="w-16 h-16 rounded-full bg-[rgb(var(--color-primary-light))]"
            />
            <div className="flex-1">
              <h4 className="text-[rgb(var(--color-text-primary))] mb-1">{activeOrder.technician.name}</h4>
              <p className="text-[rgb(var(--color-text-secondary))]">{activeOrder.technician.phone}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[rgb(var(--color-warning))]">★</span>
                <span className="text-[rgb(var(--color-text-secondary))]">{activeOrder.technician.rating}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-[rgb(var(--color-primary))] text-white px-4 py-3 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors">
              <Phone className="w-5 h-5" />
              <span>Ligar</span>
            </button>
            <button
              onClick={onChat}
              className="flex items-center justify-center gap-2 bg-[rgb(var(--color-primary))] text-white px-4 py-3 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* Track Technician */}
        <button
          onClick={onTrack}
          className="w-full bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-dark))] text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h4 className="mb-1">Rastrear Técnico</h4>
              <p className="text-white/80">Acompanhe em tempo real</p>
            </div>
            <Navigation className="w-8 h-8" />
          </div>
        </button>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h4 className="text-[rgb(var(--color-secondary))] mb-4">Resumo do Pagamento</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-[rgb(var(--color-text-secondary))]">
              <span>Serviço</span>
              <span>{activeOrder.price}</span>
            </div>
            <div className="flex justify-between text-[rgb(var(--color-text-secondary))]">
              <span>Taxa de serviço</span>
              <span>R$ 0</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[rgb(var(--color-border))]">
              <span className="text-[rgb(var(--color-text-primary))]">Total</span>
              <span className="text-[rgb(var(--color-primary))]">{activeOrder.price}</span>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-[rgb(var(--color-primary-light))]/20 rounded-2xl p-6 border border-[rgb(var(--color-primary-light))]">
          <h4 className="text-[rgb(var(--color-primary-dark))] mb-3">Informações Importantes</h4>
          <ul className="space-y-2 text-[rgb(var(--color-text-secondary))]">
            <li>• O técnico chegará no horário agendado</li>
            <li>• Tenha o equipamento pronto para o atendimento</li>
            <li>• O pagamento será feito após a conclusão do serviço</li>
            <li>• Você receberá uma nota fiscal digital</li>
          </ul>
        </div>

        {/* Cancel Button */}
        <button 
          onClick={handleCancelOrder}
          className="w-full mt-6 text-red-600 px-6 py-3 rounded-xl border-2 border-red-600 hover:bg-red-50 transition-colors"
        >
          Cancelar Agendamento
        </button>
      </div>
    </div>
  );
}