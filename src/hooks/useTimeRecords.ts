import { useState } from 'react';
import { timeRecordService } from '../services/api';

export const useTimeRecords = () => {
  const [timeRecords, setTimeRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimeRecords = async (employeeId) => {
    setLoading(true);
    try {
      const response = await timeRecordService.getByEmployee(employeeId);
      setTimeRecords(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async (data) => {
    setLoading(true);
    try {
      await timeRecordService.checkIn(data);
      if (data.employee_id) {
        await fetchTimeRecords(data.employee_id);
      }
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    timeRecords,
    loading,
    error,
    fetchTimeRecords,
    checkIn
  };
};