import React from 'react';
import { Lock } from 'lucide-react';
import { LoginFormProps } from './types';

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading
}) => (
  <form className="mt-8 space-y-6" onSubmit={onSubmit}>
    <div className="rounded-md shadow-sm -space-y-px">
      <div>
        <label htmlFor="email" className="sr-only">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Email"
          value={email}
          onChange={onEmailChange}
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="password" className="sr-only">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Contraseña"
          value={password}
          onChange={onPasswordChange}
          disabled={isLoading}
        />
      </div>
    </div>

    <div>
      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </div>
  </form>
);