const { Technician, Service, TechnicianService } = require('../models');

const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Encontra técnicos disponíveis para um serviço, ordenados por proximidade + nota.
 * @param {object} params
 * @param {string} [params.serviceId]  - ID do serviço (fonte de verdade via TechnicianService)
 * @param {string} [params.category]   - Categoria (fallback quando não há serviceId)
 * @param {number} [params.lat]
 * @param {number} [params.lng]
 * @param {number} [params.maxResults=10]
 */
const findMatches = async ({ serviceId, category, lat, lng, maxResults = 10 }) => {
  const includeService = {
    model: Service,
    as: 'services',
    through: {
      model: TechnicianService,
      as: 'pivot',
      where: { isActive: true },
      attributes: ['price'],
    },
    attributes: ['id', 'name', 'category', 'basePrice'],
  };

  // Filtra por serviceId real se informado, senão por categoria via specialties (fallback UI)
  if (serviceId) {
    includeService.through.where.serviceId = serviceId;
  } else if (category) {
    includeService.where = { category };
  }

  const technicians = await Technician.findAll({
    where: { isActive: true, isAvailable: true },
    include: [includeService],
  });

  // Remove técnicos que não têm nenhum serviço associado (join vazio)
  const withService = technicians.filter((t) => t.services && t.services.length > 0);

  const scored = withService
    .map((t) => {
      const hasLocation = t.location?.lat != null && t.location?.lng != null;
      const distance = (lat && lng && hasLocation)
        ? haversineDistance(lat, lng, t.location.lat, t.location.lng)
        : 0;
      const withinRadius = distance <= (t.radiusKm || 20);
      return { technician: t, distance, withinRadius };
    })
    .filter((r) => r.withinRadius || (!lat && !lng))
    .sort((a, b) => {
      const scoreA = a.technician.ratingAvg * 0.6 - a.distance * 0.4;
      const scoreB = b.technician.ratingAvg * 0.6 - b.distance * 0.4;
      return scoreB - scoreA;
    })
    .slice(0, maxResults)
    .map(({ technician, distance }) => {
      const { passwordHash, ...safe } = technician.toJSON();
      return { ...safe, distanceKm: parseFloat(distance.toFixed(1)) };
    });

  return scored;
};

module.exports = { findMatches };