import { ArrowLeft, Calendar, Star, MapPin, Clock, Share2 } from "lucide-react";
import * as React from "react";
import { getAppointmentById } from "../services/appointments";
import { getRatingByAppointment } from "../services/ratingService";
import type { Appointment } from "../types/appointment";
import type { Rating } from "../types/rating";

interface ServiceDetailHistoryScreenProps {
  appointmentId?: string;
  onBack: () => void;
}

export function ServiceDetailHistoryScreen({ appointmentId, onBack }: ServiceDetailHistoryScreenProps) {
  const [appointment, setAppointment] = React.useState<Appointment | null>(null);
  const [rating, setRating] = React.useState<Rating | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!appointmentId) { setLoading(false); return; }

    const fetchData = async () => {
      try {
        const appt = await getAppointmentById(appointmentId);
        setAppointment(appt);
        try {
          const r = await getRatingByAppointment(appointmentId);
          setRating(r);
        } catch {
          // Sem avaliação ainda — não é erro crítico
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro ao carregar detalhes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-background))]">
        <p className="text-[rgb(var(--color-text-muted))]">Carregando...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--color-background))] gap-4">
        <p className="text-red-500">{error || "Agendamento não encontrado."}</p>
        <button onClick={onBack} className="text-[rgb(var(--color-primary))]">Voltar</button>
      </div>
    );
  }

  const techName = appointment.technician?.name ?? "—";
  const techInitials = techName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const scheduledDate = new Date(appointment.scheduledAt);
  const formattedDate = scheduledDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  const formattedTime = scheduledDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-6">
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Detalhes do Serviço</h2>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Info do serviço */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[rgb(var(--color-secondary))] mb-2">
                {appointment.service?.name ?? "Serviço"}
              </h3>
              {rating && (
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < rating.score ? "fill-[rgb(var(--color-warning))] text-[rgb(var(--color-warning))]" : "text-[rgb(var(--color-border))]"}`} />
                  ))}
                </div>
              )}
            </div>
            {appointment.service?.price && (
              <p className="text-[rgb(var(--color-primary))]">R$ {appointment.service.price}</p>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-3 text-[rgb(var(--color-text-secondary))]">
              <Calendar className="w-5 h-5" /><span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-[rgb(var(--color-text-secondary))]">
              <Clock className="w-5 h-5" /><span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-3 text-[rgb(var(--color-text-secondary))]">
              <MapPin className="w-5 h-5" /><span>{appointment.address}</span>
            </div>
          </div>
        </div>

        {/* Técnico */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <p className="text-[rgb(var(--color-text-muted))] mb-3">Técnico</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-primary-light))] flex items-center justify-center">
              <span className="text-[rgb(var(--color-primary-dark))]">{techInitials}</span>
            </div>
            <div>
              <h4 className="text-[rgb(var(--color-text-primary))]">{techName}</h4>
              {appointment.technician?.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[rgb(var(--color-warning))]">★</span>
                  <span className="text-[rgb(var(--color-text-secondary))]">{appointment.technician.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h4 className="text-[rgb(var(--color-secondary))] mb-3">Status</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-[rgb(var(--color-text-primary))] capitalize">{appointment.status}</span>
          </div>
          {appointment.notes && (
            <p className="text-[rgb(var(--color-text-secondary))] mt-3">{appointment.notes}</p>
          )}
        </div>

        {/* Avaliação */}
        {rating && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h4 className="text-[rgb(var(--color-secondary))] mb-3">Sua Avaliação</h4>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < rating.score ? "fill-[rgb(var(--color-warning))] text-[rgb(var(--color-warning))]" : "text-[rgb(var(--color-border))]"}`} />
              ))}
              <span className="text-[rgb(var(--color-text-secondary))] ml-2">{rating.score}/5</span>
            </div>
            {rating.comment && (
              <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">{rating.comment}</p>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="grid grid-cols-1 gap-3">
          <button className="flex items-center justify-center gap-2 bg-white text-[rgb(var(--color-primary))] px-6 py-3 rounded-xl border-2 border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-light))]/20 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
}