import { ArrowLeft, Calendar, Star, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ServiceHistoryScreenProps {
  onBack: () => void;
  onSelectService: (id: string) => void;
}

export function ServiceHistoryScreen({ onBack, onSelectService }: ServiceHistoryScreenProps) {
  const services = [
    { id: "1", title: "Formatação de Notebook", technician: "Carlos Silva", date: "15 Nov 2024", price: "R$ 80", rating: 5, status: "completed", image: "https://images.unsplash.com/photo-1544281679-217d523b0af6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080" },
    { id: "2", title: "Troca de Tela - iPhone 12", technician: "Lucas Souza", date: "03 Nov 2024", price: "R$ 450", rating: 5, status: "completed", image: "https://images.unsplash.com/photo-1758611974422-2801764a3155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080" },
    { id: "3", title: "Limpeza Interna - Desktop", technician: "Carlos Silva", date: "20 Out 2024", price: "R$ 60", rating: 5, status: "completed", image: "https://images.unsplash.com/photo-1721332154191-ba5f1534266e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080" },
    { id: "4", title: "Troca de Bateria - Samsung A52", technician: "Fernanda Souza", date: "10 Out 2024", price: "R$ 120", rating: 4, status: "completed", image: "https://images.unsplash.com/photo-1746005718004-1f992c399428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080" },
  ];

  const totalSpent = services.reduce((acc, service) => acc + parseFloat(service.price.replace("R$ ", "")), 0);

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
              <h3 className="text-[rgb(var(--color-primary))] mb-1">{services.length}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Serviços</p>
            </div>
            <div className="text-center border-l border-r border-[rgb(var(--color-border))]">
              <h3 className="text-[rgb(var(--color-primary))] mb-1">R$ {totalSpent}</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Total Gasto</p>
            </div>
            <div className="text-center">
              <h3 className="text-[rgb(var(--color-primary))] mb-1">4.8</h3>
              <p className="text-[rgb(var(--color-text-secondary))]">Avaliação Média</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {services.map((service) => (
          <div key={service.id} onClick={() => onSelectService(service.id)}
            className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex gap-4 p-4">
              <ImageWithFallback src={service.image} alt={service.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-[rgb(var(--color-secondary))] mb-1">{service.title}</h4>
                    <p className="text-[rgb(var(--color-text-secondary))]">{service.technician}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[rgb(var(--color-text-muted))] flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < service.rating ? "fill-[rgb(var(--color-warning))] text-[rgb(var(--color-warning))]" : "text-[rgb(var(--color-border))]"}`} />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[rgb(var(--color-text-muted))]">
                    <Calendar className="w-4 h-4" />
                    <span>{service.date}</span>
                  </div>
                  <span className="text-[rgb(var(--color-primary))]">{service.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}