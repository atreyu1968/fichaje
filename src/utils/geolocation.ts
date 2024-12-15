export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La geolocalización no está disponible en este dispositivo'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

export const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Por favor, activa la geolocalización para poder fichar.';
    case error.POSITION_UNAVAILABLE:
      return 'No se pudo obtener tu ubicación. Verifica que los servicios de ubicación estén activados.';
    case error.TIMEOUT:
      return 'Se agotó el tiempo de espera al obtener la ubicación.';
    default:
      return 'Error desconocido al obtener la ubicación.';
  }
};