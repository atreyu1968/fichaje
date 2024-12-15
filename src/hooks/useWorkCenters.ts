import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_CONFIG } from '../config';
import toast from 'react-hot-toast';

interface WorkCenter {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

interface NewWorkCenter {
  name: string;
  latitude: string;
  longitude: string;
  radius: number;
}

export const useWorkCenters = () => {
  const [centers, setCenters] = useState<WorkCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCenters = async () => {
    try {
      const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/work-centers`);
      setCenters(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los centros de trabajo');
    } finally {
      setLoading(false);
    }
  };

  const createCenter = async (center: NewWorkCenter) => {
    try {
      await axios.post(`${SERVER_CONFIG.BASE_URL}/api/work-centers`, {
        ...center,
        latitude: parseFloat(center.latitude),
        longitude: parseFloat(center.longitude),
        radius: parseInt(center.radius.toString())
      });
      toast.success('Centro de trabajo creado correctamente');
      await fetchCenters();
      return true;
    } catch (err) {
      toast.error('Error al crear el centro de trabajo');
      return false;
    }
  };

  const deleteCenter = async (id: number) => {
    try {
      await axios.delete(`${SERVER_CONFIG.BASE_URL}/api/work-centers/${id}`);
      toast.success('Centro de trabajo eliminado correctamente');
      await fetchCenters();
      return true;
    } catch (err) {
      toast.error('Error al eliminar el centro de trabajo');
      return false;
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return {
    centers,
    loading,
    error,
    createCenter,
    deleteCenter
  };
};