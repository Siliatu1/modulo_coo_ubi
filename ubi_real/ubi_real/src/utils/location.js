/**
 * Calcula la distancia entre dos coordenadas usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del primer punto
 * @param {number} lon1 - Longitud del primer punto
 * @param {number} lat2 - Latitud del segundo punto
 * @param {number} lon2 - Longitud del segundo punto
 * @returns {number} Distancia en metros
 */
export const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180; // Convertir a radianes
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = R * c; // Distancia en metros
  return distancia;
};

/**
 * Obtiene la ubicación actual del dispositivo
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const obtenerUbicacionActual = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada por el navegador'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let mensajeError = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensajeError = 'Permiso de ubicación denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            mensajeError = 'Información de ubicación no disponible';
            break;
          case error.TIMEOUT:
            mensajeError = 'Tiempo de espera agotado';
            break;
          default:
            mensajeError = 'Error desconocido';
        }
        reject(new Error(mensajeError));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

/**
 * Verifica si dos ubicaciones están dentro del rango máximo permitido
 * @param {number} lat1 - Latitud del primer punto
 * @param {number} lon1 - Longitud del primer punto
 * @param {number} lat2 - Latitud del segundo punto
 * @param {number} lon2 - Longitud del segundo punto
 * @param {number} rangoMaximo - Rango máximo en metros (por defecto 5)
 * @returns {{dentroDelRango: boolean, distancia: number}}
 */
export const verificarRangoUbicacion = (lat1, lon1, lat2, lon2, rangoMaximo = 5) => {
  const distancia = calcularDistancia(lat1, lon1, lat2, lon2);
  return {
    dentroDelRango: distancia <= rangoMaximo,
    distancia: Math.round(distancia * 100) / 100 // Redondear a 2 decimales
  };
};
