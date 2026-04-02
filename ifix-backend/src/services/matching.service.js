const Technician = require('../models/Technician');

// Haversine formula to calculate distance between two geo points (km)
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
 * Find best-matching technicians for a given service request.
 * @param {object} params
 * @param {string} params.category - Service category
 * @param {number} params.lat - User latitude
 * @param {number} params.lng - User longitude
 * @param {number} [params.maxResults=10]
 */
const findMatches = async ({ category, lat, lng, maxResults = 10 }) => {
  const technicians = await Technician.findAll({
    where: { isActive: true, isAvailable: true },
  });

  const scored = technicians
    .filter((t) => {
      const hasSpecialty = !category || (t.specialties || []).includes(category);
      const hasLocation = t.location?.lat != null && t.location?.lng != null;
      return hasSpecialty && hasLocation;
    })
    .map((t) => {
      const distance = lat && lng
        ? haversineDistance(lat, lng, t.location.lat, t.location.lng)
        : 0;
      const withinRadius = distance <= (t.radiusKm || 20);
      return { technician: t, distance, withinRadius };
    })
    .filter((r) => r.withinRadius)
    .sort((a, b) => {
      // Score: rating (weight 0.6) + proximity (weight 0.4)
      const scoreA = b.technician.ratingAvg * 0.6 - a.distance * 0.4;
      const scoreB = a.technician.ratingAvg * 0.6 - b.distance * 0.4;
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