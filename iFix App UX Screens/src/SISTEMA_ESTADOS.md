# Sistema de Gestão de Estados - iFix

## 📋 Visão Geral

O iFix agora possui um **sistema completo de gestão de estados dos pedidos** com controle de transições, rastreabilidade e validações, garantindo um fluxo real de assistência técnica.

## 🔄 Estados dos Pedidos

### Fluxo Normal

1. **PENDING** - Aguardando Confirmação
   - Pedido criado, aguardando aceitação do técnico
   - Cor: Amarelo (warning)

2. **ACCEPTED** - Confirmado
   - Técnico aceitou o serviço
   - Cor: Verde (success)

3. **EN_ROUTE** - Técnico a Caminho
   - Técnico iniciou deslocamento para o local
   - Cor: Verde (primary)
   - Mostra rastreamento no mapa
   - Exibe tempo estimado de chegada

4. **IN_PROGRESS** - Em Atendimento
   - Técnico está realizando o serviço
   - Cor: Verde (primary)
   - Continua mostrando rastreamento

5. **COMPLETED** - Concluído
   - Serviço finalizado com sucesso
   - Cor: Verde (success)
   - Aguardando avaliação do cliente

6. **EVALUATED** - Avaliado
   - Cliente avaliou o serviço
   - Cor: Verde (success)
   - Estado final do fluxo

### Estado Especial

7. **CANCELLED** - Cancelado
   - Pedido cancelado pelo cliente ou técnico
   - Cor: Vermelho (error)
   - Estado terminal

## 🔐 Regras de Transição

O sistema valida automaticamente as transições permitidas:

```
PENDING → ACCEPTED, CANCELLED
ACCEPTED → EN_ROUTE, CANCELLED
EN_ROUTE → IN_PROGRESS, CANCELLED
IN_PROGRESS → COMPLETED, CANCELLED
COMPLETED → EVALUATED
EVALUATED → (nenhuma transição)
CANCELLED → (nenhuma transição)
```

Tentativas de transições inválidas são bloqueadas automaticamente.

## 📁 Arquitetura

### Contexto Global - `/contexts/OrderContext.tsx`

- **OrderProvider**: Provedor de contexto React
- **useOrder**: Hook para acessar dados dos pedidos
- **OrderStatus**: Enum com todos os estados
- **OrderStatusLabels**: Labels amigáveis em português
- **OrderStatusColors**: Cores associadas a cada estado

### Funções Principais

```typescript
// Atualizar estado do pedido
updateOrderStatus(orderId, newStatus, message?)

// Cancelar pedido
cancelOrder(orderId, reason?)

// Verificar se transição é permitida
canTransitionTo(currentStatus, newStatus)

// Definir pedido ativo
setActiveOrder(orderId)
```

### Histórico de Estados

Cada pedido mantém um histórico completo:

```typescript
statusHistory: [
  {
    status: OrderStatus.PENDING,
    timestamp: Date,
    message: "Solicitação criada"
  },
  {
    status: OrderStatus.ACCEPTED,
    timestamp: Date,
    message: "Técnico aceitou o serviço"
  },
  // ...
]
```

## 🎨 Componentes Visuais

### OrderTimeline - `/components/OrderTimeline.tsx`

Timeline visual que mostra:
- ✅ Estados concluídos (verde sólido)
- 🔵 Estado atual (azul pulsante)
- ⚪ Estados futuros (cinza)
- Timestamp de cada transição
- Mensagens descritivas

### OrderStatusController - `/components/OrderStatusController.tsx`

Botão flutuante para controle manual de estados (desenvolvimento/testes):
- Mostra estado atual
- Lista transições disponíveis
- Bloqueia transições inválidas
- Adiciona mensagens automáticas

## 📱 Integração nas Telas

### HomeScreen
- Exibe badges coloridos com status dos pedidos
- Filtra pedidos ativos (exclui cancelados e avaliados)
- Cores dinâmicas baseadas no estado

### AppointmentDetailScreen
- Badge de status no topo
- Botão para rastreamento
- Opção de cancelamento
- Controlador de estados (dev)

### TrackingScreen
- Timeline completa do pedido
- Rastreamento visual quando EN_ROUTE ou IN_PROGRESS
- ETA (tempo estimado de chegada)
- Localização atual do técnico
- Controlador de estados (dev)

## 🚀 Como Usar

### 1. Acessar o contexto em um componente

```typescript
import { useOrder } from "../contexts/OrderContext";

function MyComponent() {
  const { activeOrder, updateOrderStatus } = useOrder();
  
  // Usar dados do pedido ativo
  console.log(activeOrder?.currentStatus);
}
```

### 2. Atualizar estado de um pedido

```typescript
// Transição para próximo estado
updateOrderStatus(
  orderId, 
  OrderStatus.EN_ROUTE,
  "Técnico saiu para o atendimento"
);
```

### 3. Testar transições

1. Acesse a tela "Ver Detalhes" de um pedido
2. Clique no botão "Controle de Status" (canto inferior direito)
3. Selecione a transição desejada
4. Observe as mudanças na interface

## 🎯 Próximos Passos

- [ ] Integração com backend/Supabase para persistência
- [ ] Notificações em tempo real via WebSocket
- [ ] Sistema de avaliações após conclusão
- [ ] Dashboard para técnicos gerenciarem pedidos
- [ ] Histórico completo de pedidos (concluídos e cancelados)
- [ ] Relatórios e analytics por estado

## 📝 Notas Importantes

- O sistema atual funciona com estado local (React Context)
- Em produção, as transições seriam validadas no backend
- O OrderStatusController é apenas para desenvolvimento/demonstração
- Todas as transições são registradas no histórico com timestamp
- O sistema previne race conditions e transições inválidas
