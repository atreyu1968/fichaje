import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useTimeRecords } from '../hooks/useTimeRecords';
import { format } from 'date-fns';
import { Clock, MapPin, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorMessage } from './common/ErrorMessage';
import toast from 'react-hot-toast';

const TimeTracking = () => {
  const { employees, loading: employeesLoading, error: employeesError } = useEmployees();
  const { timeRecords, loading: recordsLoading, error: recordsError, checkIn, fetchTimeRecords } = useTimeRecords();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [notes, setNotes] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId);
    if (employeeId) {
      fetchTimeRecords(employeeId);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedEmployee) {
      toast.error('Por favor, seleccione un empleado');
      return;
    }

    setGettingLocation(true);
    setLocationError('');

    try {
      if (!navigator.geolocation) {
        throw new Error('La geolocalización no está disponible en este dispositivo');
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const success = await checkIn({
        employee_id: selectedEmployee,
        notes,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      if (success) {
        setNotes('');
        toast.success('Fichaje registrado correctamente');
      }
    } catch (error) {
      console.error('Error de geolocalización:', error);
      setLocationError('Error al obtener la ubicación. Por favor, asegúrese de permitir el acceso a la ubicación.');
      toast.error('Error al obtener la ubicación');
    } finally {
      setGettingLocation(false);
    }
  };

  if (employeesLoading) return <LoadingSpinner />;
  if (employeesError) return <ErrorMessage message={employeesError} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Control de Fichajes</h1>
      
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Empleado</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedEmployee}
              onChange={(e) => handleEmployeeChange(e.target.value)}
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
            onClick={handleCheckIn}
            disabled={!selectedEmployee || recordsLoading || gettingLocation}
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

      {recordsError && <ErrorMessage message={recordsError} />}
      
      {recordsLoading ? (
        <LoadingSpinner />
      ) : (
        timeRecords.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entrada
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Salida
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ubicación
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Notas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {format(new Date(record.check_in), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.check_out ? format(new Date(record.check_out), 'dd/MM/yyyy HH:mm') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.latitude_in && record.longitude_in ? (
                        <a
                          href={`https://www.google.com/maps?q=${record.latitude_in},${record.longitude_in}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Ver mapa
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default TimeTracking;