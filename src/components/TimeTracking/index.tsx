import React from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { useTimeRecords } from '../../hooks/useTimeRecords';
import CheckInForm from './CheckInForm';
import TimeRecordsTable from './TimeRecordsTable';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';

const TimeTracking = () => {
  const { employees, loading: employeesLoading, error: employeesError } = useEmployees();
  const { 
    timeRecords, 
    loading: recordsLoading, 
    error: recordsError, 
    checkIn, 
    fetchTimeRecords 
  } = useTimeRecords();

  if (employeesLoading) return <LoadingSpinner />;
  if (employeesError) return <ErrorMessage message={employeesError} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Control de Fichajes</h1>
      
      <CheckInForm 
        employees={employees}
        onCheckIn={checkIn}
        loading={recordsLoading}
      />

      {recordsError && <ErrorMessage message={recordsError} />}
      
      {recordsLoading ? (
        <LoadingSpinner />
      ) : (
        <TimeRecordsTable records={timeRecords} />
      )}
    </div>
  );
};

export default TimeTracking;