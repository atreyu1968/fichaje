import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_CONFIG } from '../config';
import { Clock, Users, MapPin, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorMessage } from './common/ErrorMessage';
import WorkCenters from './WorkCenters';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeEmployees: 0,
    todayCheckins: 0,
    pendingCheckouts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${SERVER_CONFIG.BASE_URL}/api/employees`);
        setStats({
          activeEmployees: response.data.length,
          todayCheckins: 0,
          pendingCheckouts: 0
        });
        setError(null);
      } catch (err) {
        setError('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Users className="h-8 w-8 text-blue-600" />}
          title="Empleados Activos"
          value={stats.activeEmployees}
        />
        <StatCard
          icon={<Clock className="h-8 w-8 text-green-600" />}
          title="Fichajes Hoy"
          value={stats.todayCheckins}
        />
        <StatCard
          icon={<AlertCircle className="h-8 w-8 text-yellow-600" />}
          title="Pendientes de Salida"
          value={stats.pendingCheckouts}
        />
      </div>

      {user?.role === 'admin' && <WorkCenters />}
    </div>
  );
}

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow p-4 md:p-6">
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl md:text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;