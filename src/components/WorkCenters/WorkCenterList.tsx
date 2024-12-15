import React from 'react';
import { MapPin, Trash2 } from 'lucide-react';

interface WorkCenter {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

interface WorkCenterListProps {
  centers: WorkCenter[];
  onDelete: (id: number) => void;
}

const WorkCenterList: React.FC<WorkCenterListProps> = ({ centers, onDelete }) => (
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
                onClick={() => onDelete(center.id)}
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
);