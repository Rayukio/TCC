import { Check, Clock, MapPin, Wrench, CheckCircle, Star } from "lucide-react";
import { OrderStatus, OrderStatusLabels, OrderStatusHistory } from "../contexts/OrderContext";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
}

const STATUS_FLOW = [
  OrderStatus.PENDING,
  OrderStatus.ACCEPTED,
  OrderStatus.EN_ROUTE,
  OrderStatus.IN_PROGRESS,
  OrderStatus.COMPLETED,
  OrderStatus.EVALUATED,
];

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  [OrderStatus.PENDING]: <Clock className="w-4 h-4" />,
  [OrderStatus.ACCEPTED]: <Check className="w-4 h-4" />,
  [OrderStatus.EN_ROUTE]: <MapPin className="w-4 h-4" />,
  [OrderStatus.IN_PROGRESS]: <Wrench className="w-4 h-4" />,
  [OrderStatus.COMPLETED]: <CheckCircle className="w-4 h-4" />,
  [OrderStatus.EVALUATED]: <Star className="w-4 h-4" />,
  [OrderStatus.CANCELLED]: <></>,
};

export function OrderTimeline({ currentStatus, statusHistory }: OrderTimelineProps) {
  // Se cancelado, mostra timeline especial
  if (currentStatus === OrderStatus.CANCELLED) {
    return (
      <div className="space-y-4">
        <h4 className="text-[rgb(var(--color-secondary))]">Status do Pedido</h4>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
          <p className="text-red-600">Pedido Cancelado</p>
          {statusHistory[statusHistory.length - 1]?.message && (
            <p className="text-[rgb(var(--color-text-secondary))] mt-2">
              {statusHistory[statusHistory.length - 1].message}
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getHistoryForStatus = (status: OrderStatus) => {
    return statusHistory.find((h) => h.status === status);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-[rgb(var(--color-secondary))]">Acompanhamento do Serviço</h4>
      <div className="space-y-3">
        {STATUS_FLOW.map((status, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          const history = getHistoryForStatus(status);
          const isLast = index === STATUS_FLOW.length - 1;

          return (
            <div key={status} className="flex items-start gap-3">
              {/* Icon/Dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isPast
                      ? "bg-[rgb(var(--color-success))] text-white"
                      : isCurrent
                      ? "bg-[rgb(var(--color-primary))] text-white animate-pulse"
                      : "bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))]"
                  }`}
                >
                  {STATUS_ICONS[status]}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-10 transition-all ${
                      isPast
                        ? "bg-[rgb(var(--color-success))]"
                        : "bg-[rgb(var(--color-border))]"
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 -mt-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`transition-all ${
                      isPast || isCurrent
                        ? "text-[rgb(var(--color-text-primary))]"
                        : "text-[rgb(var(--color-text-muted))]"
                    }`}
                  >
                    {OrderStatusLabels[status]}
                  </p>
                  {history && (
                    <p className="text-[rgb(var(--color-text-muted))]">
                      {formatTime(history.timestamp)}
                    </p>
                  )}
                </div>
                {history?.message && (
                  <p className="text-[rgb(var(--color-text-secondary))] mt-1">
                    {history.message}
                  </p>
                )}
                {isCurrent && !history?.message && (
                  <p className="text-[rgb(var(--color-primary))] mt-1">Em andamento</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
