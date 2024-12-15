import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Users, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">TimeTrack</span>
          </Link>
          
          {/* Botón de menú móvil */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Menú escritorio */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <NavLinks onClick={() => setIsMenuOpen(false)} />
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const NavLinks = ({ onClick = () => {} }) => (
  <>
    <Link
      to="/"
      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
      onClick={onClick}
    >
      <LayoutDashboard className="h-5 w-5" />
      <span>Dashboard</span>
    </Link>
    <Link
      to="/time-tracking"
      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
      onClick={onClick}
    >
      <Clock className="h-5 w-5" />
      <span>Fichajes</span>
    </Link>
    <Link
      to="/employees"
      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
      onClick={onClick}
    >
      <Users className="h-5 w-5" />
      <span>Empleados</span>
    </Link>
  </>
);

export default Navbar;