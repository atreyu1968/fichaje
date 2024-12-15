import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { SERVER_CONFIG } from '../../config';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import toast from 'react-hot-toast';

const WorkCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCenter, setNewCenter] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius: 1000
  });

  useEffect(() => {
    fetchCenters();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${SERVER_CONFIG.BASE_URL}/api/work-centers`, {
        ...newCenter,
        latitude: parseFloat(newCenter.latitude),
        longitude: parseFloat(newCenter.longitude),
        radius: parseInt(newCenter.radius)
      });
      toast.success('Centro de trabajo creado correctamente');
      setNewCenter({ name: '', latitude: '', longitude: '', radius: 1000 });
      setShowForm(false);
      fetchCenters();
    } catch (err) {
      toast.error('Error al crear el centro de trabajo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este centro de trabajo?')) {
      try {
        await axios.delete(`${SERVER_CONFIG.BASE_URL}/api/work-centers/${id}`);
        toast.success('Centro de trabajo eliminado correctamente');
        fetchCenters();
      } catch (err) {
        toast.error('Error al eliminar el centro de trabajo');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Centros de Trabajo</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Centro
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={newCenter.name}
                onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitud</label>
                <input
                  type="number"
                  step="any"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newCenter.latitude}
                  onChange={(e) => setNewCenter({ ...newCenter, latitude: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Longitud</label>
                <input
                  type="number"
                  step="any"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newCenter.longitude}
                  onChange={(e) => setNewCenter({ ...newCenter, longitude: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Radio permitido (metros)
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={newCenter.radius}
                onChange={(e) => setNewCenter({ ...newCenter, radius: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ubicación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Radio
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {centers.map((center) => (
              <tr key={center.id}>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {center.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <a
                    href={`https://www.google.com/maps?q=${center.latitude},${center.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Ver en mapa
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {center.radius}m
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <button
                    onClick={() => handleDelete(center.id)}
                    className="text-red-600 hover:text-red-800 float-right"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkCenters;