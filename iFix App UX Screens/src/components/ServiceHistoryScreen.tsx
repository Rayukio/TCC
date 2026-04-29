import { ArrowLeft, Calendar, Star, ChevronRight } from "lucide-react";
import * as React from "react";
import { listMyAppointments } from "../services/appointments";
import type { Appointment } from "../types/appointment";

interface ServiceHistoryScreenProps {
  onBack: () => void;
  onSelectService: (id: string) => void;
}

export function ServiceHistoryScreen({ onBack, onSelectService }: ServiceHistoryScreenProps) {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    listMyAppointments("completed")
      .then(setAppointments)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Erro ao carregar histórico."))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = appointments.reduce((acc, a) => acc + (a.service?.price ?? 0), 0);
  const avgRating = appointments.length > 0
    ? (appointments.reduce((acc, a) => acc + (a.technician?.rating ?? 0), 0) / appointments.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-6">
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Histórico de Serviços</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <h3 className="text-[rgb(var(--color-primary))] mb-1">{appointments.length}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Serviços</p>
            </div>
            <div className="text-center border-l border-r border-[rgb(var(--color-border))]">
              <h3 className="text-[rgb(var(--color-primary))] mb-1">R$ {totalSpent}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Total Gasto</p>
            </div>
            <div className="text-center">
              <h3 className="text-[rgb(var(--color-primary))] mb-1">{avgRating}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Avaliação Média</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {loading && <p className="text-center text-[rgb(var(--color-text-muted))] py-12">Carregando...</p>}
        {error && <p className="text-center text-red-500 py-12">{error}</p>}
        {!loading && !error && appointments.length === 0 && (
          <p className="text-center text-[rgb(var(--color-text-muted))] py-12">Nenhum serviço encontrado.</p>
        )}
        {!loading && appointments.map((appointment) => (
          <div key={appointment.id} onClick={() => onSelectService(appointment.id)}
            className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex gap-4 p-4">
              <div className="w-24 h-24 rounded-xl bg-[rgb(var(--color-primary-light))] flex-shrink-0 flex items-center justify-center">
                <span className="text-[rgb(var(--color-primary-dark))] text-2xl">🔧</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-[rgb(var(--color-secondary))] mb-1">{appointment.service?.name ?? "Serviço"}</h4>
                    <p className="text-[rgb(var(--color-text-secondary))]">{appointment.technician?.name ?? "—"}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[rgb(var(--color-text-muted))] flex-shrink-0" />
                </div>
                {appointment.technician?.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(appointment.technician!.rating!) ? "fill-[rgb(var(--color-warning))] text-[rgb(var(--color-warning))]" : "text-[rgb(var(--color-border))]"}`} />
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[rgb(var(--color-text-muted))]">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(appointment.scheduledAt).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {appointment.service?.price && (
                    <span className="text-[rgb(var(--color-primary))]">R$ {appointment.service.price}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}