import { ArrowLeft, Phone, MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import * as React from "react";
import { useOrder, OrderStatus } from "../contexts/OrderContext";
import { OrderTimeline } from "./OrderTimeline";
import { OrderStatusController } from "./OrderStatusController";
import { RatingModal } from "./RatingModal";

interface TrackingScreenProps {
  onBack: () => void;
  onOpenChat: () => void;
}

export function TrackingScreen({ onBack, onOpenChat }: TrackingScreenProps) {
  const { activeOrder } = useOrder();
  const [showRatingModal, setShowRatingModal] = React.useState(false);

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-background))] flex items-center justify-center">
        <p className="text-[rgb(var(--color-text-secondary))]">Nenhum pedido ativo</p>
      </div>
    );
  }

  const eta = activeOrder.estimatedArrival || 15;

  // Determina se deve mostrar ETA
  const showETA = activeOrder.currentStatus === OrderStatus.EN_ROUTE;
  const isCompleted = activeOrder.currentStatus === OrderStatus.COMPLETED;

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-6">
      {/* Order Status Controller for testing */}
      <OrderStatusController />
      
      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          orderId={activeOrder.id}
          technicianName={activeOrder.technician.name}
          onClose={() => setShowRatingModal(false)}
          onSubmit={() => {
            setShowRatingModal(false);
            // Pode adicionar toast de sucesso aqui
          }}
        />
      )}

      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Acompanhamento</h2>
        </div>

        {/* Service Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[rgb(var(--color-secondary))] mb-1">{activeOrder.service}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Pedido #{activeOrder.id.padStart(4, '0')}</p>
            </div>
            {showETA && (
              <div className="text-center">
                <div className="flex items-center gap-2 text-[rgb(var(--color-primary))]">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{eta} min</span>
                </div>
                <p className="text-[rgb(var(--color-text-muted))]">Previsão</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Completed Service Banner */}
        {isCompleted && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="text-green-900">Serviço Concluído!</h4>
                <p className="text-green-700">O técnico finalizou o atendimento</p>
              </div>
            </div>
            <button
              onClick={() => setShowRatingModal(true)}
              className="w-full bg-[rgb(var(--color-primary))] text-white px-6 py-3 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
            >
              Avaliar Atendimento
            </button>
          </div>
        )}

        {/* Technician Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h4 className="text-[rgb(var(--color-secondary))] mb-4">Técnico Responsável</h4>
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
              onClick={onOpenChat}
              className="flex items-center justify-center gap-2 bg-[rgb(var(--color-primary))] text-white px-4 py-3 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h4 className="text-[rgb(var(--color-secondary))] mb-4">Detalhes do Serviço</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-[rgb(var(--color-border))]">
              <span className="text-[rgb(var(--color-text-secondary))]">Data</span>
              <span className="text-[rgb(var(--color-text-primary))]">{activeOrder.date}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[rgb(var(--color-border))]">
              <span className="text-[rgb(var(--color-text-secondary))]">Horário</span>
              <span className="text-[rgb(var(--color-text-primary))]">{activeOrder.time}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-[rgb(var(--color-border))]">
              <span className="text-[rgb(var(--color-text-secondary))]">Local</span>
              <span className="text-[rgb(var(--color-text-primary))] text-right">{activeOrder.location}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[rgb(var(--color-text-secondary))]">Valor</span>
              <span className="text-[rgb(var(--color-primary))]">{activeOrder.price}</span>
            </div>
          </div>
        </div>

        {/* Timeline with Order Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <OrderTimeline 
            currentStatus={activeOrder.currentStatus}
            statusHistory={activeOrder.statusHistory}
          />
        </div>
      </div>
    </div>
  );
}