import { ArrowLeft, ChevronRight, User, CreditCard, Bell, HelpCircle, Settings, LogOut, Calendar } from "lucide-react";

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const menuItems = [
    { icon: User, label: "Editar Perfil", color: "rgb(var(--color-primary))", action: null },
    { icon: Calendar, label: "Meus Agendamentos", color: "rgb(var(--color-primary))", action: "appointments" },
    { icon: CreditCard, label: "Pagamentos", color: "rgb(var(--color-primary))", action: null },
    { icon: Bell, label: "Notificações", color: "rgb(var(--color-primary))", action: null },
    { icon: HelpCircle, label: "Ajuda & Suporte", color: "rgb(var(--color-primary))", action: null },
    { icon: Settings, label: "Configurações", color: "rgb(var(--color-primary))", action: null },
  ];

  const stats = [
    { label: "Serviços", value: "8" },
    { label: "Gastos", value: "R$ 640" },
    { label: "Avaliações", value: "6" },
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-24">
      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Perfil</h2>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[rgb(var(--color-primary-light))] flex items-center justify-center">
              <span className="text-[rgb(var(--color-primary-dark))]">MS</span>
            </div>
            <div>
              <h3 className="text-[rgb(var(--color-secondary))] mb-1">Maria Santos</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">maria.santos@email.com</p>
              <p className="text-[rgb(var(--color-text-muted))]">+55 (11) 98765-4321</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-[rgb(var(--color-primary))] mb-1">{stat.value}</h3>
                <p className="text-[rgb(var(--color-text-secondary))]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 py-6 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => item.action && (window as any).handleProfileAction?.(item.action)}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-primary-light))] flex items-center justify-center">
                <Icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <span className="flex-1 text-left text-[rgb(var(--color-text-primary))]">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-[rgb(var(--color-text-muted))]" />
            </button>
          );
        })}

        {/* Logout */}
        <button className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow mt-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <span className="flex-1 text-left text-red-600">Sair</span>
          <ChevronRight className="w-5 h-5 text-[rgb(var(--color-text-muted))]" />
        </button>
      </div>

      {/* Version */}
      <div className="px-6 py-4 text-center">
        <p className="text-[rgb(var(--color-text-muted))]">iFix v1.0.0</p>
      </div>
    </div>
  );
}