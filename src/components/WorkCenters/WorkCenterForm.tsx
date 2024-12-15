import React from 'react';
import { Plus } from 'lucide-react';

interface WorkCenterFormProps {
  newCenter: {
    name: string;
    latitude: string;
    longitude: string;
    radius: number;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string | number) => void;
  onCancel: () => void;
}

const WorkCenterForm: React.FC<WorkCenterFormProps> = ({
  newCenter,
  onSubmit,
  onChange,
  onCancel
}) => (
  <div className="bg-white rounded-lg shadow p-4 md:p-6">
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={newCenter.name}
          onChange={(e) => onChange('name', e.target.value)}
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
            onChange={(e) => onChange('latitude', e.target.value)}
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
            onChange={(e) => onChange('longitude', e.target.value)}
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
          onChange={(e) => onChange('radius', e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
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
);