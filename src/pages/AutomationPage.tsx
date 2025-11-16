import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner@2.0.3';
import AutomationGuide from '../components/AutomationGuide';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Instagram, 
  Youtube, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Pause,
  Settings,
  Database,
  Zap,
  BookOpen
} from 'lucide-react';

export default function AutomationPage() {
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [updateFrequency, setUpdateFrequency] = useState('daily');

  // Simulate API import
  const handleAPIImport = async () => {
    setIsImporting(true);
    setImportProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsImporting(false);
          toast.success('¡Importación completada!', {
            description: '25 influencers importados desde Instagram API'
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Simulate monitoring toggle
  const handleMonitoringToggle = (enabled: boolean) => {
    setMonitoringEnabled(enabled);
    if (enabled) {
      toast.success('Monitoreo automático activado', {
        description: 'Los datos se actualizarán cada ' + (updateFrequency === 'hourly' ? 'hora' : updateFrequency === 'daily' ? 'día' : 'semana')
      });
    } else {
      toast.info('Monitoreo automático desactivado');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Automatización de Datos</h1>
        <p className="text-gray-600">
          Configura procesos automáticos para recolectar y actualizar información de influencers
        </p>
      </div>

      <Tabs defaultValue="api-import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="api-import" className="flex items-center gap-2">
            <Download className="size-4" />
            Importación API
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <RefreshCw className="size-4" />
            Monitoreo Automático
          </TabsTrigger>
        </TabsList>

        {/* EJEMPLO 1: Importación desde APIs de Redes Sociales */}
        <TabsContent value="api-import" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-[#6D37D5]/10 rounded-lg">
                <Database className="size-6 text-[#6D37D5]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl mb-2">Importación Masiva desde APIs</h2>
                <p className="text-gray-600">
                  Conecta con las APIs oficiales de redes sociales para importar datos de influencers automáticamente
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Platform Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plataforma de Red Social</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">
                        <div className="flex items-center gap-2">
                          <Instagram className="size-4" />
                          Instagram Business API
                        </div>
                      </SelectItem>
                      <SelectItem value="tiktok">
                        <div className="flex items-center gap-2">
                          <Zap className="size-4" />
                          TikTok Creator API
                        </div>
                      </SelectItem>
                      <SelectItem value="youtube">
                        <div className="flex items-center gap-2">
                          <Youtube className="size-4" />
                          YouTube Data API
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>API Token / Clave</Label>
                  <Input 
                    type="password" 
                    placeholder="Ingresa tu API token aquí"
                    className="font-mono"
                  />
                </div>
              </div>

              {/* Import Criteria */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Criterios de Importación</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Seguidores Mínimos</Label>
                    <Input type="number" placeholder="10000" defaultValue="10000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Engagement Mínimo (%)</Label>
                    <Input type="number" placeholder="2.5" defaultValue="2.5" step="0.1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="food">Food & Cooking</SelectItem>
                        <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                        <SelectItem value="tech">Tecnología</SelectItem>
                        <SelectItem value="travel">Viajes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Import Progress */}
              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Importando datos...</span>
                    <span className="font-semibold">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={handleAPIImport}
                disabled={isImporting}
                className="w-full bg-[#6D37D5] hover:bg-[#5C2DB5] text-white"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="size-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Download className="size-4 mr-2" />
                    Iniciar Importación
                  </>
                )}
              </Button>

              {/* Features List */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Datos en Tiempo Real</h4>
                    <p className="text-sm text-gray-600">
                      Obtén métricas actualizadas directamente desde las plataformas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Filtros Inteligentes</h4>
                    <p className="text-sm text-gray-600">
                      Importa solo influencers que cumplan tus criterios específicos
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Sin Duplicados</h4>
                    <p className="text-sm text-gray-600">
                      El sistema detecta y evita importar influencers duplicados
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Histórico de Datos</h4>
                    <p className="text-sm text-gray-600">
                      Mantén un registro histórico de todas las métricas importadas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Imports */}
          <Card className="p-6">
            <h3 className="text-xl mb-4">Importaciones Recientes</h3>
            <div className="space-y-3">
              {[
                { platform: 'Instagram', count: 25, date: '2025-11-16 14:30', status: 'success' },
                { platform: 'YouTube', count: 18, date: '2025-11-15 09:15', status: 'success' },
                { platform: 'TikTok', count: 12, date: '2025-11-14 16:45', status: 'partial' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.status === 'success' ? (
                      <CheckCircle2 className="size-5 text-green-600" />
                    ) : (
                      <AlertCircle className="size-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-semibold">{item.platform}</p>
                      <p className="text-sm text-gray-600">{item.count} influencers importados</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.status === 'success' ? 'default' : 'secondary'}>
                      {item.status === 'success' ? 'Completado' : 'Parcial'}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* EJEMPLO 2: Monitoreo y Actualización Automática */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-[#6D37D5]/10 rounded-lg">
                <RefreshCw className="size-6 text-[#6D37D5]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl mb-2">Monitoreo Automático Continuo</h2>
                <p className="text-gray-600">
                  Configura actualizaciones automáticas programadas para mantener los datos de influencers siempre actualizados
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Enable/Disable Monitoring */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {monitoringEnabled ? (
                    <Play className="size-5 text-green-600" />
                  ) : (
                    <Pause className="size-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold">Estado del Monitoreo</h3>
                    <p className="text-sm text-gray-600">
                      {monitoringEnabled ? 'Activo - Actualizando datos automáticamente' : 'Inactivo - Requiere activación manual'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={monitoringEnabled}
                  onCheckedChange={handleMonitoringToggle}
                />
              </div>

              {/* Monitoring Configuration */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Settings className="size-4" />
                    Configuración de Frecuencia
                  </h3>
                  <div className="space-y-2">
                    <Label>Frecuencia de Actualización</Label>
                    <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Cada hora</SelectItem>
                        <SelectItem value="daily">Diariamente (00:00)</SelectItem>
                        <SelectItem value="weekly">Semanalmente (Lunes)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Zona Horaria</Label>
                    <Select defaultValue="america-la-paz">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-la-paz">América/La Paz (GMT-4)</SelectItem>
                        <SelectItem value="america-bogota">América/Bogotá (GMT-5)</SelectItem>
                        <SelectItem value="america-mexico">América/México (GMT-6)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Database className="size-4" />
                    Datos a Monitorear
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Conteo de seguidores', enabled: true },
                      { label: 'Engagement rate', enabled: true },
                      { label: 'Publicaciones recientes', enabled: true },
                      { label: 'Menciones de marca', enabled: false },
                      { label: 'Análisis de sentimiento', enabled: false }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Label className="cursor-pointer">{item.label}</Label>
                        <Switch defaultChecked={item.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Monitoring Status */}
              {monitoringEnabled && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 mb-2">Monitoreo Activo</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Próxima actualización</p>
                          <p className="font-semibold text-green-900">En 2 horas 15 min</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Influencers monitoreados</p>
                          <p className="font-semibold text-green-900">48 activos</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Última actualización</p>
                          <p className="font-semibold text-green-900">Hace 45 minutos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features List */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Alertas Inteligentes</h4>
                    <p className="text-sm text-gray-600">
                      Recibe notificaciones cuando hay cambios significativos en las métricas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Detección de Anomalías</h4>
                    <p className="text-sm text-gray-600">
                      Identifica comportamientos inusuales o picos de actividad automáticamente
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Optimización de Recursos</h4>
                    <p className="text-sm text-gray-600">
                      Ajusta automáticamente la frecuencia según la actividad del influencer
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Reportes Automáticos</h4>
                    <p className="text-sm text-gray-600">
                      Genera y envía reportes semanales de cambios detectados
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Monitoring History */}
          <Card className="p-6">
            <h3 className="text-xl mb-4">Historial de Actualizaciones</h3>
            <div className="space-y-3">
              {[
                { time: '14:30', date: 'Hoy', updates: 48, changes: 12, status: 'success' },
                { time: '12:30', date: 'Hoy', updates: 48, changes: 8, status: 'success' },
                { time: '10:30', date: 'Hoy', updates: 47, changes: 5, status: 'partial' },
                { time: '23:00', date: 'Ayer', updates: 48, changes: 15, status: 'success' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="size-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">{item.time} - {item.date}</p>
                      <p className="text-sm text-gray-600">
                        {item.updates} influencers actualizados • {item.changes} cambios detectados
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.status === 'success' ? 'default' : 'secondary'}>
                    {item.status === 'success' ? 'Exitoso' : 'Parcial'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Automation Guide */}
      <Card className="p-6 mt-6">
        <h3 className="text-xl mb-4">Guía de Automatización</h3>
        <AutomationGuide />
      </Card>
    </div>
  );
}