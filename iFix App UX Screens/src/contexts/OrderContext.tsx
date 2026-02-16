import * as React from "react";

// Estados possíveis de um pedido
export enum OrderStatus {
  PENDING = "PENDING",           // Aguardando aceitação do técnico
  ACCEPTED = "ACCEPTED",         // Técnico aceitou o serviço
  EN_ROUTE = "EN_ROUTE",         // Técnico a caminho
  IN_PROGRESS = "IN_PROGRESS",   // Técnico realizando o atendimento
  COMPLETED = "COMPLETED",       // Serviço concluído
  EVALUATED = "EVALUATED",       // Cliente avaliou o serviço
  CANCELLED = "CANCELLED",       // Serviço cancelado
}

// Labels para exibição dos estados
export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Aguardando Confirmação",
  [OrderStatus.ACCEPTED]: "Confirmado",
  [OrderStatus.EN_ROUTE]: "Técnico a Caminho",
  [OrderStatus.IN_PROGRESS]: "Em Atendimento",
  [OrderStatus.COMPLETED]: "Concluído",
  [OrderStatus.EVALUATED]: "Avaliado",
  [OrderStatus.CANCELLED]: "Cancelado",
};

// Cores dos estados
export const OrderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "rgb(var(--color-warning))",
  [OrderStatus.ACCEPTED]: "rgb(var(--color-success))",
  [OrderStatus.EN_ROUTE]: "rgb(var(--color-primary))",
  [OrderStatus.IN_PROGRESS]: "rgb(var(--color-primary))",
  [OrderStatus.COMPLETED]: "rgb(var(--color-success))",
  [OrderStatus.EVALUATED]: "rgb(var(--color-success))",
  [OrderStatus.CANCELLED]: "rgb(var(--color-error))",
};

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  message?: string;
}

export interface Order {
  id: string;
  service: string;
  technician: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    avatar: string;
  };
  date: string;
  time: string;
  location: string;
  price: string;
  currentStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
  estimatedArrival?: number; // em minutos
  currentLocation?: string;
  vehicle?: string;
}

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, message?: string) => boolean;
  cancelOrder: (orderId: string, reason?: string) => boolean;
  canTransitionTo: (currentStatus: OrderStatus, newStatus: OrderStatus) => boolean;
  evaluateOrder: (orderId: string, rating: number, comment?: string) => boolean;
}

const OrderContext = React.createContext<OrderContextType | undefined>(undefined);

// Regras de transição entre estados
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED],
  [OrderStatus.ACCEPTED]: [OrderStatus.EN_ROUTE, OrderStatus.CANCELLED],
  [OrderStatus.EN_ROUTE]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED],
  [OrderStatus.IN_PROGRESS]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  [OrderStatus.COMPLETED]: [OrderStatus.EVALUATED],
  [OrderStatus.EVALUATED]: [],
  [OrderStatus.CANCELLED]: [],
};

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = React.useState<Order[]>([
    {
      id: "1",
      service: "Manutenção de computação",
      technician: {
        id: "tech-1",
        name: "Carlos Silva",
        phone: "+55 (11) 98765-4321",
        rating: 4.9,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      },
      date: "Hoje, 16 Fev",
      time: "15:00",
      location: "Rua Exemplo, 123 - São Paulo, SP",
      price: "R$ 80",
      currentStatus: OrderStatus.EN_ROUTE,
      statusHistory: [
        {
          status: OrderStatus.PENDING,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
          message: "Solicitação criada",
        },
        {
          status: OrderStatus.ACCEPTED,
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 horas atrás
          message: "Técnico aceitou o serviço",
        },
        {
          status: OrderStatus.EN_ROUTE,
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
          message: "Técnico iniciou o deslocamento",
        },
      ],
      estimatedArrival: 15,
      currentLocation: "Av. Paulista, 1000",
      vehicle: "Moto Honda - ABC1234",
    },
  ]);

  const [activeOrderId, setActiveOrderId] = React.useState<string>("1");

  const activeOrder = orders.find((order) => order.id === activeOrderId) || null;

  const setActiveOrder = (orderId: string) => {
    setActiveOrderId(orderId);
  };

  const canTransitionTo = (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
    return ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    message?: string
  ): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    // Verifica se a transição é permitida
    if (!canTransitionTo(order.currentStatus, newStatus)) {
      console.warn(
        `Transição não permitida: ${order.currentStatus} -> ${newStatus}`
      );
      return false;
    }

    const oldStatus = order.currentStatus;

    // Atualiza o pedido
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              currentStatus: newStatus,
              statusHistory: [
                ...o.statusHistory,
                {
                  status: newStatus,
                  timestamp: new Date(),
                  message: message || OrderStatusLabels[newStatus],
                },
              ],
            }
          : o
      )
    );

    // Notifica sistema de reputação através de evento customizado
    window.dispatchEvent(
      new CustomEvent("orderStatusChanged", {
        detail: {
          orderId,
          technicianId: order.technician.id,
          oldStatus,
          newStatus,
        },
      })
    );

    return true;
  };

  const evaluateOrder = (
    orderId: string,
    rating: number,
    comment?: string
  ): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.currentStatus !== OrderStatus.COMPLETED) {
      return false;
    }

    // Atualiza para avaliado
    const success = updateOrderStatus(
      orderId,
      OrderStatus.EVALUATED,
      `Cliente avaliou com ${rating} estrelas`
    );

    if (success) {
      // Notifica sistema de reputação
      window.dispatchEvent(
        new CustomEvent("orderEvaluated", {
          detail: {
            orderId,
            technicianId: order.technician.id,
            rating,
            comment,
          },
        })
      );
    }

    return success;
  };

  const cancelOrder = (orderId: string, reason?: string): boolean => {
    return updateOrderStatus(
      orderId,
      OrderStatus.CANCELLED,
      reason || "Pedido cancelado pelo cliente"
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        setActiveOrder,
        updateOrderStatus,
        cancelOrder,
        canTransitionTo,
        evaluateOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = React.useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}