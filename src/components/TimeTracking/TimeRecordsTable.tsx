import React from 'react';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';

interface TimeRecord {
  id: number;
  check_in: string;
  check_out: string | null;
  latitude_in: number;
  longitude_in: number;
  notes: string;
}

interface TimeRecordsTableProps {
  records: TimeRecord[];
}

const TimeRecordsTable: React.FC<TimeRecordsTableProps> = ({ records }) => {
  if (records.length === 0) return null;

  return (
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
          {records.map((record) => (
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
  );
};

export default TimeRecordsTable;