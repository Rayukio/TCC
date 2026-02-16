import * as React from "react";
import { OrderStatus } from "./OrderContext";

/**
 * Sistema de Reputação e Regras de Negócio
 * Integrado com fluxo de estados para garantir consistência e rastreabilidade
 */

// Níveis de reputação do técnico
export enum ReputationLevel {
  NOVATO = "NOVATO",           // 0-20 serviços
  EXPERIENTE = "EXPERIENTE",   // 21-50 serviços
  PROFISSIONAL = "PROFISSIONAL", // 51-100 serviços
  ESPECIALISTA = "ESPECIALISTA", // 101-200 serviços
  MASTER = "MASTER",           // 200+ serviços
}

export const ReputationLevelLabels: Record<ReputationLevel, string> = {
  [ReputationLevel.NOVATO]: "Novato",
  [ReputationLevel.EXPERIENTE]: "Experiente",
  [ReputationLevel.PROFISSIONAL]: "Profissional",
  [ReputationLevel.ESPECIALISTA]: "Especialista",
  [ReputationLevel.MASTER]: "Master",
};

// Badges de conquistas
export enum Badge {
  PONTUAL = "PONTUAL",                 // 95%+ pontualidade
  COMUNICATIVO = "COMUNICATIVO",       // Resposta rápida no chat
  QUALIDADE = "QUALIDADE",             // 4.8+ estrelas
  CONFIAVEL = "CONFIAVEL",             // Baixa taxa de cancelamento
  RAPIDO = "RAPIDO",                   // Tempo médio baixo
  PRIMEIRO_ATENDIMENTO = "PRIMEIRO_ATENDIMENTO", // Primeira vez
  STREAK = "STREAK",                   // 10+ atendimentos consecutivos sem problema
}

export const BadgeLabels: Record<Badge, string> = {
  [Badge.PONTUAL]: "Sempre Pontual",
  [Badge.COMUNICATIVO]: "Super Comunicativo",
  [Badge.QUALIDADE]: "Alta Qualidade",
  [Badge.CONFIAVEL]: "Confiável",
  [Badge.RAPIDO]: "Atendimento Rápido",
  [Badge.PRIMEIRO_ATENDIMENTO]: "Primeiro Cliente",
  [Badge.STREAK]: "Sequência Perfeita",
};

// Penalidades
export enum Penalty {
  ATRASO = "ATRASO",
  CANCELAMENTO = "CANCELAMENTO",
  AVALIACAO_BAIXA = "AVALIACAO_BAIXA",
  SEM_RESPOSTA = "SEM_RESPOSTA",
}

// Métricas do técnico
export interface TechnicianMetrics {
  totalServices: number;
  completedServices: number;
  cancelledServices: number;
  averageRating: number;
  totalReviews: number;
  responseTime: number; // em minutos
  punctualityRate: number; // 0-100
  completionRate: number; // 0-100
  badges: Badge[];
  penalties: { type: Penalty; timestamp: Date; reason: string }[];
  reputationScore: number; // 0-1000
  level: ReputationLevel;
}

// Regras de negócio baseadas em estados
export interface StateBusinessRules {
  canAcceptNewOrders: boolean;
  maxConcurrentOrders: number;
  requiresDeposit: boolean;
  priorityInSearch: number; // 1-10
  cancellationPenalty: number; // pontos perdidos
  autoRejectTime: number; // minutos até auto-rejeitar se não aceitar
}

// Evento de auditoria
export interface AuditEvent {
  id: string;
  orderId: string;
  technicianId: string;
  timestamp: Date;
  eventType: 
    | "ORDER_CREATED"
    | "ORDER_ACCEPTED"
    | "ORDER_CANCELLED"
    | "ORDER_COMPLETED"
    | "RATING_GIVEN"
    | "PENALTY_APPLIED"
    | "BADGE_EARNED"
    | "LEVEL_UP";
  metadata: Record<string, any>;
  affectedMetrics: string[];
}

interface ReputationContextType {
  technicians: Map<string, TechnicianMetrics>;
  getTechnicianMetrics: (technicianId: string) => TechnicianMetrics | undefined;
  updateMetricsOnStateChange: (
    technicianId: string,
    orderId: string,
    oldStatus: OrderStatus | null,
    newStatus: OrderStatus
  ) => void;
  applyRating: (technicianId: string, orderId: string, rating: number, comment?: string) => void;
  getBusinessRules: (technicianId: string) => StateBusinessRules;
  auditLog: AuditEvent[];
}

const ReputationContext = React.createContext<ReputationContextType | undefined>(undefined);

// Calcula nível baseado em número de serviços
function calculateLevel(completedServices: number): ReputationLevel {
  if (completedServices >= 200) return ReputationLevel.MASTER;
  if (completedServices >= 101) return ReputationLevel.ESPECIALISTA;
  if (completedServices >= 51) return ReputationLevel.PROFISSIONAL;
  if (completedServices >= 21) return ReputationLevel.EXPERIENTE;
  return ReputationLevel.NOVATO;
}

// Calcula score de reputação (0-1000)
function calculateReputationScore(metrics: TechnicianMetrics): number {
  let score = 500; // Base

  // Rating (0-300 pontos)
  score += (metrics.averageRating - 3) * 100;

  // Taxa de conclusão (0-200 pontos)
  score += metrics.completionRate * 2;

  // Pontualidade (0-150 pontos)
  score += metrics.punctualityRate * 1.5;

  // Badges (50 pontos cada)
  score += metrics.badges.length * 50;

  // Penalidades (desconto)
  const recentPenalties = metrics.penalties.filter(
    (p) => Date.now() - p.timestamp.getTime() < 30 * 24 * 60 * 60 * 1000 // últimos 30 dias
  );
  score -= recentPenalties.length * 30;

  // Volume de serviços (bônus)
  score += Math.min(metrics.completedServices, 100);

  return Math.max(0, Math.min(1000, score));
}

// Determina regras de negócio baseadas em reputação
function getBusinessRulesForMetrics(metrics: TechnicianMetrics): StateBusinessRules {
  const score = metrics.reputationScore;

  // Técnicos novatos têm restrições
  if (metrics.level === ReputationLevel.NOVATO) {
    return {
      canAcceptNewOrders: metrics.completionRate >= 80 || metrics.totalServices < 5,
      maxConcurrentOrders: 2,
      requiresDeposit: true,
      priorityInSearch: 3,
      cancellationPenalty: 50,
      autoRejectTime: 30,
    };
  }

  // Técnicos com boa reputação
  if (score >= 800) {
    return {
      canAcceptNewOrders: true,
      maxConcurrentOrders: 10,
      requiresDeposit: false,
      priorityInSearch: 10,
      cancellationPenalty: 20,
      autoRejectTime: 60,
    };
  }

  // Técnicos com reputação média
  if (score >= 600) {
    return {
      canAcceptNewOrders: true,
      maxConcurrentOrders: 5,
      requiresDeposit: false,
      priorityInSearch: 7,
      cancellationPenalty: 30,
      autoRejectTime: 45,
    };
  }

  // Técnicos com reputação baixa
  return {
    canAcceptNewOrders: metrics.completionRate >= 70,
    maxConcurrentOrders: 3,
    requiresDeposit: true,
    priorityInSearch: 4,
    cancellationPenalty: 40,
    autoRejectTime: 30,
  };
}

export function ReputationProvider({ children }: { children: React.ReactNode }) {
  const [technicians, setTechnicians] = React.useState<Map<string, TechnicianMetrics>>(
    new Map([
      [
        "tech-1",
        {
          totalServices: 85,
          completedServices: 80,
          cancelledServices: 2,
          averageRating: 4.9,
          totalReviews: 78,
          responseTime: 5,
          punctualityRate: 95,
          completionRate: 94,
          badges: [Badge.PONTUAL, Badge.QUALIDADE, Badge.CONFIAVEL],
          penalties: [],
          reputationScore: 875,
          level: ReputationLevel.PROFISSIONAL,
        },
      ],
    ])
  );

  const [auditLog, setAuditLog] = React.useState<AuditEvent[]>([]);

  const getTechnicianMetrics = (technicianId: string) => {
    return technicians.get(technicianId);
  };

  const addAuditEvent = (event: Omit<AuditEvent, "id" | "timestamp">) => {
    const newEvent: AuditEvent = {
      ...event,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setAuditLog((prev) => [newEvent, ...prev]);
  };

  const updateMetricsOnStateChange = (
    technicianId: string,
    orderId: string,
    oldStatus: OrderStatus | null,
    newStatus: OrderStatus
  ) => {
    const metrics = technicians.get(technicianId);
    if (!metrics) return;

    const updatedMetrics = { ...metrics };
    const affectedMetrics: string[] = [];

    // Incrementa total quando aceita
    if (newStatus === OrderStatus.ACCEPTED && oldStatus === OrderStatus.PENDING) {
      updatedMetrics.totalServices += 1;
      affectedMetrics.push("totalServices");

      addAuditEvent({
        orderId,
        technicianId,
        eventType: "ORDER_ACCEPTED",
        metadata: { oldStatus, newStatus },
        affectedMetrics,
      });
    }

    // Incrementa completados quando finaliza
    if (newStatus === OrderStatus.COMPLETED && oldStatus === OrderStatus.IN_PROGRESS) {
      updatedMetrics.completedServices += 1;
      updatedMetrics.completionRate = 
        (updatedMetrics.completedServices / updatedMetrics.totalServices) * 100;
      affectedMetrics.push("completedServices", "completionRate");

      // Verifica badge de streak
      if (
        updatedMetrics.completedServices >= 10 &&
        !updatedMetrics.badges.includes(Badge.STREAK)
      ) {
        updatedMetrics.badges.push(Badge.STREAK);
        addAuditEvent({
          orderId,
          technicianId,
          eventType: "BADGE_EARNED",
          metadata: { badge: Badge.STREAK },
          affectedMetrics: ["badges"],
        });
      }

      addAuditEvent({
        orderId,
        technicianId,
        eventType: "ORDER_COMPLETED",
        metadata: { oldStatus, newStatus },
        affectedMetrics,
      });
    }

    // Penaliza cancelamento
    if (newStatus === OrderStatus.CANCELLED && oldStatus !== OrderStatus.PENDING) {
      updatedMetrics.cancelledServices += 1;
      updatedMetrics.completionRate = 
        (updatedMetrics.completedServices / updatedMetrics.totalServices) * 100;
      
      const penalty = {
        type: Penalty.CANCELAMENTO,
        timestamp: new Date(),
        reason: "Pedido cancelado após aceitação",
      };
      updatedMetrics.penalties.push(penalty);
      
      affectedMetrics.push("cancelledServices", "completionRate", "penalties");

      addAuditEvent({
        orderId,
        technicianId,
        eventType: "PENALTY_APPLIED",
        metadata: { penalty, oldStatus, newStatus },
        affectedMetrics,
      });
    }

    // Recalcula nível e score
    const oldLevel = updatedMetrics.level;
    updatedMetrics.level = calculateLevel(updatedMetrics.completedServices);
    updatedMetrics.reputationScore = calculateReputationScore(updatedMetrics);

    // Notifica level up
    if (oldLevel !== updatedMetrics.level) {
      addAuditEvent({
        orderId,
        technicianId,
        eventType: "LEVEL_UP",
        metadata: { oldLevel, newLevel: updatedMetrics.level },
        affectedMetrics: ["level"],
      });
    }

    setTechnicians(new Map(technicians.set(technicianId, updatedMetrics)));
  };

  const applyRating = (
    technicianId: string,
    orderId: string,
    rating: number,
    comment?: string
  ) => {
    const metrics = technicians.get(technicianId);
    if (!metrics) return;

    const updatedMetrics = { ...metrics };

    // Atualiza média de avaliação
    const totalRating = updatedMetrics.averageRating * updatedMetrics.totalReviews;
    updatedMetrics.totalReviews += 1;
    updatedMetrics.averageRating = (totalRating + rating) / updatedMetrics.totalReviews;

    // Badge de qualidade
    if (
      updatedMetrics.averageRating >= 4.8 &&
      updatedMetrics.totalReviews >= 10 &&
      !updatedMetrics.badges.includes(Badge.QUALIDADE)
    ) {
      updatedMetrics.badges.push(Badge.QUALIDADE);
    }

    // Penalidade por avaliação baixa
    if (rating < 3) {
      updatedMetrics.penalties.push({
        type: Penalty.AVALIACAO_BAIXA,
        timestamp: new Date(),
        reason: `Avaliação baixa: ${rating} estrelas`,
      });
    }

    // Recalcula score
    updatedMetrics.reputationScore = calculateReputationScore(updatedMetrics);

    setTechnicians(new Map(technicians.set(technicianId, updatedMetrics)));

    addAuditEvent({
      orderId,
      technicianId,
      eventType: "RATING_GIVEN",
      metadata: { rating, comment, newAverage: updatedMetrics.averageRating },
      affectedMetrics: ["averageRating", "totalReviews", "reputationScore"],
    });
  };

  const getBusinessRules = (technicianId: string): StateBusinessRules => {
    const metrics = technicians.get(technicianId);
    if (!metrics) {
      // Regras padrão para novato
      return {
        canAcceptNewOrders: true,
        maxConcurrentOrders: 2,
        requiresDeposit: true,
        priorityInSearch: 3,
        cancellationPenalty: 50,
        autoRejectTime: 30,
      };
    }
    return getBusinessRulesForMetrics(metrics);
  };

  return (
    <ReputationContext.Provider
      value={{
        technicians,
        getTechnicianMetrics,
        updateMetricsOnStateChange,
        applyRating,
        getBusinessRules,
        auditLog,
      }}
    >
      {children}
    </ReputationContext.Provider>
  );
}

export function useReputation() {
  const context = React.useContext(ReputationContext);
  if (context === undefined) {
    throw new Error("useReputation must be used within a ReputationProvider");
  }
  return context;
}
