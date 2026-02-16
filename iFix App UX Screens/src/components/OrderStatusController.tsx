import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";
import { useOrder, OrderStatus, OrderStatusLabels } from "../contexts/OrderContext";

/**
 * Componente de controle de estados do pedido - útil para demonstração e testes
 * Em produção, as transições seriam controladas pelo backend
 */
export function OrderStatusController() {
  const { activeOrder, updateOrderStatus, canTransitionTo } = useOrder();
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!activeOrder) return null;

  // Estados possíveis para transição
  const possibleTransitions = Object.values(OrderStatus).filter((status) =>
    canTransitionTo(activeOrder.currentStatus, status)
  );

  const handleTransition = (newStatus: OrderStatus) => {
    const messages: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: "Aguardando confirmação do técnico",
      [OrderStatus.ACCEPTED]: "Técnico confirmou o atendimento",
      [OrderStatus.EN_ROUTE]: "Técnico saiu para o atendimento",
      [OrderStatus.IN_PROGRESS]: "Técnico iniciou o serviço",
      [OrderStatus.COMPLETED]: "Serviço finalizado com sucesso",
      [OrderStatus.EVALUATED]: "Cliente avaliou o serviço",
      [OrderStatus.CANCELLED]: "Pedido cancelado",
    };

    updateOrderStatus(activeOrder.id, newStatus, messages[newStatus]);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-[rgb(var(--color-secondary))] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-[rgb(var(--color-primary-dark))] transition-colors"
      >
        <span>Controle de Status</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isExpanded && (
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-2xl shadow-xl p-4 min-w-[280px]">
          <div className="mb-3">
            <p className="text-[rgb(var(--color-text-muted))]">Status Atual</p>
            <p className="text-[rgb(var(--color-primary))]">
              {OrderStatusLabels[activeOrder.currentStatus]}
            </p>
          </div>

          {possibleTransitions.length > 0 ? (
            <>
              <div className="border-t border-[rgb(var(--color-border))] pt-3 mb-2">
                <p className="text-[rgb(var(--color-text-muted))] mb-2">
                  Transições Disponíveis
                </p>
              </div>
              <div className="space-y-2">
                {possibleTransitions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleTransition(status)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[rgb(var(--color-background))] transition-colors text-[rgb(var(--color-text-primary))]"
                  >
                    {OrderStatusLabels[status]}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="border-t border-[rgb(var(--color-border))] pt-3">
              <p className="text-[rgb(var(--color-text-muted))]">
                Nenhuma transição disponível
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
