import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="flex justify-center mb-4">
          <img 
            src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/34/60/62/346062db-5d1b-e078-f7e8-5474829e741c/AppIcon-0-0-1x_U007epad-0-1-85-220.png/1200x630wa.jpg" 
            alt="Takenos Logo" 
            className="h-14" 
          />
        </div>
    
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2 text-[#6D37D5]">Takenos</h1>
          <p className="text-gray-600">Automatización de influencers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 w-full">
          <h2 className="text-2xl mb-6 text-center">Bienvenido</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@takenos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[#6D37D5] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#6D37D5] hover:bg-[#5C2DB5] text-white"
            >
              Iniciar sesión
            </Button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 innova hack Santa Cruz- Takenos.
        </p>
      </div>
    </div>
  );
}