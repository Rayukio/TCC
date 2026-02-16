import { Search, ArrowLeft, Star } from "lucide-react";
import * as React from "react";

interface SearchScreenProps {
  onBack: () => void;
  onSelectTechnician: () => void;
}

export function SearchScreen({ onBack, onSelectTechnician }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const technicians = [
    {
      id: 1,
      name: "Lucas Souza",
      specialty: "Manutenção de smartphones",
      rating: 5.0,
      reviews: 234,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    },
    {
      id: 2,
      name: "Carlos Silva",
      specialty: "Manutenção de computação",
      rating: 4.9,
      reviews: 189,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    },
    {
      id: 3,
      name: "Danilo Santos",
      specialty: "Especialista em impressoras",
      rating: 4.5,
      reviews: 156,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Danilo",
    },
    {
      id: 4,
      name: "Fernanda Souza",
      specialty: "Técnica multimarcas",
      rating: 4.7,
      reviews: 203,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda",
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] pb-24">
      {/* Header */}
      <div className="bg-[rgb(var(--color-primary))] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white">Buscar</h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-muted))]" />
          <input
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-dark))]"
          />
        </div>
      </div>

      {/* Technicians List */}
      <div className="px-6 py-6 space-y-4">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            onClick={onSelectTechnician}
            className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <img
              src={tech.avatar}
              alt={tech.name}
              className="w-16 h-16 rounded-full object-cover bg-[rgb(var(--color-primary-light))]"
            />
            <div className="flex-1">
              <h4 className="text-[rgb(var(--color-secondary))] mb-1">{tech.name}</h4>
              <p className="text-[rgb(var(--color-text-secondary))] mb-2">{tech.specialty}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(tech.rating)
                        ? "fill-[rgb(var(--color-warning))] text-[rgb(var(--color-warning))]"
                        : "text-[rgb(var(--color-border))]"
                    }`}
                  />
                ))}
                <span className="text-[rgb(var(--color-text-secondary))] ml-2">{tech.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
