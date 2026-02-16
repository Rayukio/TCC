import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import * as React from "react";

interface BookingScreenProps {
  onBack: () => void;
  onConfirm: () => void;
}

export function BookingScreen({ onBack, onConfirm }: BookingScreenProps) {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [selectedService, setSelectedService] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState("home");

  const availableDates = [
    { day: "Hoje", date: "25/11", available: true },
    { day: "Amanhã", date: "26/11", available: true },
    { day: "Qui", date: "27/11", available: true },
    { day: "Sex", date: "28/11", available: true },
    { day: "Sáb", date: "29/11", available: false },
  ];

  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  const services = [
    { id: "format", name: "Formatação de computador", price: "R$ 80" },
    { id: "clean", name: "Limpeza interna", price: "R$ 60" },
    { id: "install", name: "Instalação de SO", price: "R$ 100" },
    { id: "hd", name: "Troca de HD/SSD", price: "R$ 120" },
  ];

  const technician = {
    name: "Carlos Silva",
    specialty: "Manutenção de computação",
    rating: 4.9,
  };

  const canConfirm = selectedDate && selectedTime && selectedService;

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-32">
      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Agendar serviço</h2>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Service Selection */}
        <div className="mb-6">
          <h3 className="text-[rgb(var(--color-secondary))] mb-3">Escolha o serviço</h3>
          <div className="space-y-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedService === service.id
                    ? "bg-[rgb(var(--color-primary))] text-white shadow-md"
                    : "bg-white text-[rgb(var(--color-text-primary))] shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{service.name}</span>
                  <span className={selectedService === service.id ? "text-white" : "text-[rgb(var(--color-primary))]"}>
                    {service.price}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-[rgb(var(--color-primary))]" />
            <h3 className="text-[rgb(var(--color-secondary))]">Data</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableDates.map((date, index) => (
              <button
                key={index}
                onClick={() => date.available && setSelectedDate(date.date)}
                disabled={!date.available}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all ${
                  selectedDate === date.date
                    ? "bg-[rgb(var(--color-primary))] text-white"
                    : date.available
                    ? "bg-white text-[rgb(var(--color-text-secondary))] shadow-sm"
                    : "bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))] cursor-not-allowed"
                }`}
              >
                <div className="whitespace-nowrap">{date.day}</div>
                <div className="whitespace-nowrap">{date.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              <h3 className="text-[rgb(var(--color-secondary))]">Escolha o horário</h3>
            </div>
            <button 
              onClick={() => setSelectedTime("available")}
              className="w-full p-4 bg-[rgb(var(--color-primary-light))]/30 text-[rgb(var(--color-primary-dark))] rounded-xl mb-3 hover:bg-[rgb(var(--color-primary-light))]/50 transition-colors"
            >
              Consultar disponibilidade
            </button>
            <div className="grid grid-cols-4 gap-2">
              {availableTimes.map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-2 rounded-lg text-center transition-all ${
                    selectedTime === time
                      ? "bg-[rgb(var(--color-primary))] text-white"
                      : "bg-white text-[rgb(var(--color-text-secondary))] shadow-sm"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Location Selection */}
        {selectedTime && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-[rgb(var(--color-primary))]" />
              <h3 className="text-[rgb(var(--color-secondary))]">Local do atendimento</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setLocation("home")}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  location === "home"
                    ? "bg-[rgb(var(--color-primary))] text-white shadow-md"
                    : "bg-white text-[rgb(var(--color-text-primary))] shadow-sm"
                }`}
              >
                <p className="mb-1">Minha residência</p>
                <p className={`${location === "home" ? "text-white/80" : "text-[rgb(var(--color-text-muted))]"}`}>
                  Rua Exemplo, 123 - São Paulo
                </p>
              </button>
              <button
                onClick={() => setLocation("shop")}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  location === "shop"
                    ? "bg-[rgb(var(--color-primary))] text-white shadow-md"
                    : "bg-white text-[rgb(var(--color-text-primary))] shadow-sm"
                }`}
              >
                Oficina do técnico
              </button>
            </div>
          </div>
        )}

        {/* Booking Summary */}
        {canConfirm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-[rgb(var(--color-secondary))] mb-4">Resumo do agendamento</h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-primary-light))] flex items-center justify-center">
                  <span className="text-[rgb(var(--color-primary-dark))]">CS</span>
                </div>
                <div>
                  <h4 className="text-[rgb(var(--color-text-primary))]">{technician.name}</h4>
                  <p className="text-[rgb(var(--color-text-secondary))]">{technician.specialty}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-[rgb(var(--color-warning))]">★</span>
                    <span className="text-[rgb(var(--color-text-secondary))]">{technician.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-[rgb(var(--color-border))] space-y-2">
              <div className="flex justify-between text-[rgb(var(--color-text-secondary))]">
                <span>Serviço:</span>
                <span>{services.find(s => s.id === selectedService)?.name}</span>
              </div>
              <div className="flex justify-between text-[rgb(var(--color-text-secondary))]">
                <span>Data:</span>
                <span>{selectedDate}</span>
              </div>
              <div className="flex justify-between text-[rgb(var(--color-text-secondary))]">
                <span>Horário:</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[rgb(var(--color-border))]">
                <span className="text-[rgb(var(--color-text-primary))]">Total:</span>
                <span className="text-[rgb(var(--color-primary))]">
                  {services.find(s => s.id === selectedService)?.price}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgb(var(--color-border))] px-6 py-4">
        <button
          onClick={onConfirm}
          disabled={!canConfirm}
          className="w-full bg-[rgb(var(--color-primary))] text-white px-8 py-4 rounded-xl hover:bg-[rgb(var(--color-primary-dark))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          Confirmar Agendamento
        </button>
      </div>
    </div>
  );
}
