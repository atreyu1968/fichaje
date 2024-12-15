import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Location {
  latitude: number;
  longitude: number;
}

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(result.state);
      
      result.addEventListener('change', () => {
        setPermissionStatus(result.state);
      });
    } catch (error) {
      console.error('Error al verificar permisos:', error);
    }
  };

  const requestPermission = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissionStatus('granted');
          resolve();
        },
        (error) => {
          setPermissionStatus('denied');
          reject(error);
        }
      );
    });
  };

  const getLocation = async (): Promise<Location> => {
    if (!navigator.geolocation) {
      const error = 'La geolocalización no está disponible en este dispositivo';
      setError(error);
      throw new Error(error);
    }

    setLoading(true);
    setError(null);

    try {
      if (permissionStatus === 'denied') {
        await requestPermission();
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      const errorMessage = getGeolocationErrorMessage(error as GeolocationPositionError);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    getLocation,
    loading,
    error,
    permissionStatus,
    requestPermission
  };
};

const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Por favor, activa la geolocalización para poder fichar. Es necesario para registrar tu ubicación.';
    case error.POSITION_UNAVAILABLE:
      return 'No se pudo obtener tu ubicación. Por favor, verifica que los servicios de ubicación estén activados.';
    case error.TIMEOUT:
      return 'Se agotó el tiempo de espera al obtener la ubicación. Por favor, inténtalo de nuevo.';
    default:
      return 'Error desconocido al obtener la ubicación. Por favor, inténtalo de nuevo.';
  }
};