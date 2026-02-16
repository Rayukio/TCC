# Arquitetura Integrada - iFix

## 🎯 Visão Geral

O iFix implementa uma **arquitetura integrada** que conecta três pilares fundamentais:

1. **Fluxo de Estados** - Gerenciamento do ciclo de vida dos pedidos
2. **Sistema de Reputação** - Métricas e avaliação de técnicos
3. **Regras de Negócio** - Validações e restrições baseadas em comportamento

A integração garante **consistência, confiabilidade e rastreabilidade** em todo o ciclo do serviço.

## 🏗️ Arquitetura de Contextos

### OrderContext (Gestão de Estados)

**Responsabilidades:**
- Gerenciar estados dos pedidos (PENDING → EVALUATED)
- Validar transições de estado
- Manter histórico de mudanças
- Emitir eventos de mudança de estado

**Interface:**
```typescript
interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  updateOrderStatus: (orderId, newStatus, message?) => boolean;
  evaluateOrder: (orderId, rating, comment?) => boolean;
  canTransitionTo: (currentStatus, newStatus) => boolean;
}
```

### ReputationContext (Sistema de Reputação)

**Responsabilidades:**
- Calcular métricas dos técnicos
- Aplicar penalidades e badges
- Definir regras de negócio dinâmicas
- Registrar auditoria completa

**Interface:**
```typescript
interface ReputationContextType {
  getTechnicianMetrics: (technicianId) => TechnicianMetrics;
  updateMetricsOnStateChange: (technicianId, orderId, oldStatus, newStatus) => void;
  applyRating: (technicianId, orderId, rating, comment?) => void;
  getBusinessRules: (technicianId) => StateBusinessRules;
  auditLog: AuditEvent[];
}
```

## 🔄 Fluxo de Integração

### 1. Mudança de Estado do Pedido

```
Cliente/Técnico → OrderContext.updateOrderStatus()
                      ↓
             Valida transição (ALLOWED_TRANSITIONS)
                      ↓
           Atualiza estado do pedido
                      ↓
     Emite evento: "orderStatusChanged"
                      ↓
   ReputationContext (listener) → updateMetricsOnStateChange()
                      ↓
            Atualiza métricas do técnico
                      ↓
          Calcula novo score de reputação
                      ↓
         Verifica badges e penalidades
                      ↓
           Registra evento de auditoria
```

### 2. Avaliação de Serviço

```
Cliente → RatingModal → OrderContext.evaluateOrder()
                             ↓
                   Valida estado COMPLETED
                             ↓
             Atualiza para EVALUATED
                             ↓
         Emite evento: "orderEvaluated"
                             ↓
     ReputationContext (listener) → applyRating()
                             ↓
              Recalcula média de avaliações
                             ↓
           Verifica badges (ex: QUALIDADE)
                             ↓
       Aplica penalidades (se rating < 3)
                             ↓
          Atualiza score de reputação
                             ↓
            Registra no auditLog
```

### 3. Aplicação de Regras de Negócio

```
Sistema → ReputationContext.getBusinessRules(technicianId)
                      ↓
          Obtém métricas do técnico
                      ↓
         Calcula regras baseadas em:
         - Nível de reputação
         - Score atual
         - Taxa de conclusão
         - Penalidades recentes
                      ↓
              Retorna regras:
              - Pode aceitar novos pedidos?
              - Quantos pedidos simultâneos?
              - Prioridade na busca?
              - Tempo de auto-rejeição?
              - Penalidade por cancelamento
```

## 📊 Métricas e Cálculos

### Score de Reputação (0-1000)

```typescript
Score Base: 500

+ Rating: (averageRating - 3) × 100 [0-300 pontos]
+ Conclusão: completionRate × 2 [0-200 pontos]
+ Pontualidade: punctualityRate × 1.5 [0-150 pontos]
+ Badges: badges.length × 50
+ Volume: min(completedServices, 100)
- Penalidades: penalidades_30_dias × 30

Final: max(0, min(1000, score))
```

### Níveis de Reputação

| Nível         | Serviços Concluídos | Benefícios                    |
|---------------|---------------------|-------------------------------|
| NOVATO        | 0-20                | Limitações iniciais           |
| EXPERIENTE    | 21-50               | Mais pedidos simultâneos      |
| PROFISSIONAL  | 51-100              | Prioridade na busca           |
| ESPECIALISTA  | 101-200             | Sem depósito                  |
| MASTER        | 200+                | Máxima prioridade e liberdade |

### Badges Automáticos

| Badge         | Condição                                    | Impacto          |
|---------------|---------------------------------------------|------------------|
| PONTUAL       | punctualityRate >= 95%                      | +50 score        |
| COMUNICATIVO  | responseTime < 5 min                        | +50 score        |
| QUALIDADE     | averageRating >= 4.8 && totalReviews >= 10 | +50 score        |
| CONFIAVEL     | cancelledServices / totalServices < 5%      | +50 score        |
| STREAK        | 10+ serviços consecutivos sem problema      | +50 score        |

### Penalidades

| Tipo             | Gatilho                      | Impacto        |
|------------------|------------------------------|----------------|
| CANCELAMENTO     | Cancelar após aceitar        | -30 score      |
| ATRASO           | Chegar >15min atrasado       | -20 score      |
| AVALIACAO_BAIXA  | Rating < 3 estrelas          | -25 score      |
| SEM_RESPOSTA     | Não responder em 30min       | -15 score      |

## 🎯 Regras de Negócio Dinâmicas

### Baseadas em Reputação

```typescript
// Score >= 800 (Alta Reputação)
{
  canAcceptNewOrders: true,
  maxConcurrentOrders: 10,
  requiresDeposit: false,
  priorityInSearch: 10,
  cancellationPenalty: 20,
  autoRejectTime: 60 // minutos
}

// Score 600-799 (Média Reputação)
{
  canAcceptNewOrders: true,
  maxConcurrentOrders: 5,
  requiresDeposit: false,
  priorityInSearch: 7,
  cancellationPenalty: 30,
  autoRejectTime: 45
}

// Score < 600 (Baixa Reputação)
{
  canAcceptNewOrders: completionRate >= 70%,
  maxConcurrentOrders: 3,
  requiresDeposit: true,
  priorityInSearch: 4,
  cancellationPenalty: 40,
  autoRejectTime: 30
}

// Novatos
{
  canAcceptNewOrders: true, // liberado até provar-se
  maxConcurrentOrders: 2,
  requiresDeposit: true,
  priorityInSearch: 3,
  cancellationPenalty: 50,
  autoRejectTime: 30
}
```

## 🔍 Sistema de Auditoria

Todos os eventos importantes são registrados para rastreabilidade:

```typescript
interface AuditEvent {
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
```

### Exemplo de Log de Auditoria

```json
[
  {
    "id": "audit-123",
    "orderId": "1",
    "technicianId": "tech-1",
    "timestamp": "2026-02-16T15:30:00Z",
    "eventType": "ORDER_COMPLETED",
    "metadata": {
      "oldStatus": "IN_PROGRESS",
      "newStatus": "COMPLETED"
    },
    "affectedMetrics": ["completedServices", "completionRate"]
  },
  {
    "id": "audit-124",
    "orderId": "1",
    "technicianId": "tech-1",
    "timestamp": "2026-02-16T15:35:00Z",
    "eventType": "RATING_GIVEN",
    "metadata": {
      "rating": 5,
      "comment": "Excelente serviço!",
      "newAverage": 4.9
    },
    "affectedMetrics": ["averageRating", "totalReviews", "reputationScore"]
  },
  {
    "id": "audit-125",
    "orderId": "1",
    "technicianId": "tech-1",
    "timestamp": "2026-02-16T15:35:01Z",
    "eventType": "BADGE_EARNED",
    "metadata": {
      "badge": "STREAK"
    },
    "affectedMetrics": ["badges"]
  }
]
```

## 🔐 Garantias de Consistência

### 1. Validação de Transições

```typescript
const ALLOWED_TRANSITIONS = {
  PENDING: [ACCEPTED, CANCELLED],
  ACCEPTED: [EN_ROUTE, CANCELLED],
  EN_ROUTE: [IN_PROGRESS, CANCELLED],
  IN_PROGRESS: [COMPLETED, CANCELLED],
  COMPLETED: [EVALUATED],
  EVALUATED: [],
  CANCELLED: []
};

// Impede transições inválidas
if (!canTransitionTo(currentStatus, newStatus)) {
  return false; // Bloqueado
}
```

### 2. Comunicação via Eventos

```typescript
// Desacoplamento entre contextos
window.dispatchEvent(new CustomEvent("orderStatusChanged", {
  detail: { orderId, technicianId, oldStatus, newStatus }
}));

// Listener no ReputationContext
window.addEventListener("orderStatusChanged", handleStatusChange);
```

### 3. Atomicidade de Operações

```typescript
// Todas as atualizações são atômicas
setOrders(prevOrders => prevOrders.map(o => 
  o.id === orderId ? { ...o, ...updates } : o
));

setTechnicians(new Map(
  technicians.set(technicianId, updatedMetrics)
));
```

## 📈 Benefícios da Integração

### ✅ Consistência
- Estados sempre sincronizados entre pedidos e reputação
- Métricas calculadas em tempo real
- Histórico completo e rastreável

### ✅ Confiabilidade
- Validações em cada ponto de mudança
- Auditoria completa de todas as ações
- Rollback possível via histórico

### ✅ Flexibilidade
- Regras de negócio dinâmicas baseadas em comportamento
- Fácil adicionar novos badges e penalidades
- Sistema extensível para novos tipos de eventos

### ✅ Escalabilidade
- Contextos desacoplados via eventos
- Fácil migração para backend
- Pronto para integração com Supabase/API

## 🚀 Próximas Evoluções

- [ ] Persistência em banco de dados (Supabase)
- [ ] Sincronização em tempo real (WebSocket)
- [ ] Machine Learning para prever reputação
- [ ] Sistema de recomendação baseado em reputação
- [ ] Dashboard analytics para técnicos
- [ ] Sistema de disputa e resolução de conflitos
- [ ] Gamificação com rankings e competições
- [ ] Integração com sistema de pagamentos
