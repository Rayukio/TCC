import { Shield, Award, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react";
import { 
  TechnicianMetrics, 
  ReputationLevelLabels, 
  BadgeLabels,
  ReputationLevel 
} from "../contexts/ReputationContext";

interface TechnicianReputationCardProps {
  metrics: TechnicianMetrics;
  compact?: boolean;
}

export function TechnicianReputationCard({ metrics, compact = false }: TechnicianReputationCardProps) {
  // Cores por nível
  const levelColors: Record<ReputationLevel, string> = {
    [ReputationLevel.NOVATO]: "text-gray-600",
    [ReputationLevel.EXPERIENTE]: "text-blue-600",
    [ReputationLevel.PROFISSIONAL]: "text-purple-600",
    [ReputationLevel.ESPECIALISTA]: "text-orange-600",
    [ReputationLevel.MASTER]: "text-yellow-600",
  };

  const levelBgColors: Record<ReputationLevel, string> = {
    [ReputationLevel.NOVATO]: "bg-gray-100",
    [ReputationLevel.EXPERIENTE]: "bg-blue-100",
    [ReputationLevel.PROFISSIONAL]: "bg-purple-100",
    [ReputationLevel.ESPECIALISTA]: "bg-orange-100",
    [ReputationLevel.MASTER]: "bg-yellow-100",
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`px-3 py-1 rounded-full ${levelBgColors[metrics.level]}`}>
          <span className={`text-sm ${levelColors[metrics.level]}`}>
            {ReputationLevelLabels[metrics.level]}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-[rgb(var(--color-primary))]" />
          <span className="text-[rgb(var(--color-text-secondary))]">{metrics.reputationScore}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-[rgb(var(--color-secondary))] mb-1">Reputação</h4>
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${levelColors[metrics.level]}`} />
            <span className={`${levelColors[metrics.level]}`}>
              {ReputationLevelLabels[metrics.level]}
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl text-[rgb(var(--color-primary))]">{metrics.reputationScore}</div>
          <p className="text-[rgb(var(--color-text-muted))]">Score</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-xl text-[rgb(var(--color-text-primary))]">
            {metrics.completedServices}
          </div>
          <p className="text-[rgb(var(--color-text-muted))]">Serviços</p>
        </div>
        <div className="text-center">
          <div className="text-xl text-[rgb(var(--color-text-primary))]">
            {metrics.completionRate.toFixed(0)}%
          </div>
          <p className="text-[rgb(var(--color-text-muted))]">Conclusão</p>
        </div>
        <div className="text-center">
          <div className="text-xl text-[rgb(var(--color-text-primary))]">
            {metrics.punctualityRate.toFixed(0)}%
          </div>
          <p className="text-[rgb(var(--color-text-muted))]">Pontualidade</p>
        </div>
      </div>

      {/* Badges */}
      {metrics.badges.length > 0 && (
        <div className="mb-6">
          <h5 className="text-[rgb(var(--color-text-secondary))] mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Conquistas
          </h5>
          <div className="flex flex-wrap gap-2">
            {metrics.badges.map((badge) => (
              <div
                key={badge}
                className="px-3 py-1 bg-[rgb(var(--color-primary-light))]/30 text-[rgb(var(--color-primary-dark))] rounded-full text-sm flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                {BadgeLabels[badge]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Penalidades recentes */}
      {metrics.penalties.length > 0 && (
        <div>
          <h5 className="text-[rgb(var(--color-text-secondary))] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[rgb(var(--color-warning))]" />
            Alertas
          </h5>
          <div className="space-y-2">
            {metrics.penalties.slice(0, 3).map((penalty, index) => (
              <div
                key={index}
                className="px-3 py-2 bg-orange-50 text-orange-800 rounded-lg text-sm"
              >
                {penalty.reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
