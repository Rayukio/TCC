import { ArrowLeft, Star, MapPin, Award, Shield, Clock } from "lucide-react";
import * as React from "react";
import { useReputation } from "../contexts/ReputationContext";
import { TechnicianReputationCard } from "./TechnicianReputationCard";

interface TechnicianDetailScreenProps {
  onBack: () => void;
  onBookAppointment: () => void;
}

export function TechnicianDetailScreen({ onBack, onBookAppointment }: TechnicianDetailScreenProps) {
  const { getTechnicianMetrics } = useReputation();
  
  const technician = {
    id: "tech-1",
    name: "Carlos Silva",
    specialty: "Manutenção de computação",
    rating: 4.9,
    reviews: 189,
    experience: "5 anos",
    completedServices: 450,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
  };

  const metrics = getTechnicianMetrics(technician.id);

  const services = [
    { name: "Formatação de computador", price: "R$ 80", duration: "1-2h" },
    { name: "Limpeza interna", price: "R$ 60", duration: "30min-1h" },
    { name: "Instalação de SO", price: "R$ 100", duration: "2-3h" },
    { name: "Troca de HD/SSD", price: "R$ 120", duration: "1-2h" },
  ];

  const reviews = [
    {
      id: 1,
      name: "Ana Paula",
      rating: 5,
      date: "Há 2 dias",
      comment: "Excelente profissional! Muito atencioso e resolveu meu problema rapidamente.",
    },
    {
      id: 2,
      name: "João Pedro",
      rating: 5,
      date: "Há 1 semana",
      comment: "Serviço de qualidade, recomendo!",
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-32">
      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-32">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Perfil do Técnico</h2>
        </div>
      </div>

      <div className="px-6 -mt-24">
        {/* Technician Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <img
              src={technician.avatar}
              alt={technician.name}
              className="w-20 h-20 rounded-full object-cover bg-[rgb(var(--color-primary-light))]"
            />
            <div className="flex-1">
              <h3 className="text-[rgb(var(--color-secondary))] mb-1">{technician.name}</h3>
              <p className="text-[rgb(var(--color-text-secondary))] mb-3">{technician.specialty}</p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[rgb(var(--color-warning))] text-[rgb(var(--color-warning))]"
                  />
                ))}
                <span className="text-[rgb(var(--color-text-primary))] ml-2">{technician.rating}</span>
                <span className="text-[rgb(var(--color-text-muted))]">({technician.reviews} avaliações)</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-success))]/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-[rgb(var(--color-success))]" />
              </div>
              <span className="text-[rgb(var(--color-text-muted))]">Verificado</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[rgb(var(--color-border))]">
            <div className="text-center">
              <p className="text-[rgb(var(--color-primary))]">{technician.experience}</p>
              <p className="text-[rgb(var(--color-text-muted))]">Experiência</p>
            </div>
            <div className="text-center">
              <p className="text-[rgb(var(--color-primary))]">{technician.completedServices}</p>
              <p className="text-[rgb(var(--color-text-muted))]">Serviços</p>
            </div>
            <div className="text-center">
              <p className="text-[rgb(var(--color-primary))]">2.3 km</p>
              <p className="text-[rgb(var(--color-text-muted))]">Distância</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Shield className="w-6 h-6 text-[rgb(var(--color-primary))] mx-auto mb-2" />
            <p className="text-[rgb(var(--color-text-secondary))]">Garantia</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <Clock className="w-6 h-6 text-[rgb(var(--color-primary))] mx-auto mb-2" />
            <p className="text-[rgb(var(--color-text-secondary))]">Pontual</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
            <MapPin className="w-6 h-6 text-[rgb(var(--color-primary))] mx-auto mb-2" />
            <p className="text-[rgb(var(--color-text-secondary))]">Atende local</p>
          </div>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h3 className="text-[rgb(var(--color-secondary))] mb-4">Serviços Oferecidos</h3>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[rgb(var(--color-text-primary))]">{service.name}</h4>
                  <p className="text-[rgb(var(--color-primary))]">{service.price}</p>
                </div>
                <div className="flex items-center gap-2 text-[rgb(var(--color-text-muted))]">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-6">
          <h3 className="text-[rgb(var(--color-secondary))] mb-4">Avaliações</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[rgb(var(--color-text-primary))]">{review.name}</h4>
                  <span className="text-[rgb(var(--color-text-muted))]">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-[rgb(var(--color-warning))] text-[rgb(var(--color-warning))]"
                          : "text-[rgb(var(--color-border))]"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[rgb(var(--color-text-secondary))]">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgb(var(--color-border))] px-6 py-4">
        <button
          onClick={onBookAppointment}
          className="w-full bg-[rgb(var(--color-primary))] text-white px-8 py-4 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors shadow-lg"
        >
          Agendar Serviço
        </button>
      </div>
    </div>
  );
}