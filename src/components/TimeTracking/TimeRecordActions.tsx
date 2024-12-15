import React from 'react';
import { Clock, MapPin } from 'lucide-react';

interface TimeRecordActionsProps {
  isLoading: boolean;
  isGettingLocation: boolean;
  disabled: boolean;
  onClick: () => void;
}

const TimeRecordActions: React.FC<TimeRecordActionsProps> = ({
  isLoading,
  isGettingLocation,
  disabled,
  onClick
}) => (
  <button
    className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    onClick={onClick}
    disabled={disabled || isLoading || isGettingLocation}
  >
    {isGettingLocation ? (
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
);

export default TimeRecordActions;