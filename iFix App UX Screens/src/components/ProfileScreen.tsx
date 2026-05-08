import { ArrowLeft, ChevronRight, User, CreditCard, Bell, HelpCircle, Settings, LogOut, Calendar } from "lucide-react";
import * as React from "react";
import { getStoredUser, logout } from "../services/auth";
import { listMyAppointments } from "../services/appointments";

interface ProfileScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

export function ProfileScreen({ onBack, onNavigate }: ProfileScreenProps) {
  const user = getStoredUser();
  const [stats, setStats] = React.useState({ services: 0, spent: 0, ratings: 0 });

  React.useEffect(() => {
    listMyAppointments("completed").then((appointments) => {
      const spent = appointments.reduce((acc, a) => acc + (a.service?.price ?? 0), 0);
      setStats({ services: appointments.length, spent, ratings: appointments.length });
    }).catch(() => {});
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  const handleLogout = () => {
    logout();
    onBack();
  };

  const menuItems = [
    { icon: User, label: "Editar Perfil", action: null },
    { icon: Calendar, label: "Meus Agendamentos", action: "service-history" },
    { icon: CreditCard, label: "Pagamentos", action: null },
    { icon: Bell, label: "Notificações", action: null },
    { icon: HelpCircle, label: "Ajuda & Suporte", action: null },
    { icon: Settings, label: "Configurações", action: null },
  ];

  const handleMenuAction = (action: string | null) => {
    if (!action) return;
    if (onNavigate) {
      onNavigate(action);
    } else {
      (window as any).handleProfileAction?.(action);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-24">
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Perfil</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-[rgb(var(--color-primary-light))] flex items-center justify-center">
              <span className="text-[rgb(var(--color-primary-dark))] text-xl">{initials}</span>
            </div>
            <div>
              <h3 className="text-[rgb(var(--color-secondary))] mb-1">{user?.name ?? "—"}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">{user?.email ?? "—"}</p>
              {user?.phone && <p className="text-[rgb(var(--color-text-muted))]">{user.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <h3 className="text-[rgb(var(--color-primary))] mb-1">{stats.services}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Serviços</p>
            </div>
            <div className="text-center border-l border-r border-[rgb(var(--color-border))]">
              <h3 className="text-[rgb(var(--color-primary))] mb-1">R$ {stats.spent}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Gastos</p>
            </div>
            <div className="text-center">
              <h3 className="text-[rgb(var(--color-primary))] mb-1">{stats.ratings}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Avaliações</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button key={index} onClick={() => handleMenuAction(item.action)}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[rgb(var(--color-primary-light))] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              </div>
              <span className="flex-1 text-left text-[rgb(var(--color-text-primary))]">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-[rgb(var(--color-text-muted))]" />
            </button>
          );
        })}

        <button onClick={handleLogout}
          className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow mt-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <span className="flex-1 text-left text-red-600">Sair</span>
          <ChevronRight className="w-5 h-5 text-[rgb(var(--color-text-muted))]" />
        </button>
      </div>

      <div className="px-6 py-4 text-center">
        <p className="text-[rgb(var(--color-text-muted))]">iFix v1.0.0</p>
      </div>
    </div>
  );
}