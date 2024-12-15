import React, { useState, useEffect } from 'react';
import { Clock, MapPin, AlertCircle } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import toast from 'react-hot-toast';

interface CheckInFormProps {
  employees: any[];
  onCheckIn: (data: any) => Promise<boolean>;
  loading: boolean;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ employees, onCheckIn, loading }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [notes, setNotes] = useState('');
  const { getLocation, loading: gettingLocation, error: locationError, permissionStatus, requestPermission } = useGeolocation();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    if (permissionStatus === 'denied') {
      setShowLocationPrompt(true);
    }
  }, [permissionStatus]);

  const handleRequestLocation = async () => {
    try {
      await requestPermission();
      setShowLocationPrompt(false);
      toast.success('¡Gracias! Ahora puedes fichar con tu ubicación');
    } catch (error) {
      toast.error('No se pudo obtener permiso para la ubicación');
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployee) {
      toast.error('Por favor, seleccione un empleado');
      return;
    }

    try {
      if (permissionStatus === 'denied') {
        setShowLocationPrompt(true);
        return;
      }

      const location = await getLocation();
      const success = await onCheckIn({
        employee_id: selectedEmployee,
        notes,
        ...location
      });

      if (success) {
        setNotes('');
        toast.success('Fichaje registrado correctamente');
      }
    } catch (error) {
      toast.error('Error al registrar el fichaje');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="space-y-4">
        {showLocationPrompt && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Para poder fichar, necesitamos acceder a tu ubicación.
                </p>
                <div className="mt-2">
                  <button
                    onClick={handleRequestLocation}
                    className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline"
                  >
                    Activar ubicación
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Empleado</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Seleccionar empleado</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notas</label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Añade notas opcionales..."
          />
        </div>

        {locationError && (
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{locationError}</span>
          </div>
        )}

        <button
          className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!selectedEmployee || loading || gettingLocation}
        >
          {gettingLocation ? (
            <>
              <MapPin className="h-5 w-5 mr-2 animate-pulse" />
              Obteniendo ubicación...
            </>
          ) : (
            <>
              <Clock className="h-5 w-5 mr-2" />
              Registrar Entrada
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckInForm;