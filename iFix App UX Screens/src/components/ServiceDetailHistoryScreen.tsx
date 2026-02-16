import { ArrowLeft, Calendar, Star, MapPin, Clock, Download, Share2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ServiceDetailHistoryScreenProps {
  onBack: () => void;
}

export function ServiceDetailHistoryScreen({ onBack }: ServiceDetailHistoryScreenProps) {
  const service = {
    id: 1,
    title: "Formatação de Notebook",
    technician: "Carlos Silva",
    date: "15 Nov 2024",
    time: "15:00 - 16:30",
    price: "R$ 80",
    rating: 5,
    review: "Excelente serviço! O técnico foi muito profissional e resolveu todos os problemas do meu notebook.",
    location: "Rua Exemplo, 123 - São Paulo, SP",
    beforeImages: [
      "https://images.unsplash.com/photo-1544281679-217d523b0af6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzY3JlZW4lMjByZXBhaXJ8ZW58MXx8fHwxNzY0MTAzMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1721332154191-ba5f1534266e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGhhcmR3YXJlJTIwcmVwYWlyfGVufDF8fHx8MTc2NDEwMzIxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    afterImages: [
      "https://images.unsplash.com/photo-1721332154191-ba5f1534266e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGhhcmR3YXJlJTIwcmVwYWlyfGVufDF8fHx8MTc2NDEwMzIxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1544281679-217d523b0af6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzY3JlZW4lMjByZXBhaXJ8ZW58MXx8fHwxNzY0MTAzMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    services: [
      "Formatação completa do sistema",
      "Instalação do Windows 11",
      "Instalação de drivers",
      "Configuração inicial",
      "Limpeza de arquivos temporários",
    ],
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-6">
      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Detalhes do Serviço</h2>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Service Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[rgb(var(--color-secondary))] mb-2">{service.title}</h3>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[rgb(var(--color-warning))] text-[rgb(var(--color-warning))]"
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[rgb(var(--color-primary))]">{service.price}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[rgb(var(--color-border))]">
            <div className="flex items-center gap-3 text-[rgb(var(--color-text-secondary))]">
              <Calendar className="w-5 h-5" />
              <span>{service.date}</span>
            </div>
            <div className="flex items-center gap-3 text-[rgb(var(--color-text-secondary))]">
              <Clock className="w-5 h-5" />
              <span>{service.time}</span>
            </div>
            <div className="flex items-center gap-3 text-[rgb(var(--color-text-secondary))]">
              <MapPin className="w-5 h-5" />
              <span>{service.location}</span>
            </div>
          </div>
        </div>

        {/* Technician */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <p className="text-[rgb(var(--color-text-muted))] mb-3">Técnico</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-primary-light))] flex items-center justify-center">
              <span className="text-[rgb(var(--color-primary-dark))]">CS</span>
            </div>
            <div>
              <h4 className="text-[rgb(var(--color-text-primary))]">{service.technician}</h4>
              <p className="text-[rgb(var(--color-text-secondary))]">Manutenção de computação</p>
            </div>
          </div>
        </div>

        {/* Before/After Photos */}
        <div className="mb-6">
          <h3 className="text-[rgb(var(--color-secondary))] mb-4">Fotos do Serviço</h3>
          
          {/* Before */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full">Antes</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {service.beforeImages.map((img, index) => (
                <ImageWithFallback
                  key={`before-${index}`}
                  src={img}
                  alt={`Antes ${index + 1}`}
                  className="w-full h-40 rounded-xl object-cover"
                />
              ))}
            </div>
          </div>

          {/* After */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Depois</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {service.afterImages.map((img, index) => (
                <ImageWithFallback
                  key={`after-${index}`}
                  src={img}
                  alt={`Depois ${index + 1}`}
                  className="w-full h-40 rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Services Performed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h4 className="text-[rgb(var(--color-secondary))] mb-4">Serviços Realizados</h4>
          <ul className="space-y-2">
            {service.services.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[rgb(var(--color-success))]/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[rgb(var(--color-success))]"></div>
                </div>
                <span className="text-[rgb(var(--color-text-primary))]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Review */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h4 className="text-[rgb(var(--color-secondary))] mb-3">Sua Avaliação</h4>
          <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">{service.review}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-white text-[rgb(var(--color-primary))] px-6 py-3 rounded-xl border-2 border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-light))]/20 transition-colors">
            <Download className="w-5 h-5" />
            <span>Baixar Nota</span>
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-[rgb(var(--color-primary))] px-6 py-3 rounded-xl border-2 border-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-light))]/20 transition-colors">
            <Share2 className="w-5 h-5" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
