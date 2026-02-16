import * as React from "react";
import { X, Star } from "lucide-react";
import { useOrder } from "../contexts/OrderContext";

interface RatingModalProps {
  orderId: string;
  technicianName: string;
  onClose: () => void;
  onSubmit: () => void;
}

export function RatingModal({ orderId, technicianName, onClose, onSubmit }: RatingModalProps) {
  const { evaluateOrder } = useOrder();
  const [rating, setRating] = React.useState(0);
  const [hoveredRating, setHoveredRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Por favor, selecione uma avaliação");
      return;
    }

    evaluateOrder(orderId, rating, comment);
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--color-border))]">
          <h3 className="text-[rgb(var(--color-secondary))]">Avaliar Serviço</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[rgb(var(--color-background))] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-[rgb(var(--color-text-secondary))] mb-1">
              Como foi o atendimento de
            </p>
            <h4 className="text-[rgb(var(--color-text-primary))]">{technicianName}?</h4>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    value <= (hoveredRating || rating)
                      ? "fill-[rgb(var(--color-warning))] text-[rgb(var(--color-warning))]"
                      : "text-[rgb(var(--color-border))]"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Rating Label */}
          {rating > 0 && (
            <div className="text-center mb-6">
              <p className="text-[rgb(var(--color-primary))]">
                {rating === 5 && "Excelente!"}
                {rating === 4 && "Muito bom!"}
                {rating === 3 && "Bom"}
                {rating === 2 && "Regular"}
                {rating === 1 && "Ruim"}
              </p>
            </div>
          )}

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-[rgb(var(--color-text-secondary))] mb-2">
              Comentário (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte-nos sobre sua experiência..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-[rgb(var(--color-border))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-background))] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="px-6 py-3 rounded-xl bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-dark))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
