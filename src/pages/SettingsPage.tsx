import { User, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Configuración</h1>
        <p className="text-gray-600">Administra tu cuenta y preferencias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#6D37D5]/10 text-[#6D37D5] rounded-lg">
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700">
              <Bell className="w-5 h-5" />
              <span>Notificaciones</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700">
              <Shield className="w-5 h-5" />
              <span>Seguridad</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700">
              <Palette className="w-5 h-5" />
              <span>Apariencia</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl mb-6">Configuración del Perfil</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <Button variant="outline" className="mr-2">Cambiar Foto</Button>
                  <Button variant="ghost" className="text-red-600 hover:text-red-700">Eliminar</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" defaultValue="John" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" defaultValue="Doe" className="h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@takenos.com" className="h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Input id="role" defaultValue="Marketing Manager" className="h-11" disabled />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-[#6D37D5] hover:bg-[#5C2DB5] text-white">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl mb-6">Preferencias de Notificación</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">Notificaciones por Email</p>
                  <p className="text-xs text-gray-600">Recibir actualizaciones por correo sobre el rendimiento</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">Informes Semanales</p>
                  <p className="text-xs text-gray-600">Recibe resúmenes semanales del rendimiento</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">Alertas de Nuevos Influencers</p>
                  <p className="text-xs text-gray-600">Notificar cuando se agreguen nuevos influencers</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1">Indicadores de Rendimiento</p>
                  <p className="text-xs text-gray-600">Alerta sobre logros significativos</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl mb-6">Seguridad</h2>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start h-11">
                Cambiar Contraseña
              </Button>
              <Button variant="outline" className="w-full justify-start h-11">
                Habilitar Autenticación en Dos Pasos
              </Button>
              <Button variant="outline" className="w-full justify-start h-11 text-red-600 hover:text-red-700 hover:bg-red-50">
                Cerrar Sesión en Todos los Dispositivos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
