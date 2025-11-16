import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Code, Server, Database, Lock, Zap } from 'lucide-react';

export default function AutomationGuide() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Code className="size-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl mb-2">Guía de Implementación Técnica</h3>
            <p className="text-gray-600">
              Aprende cómo implementar estos sistemas de automatización en producción
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Example 1: API Integration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#6D37D5]">Ejemplo 1</Badge>
              <h4 className="font-semibold">Integración con APIs de Redes Sociales</h4>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <Server className="size-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-2">1. Configuración de APIs</h5>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="font-mono bg-white p-2 rounded border">
                      # Instagram Graph API
                      <br />GET /v18.0/{'{user-id}'}/insights?metric=follower_count,engagement_rate
                      <br />Authorization: Bearer YOUR_ACCESS_TOKEN
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Registra tu app en Meta for Developers</li>
                      <li>Solicita permisos: instagram_basic, instagram_manage_insights</li>
                      <li>Implementa OAuth 2.0 para autenticación de influencers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Database className="size-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-2">2. Estructura de Datos</h5>
                  <div className="text-sm">
                    <pre className="bg-white p-3 rounded border overflow-x-auto">
{`{
  "influencer_id": "12345",
  "platform": "instagram",
  "metrics": {
    "followers": 125000,
    "engagement_rate": 4.2,
    "avg_likes": 5250,
    "avg_comments": 320,
    "reach": 95000
  },
  "timestamp": "2025-11-16T14:30:00Z",
  "last_updated": "2025-11-16T14:30:00Z"
}`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="size-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-2">3. Proceso de Importación</h5>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-mono bg-white p-2 rounded border text-xs">
                      const importInfluencer = async (username) =&gt; {'{'}
                      <br />  const profile = await fetchInstagramProfile(username);
                      <br />  const insights = await fetchInstagramInsights(profile.id);
                      <br />  return saveToDatabase({'{'}...profile, ...insights{'}'});
                      <br />{'}'};
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="size-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-2">4. Seguridad y Mejores Prácticas</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                    <li>Almacena tokens de acceso encriptados en variables de entorno</li>
                    <li>Implementa rate limiting (max 200 requests/hora por platform)</li>
                    <li>Usa webhooks para actualizaciones en tiempo real cuando sea posible</li>
                    <li>Implementa retry logic con exponential backoff</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Example 2: Automated Monitoring */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600">Ejemplo 2</Badge>
              <h4 className="font-semibold">Sistema de Monitoreo Automatizado</h4>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <Server className="size-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-2">1. Arquitectura de Cron Jobs</h5>
                  <div className="text-sm">
                    <pre className="bg-white p-3 rounded border overflow-x-auto text-xs">
{`// Node.js con node-cron
import cron from 'node-cron';

// Actualización cada hora
cron.schedule('0 * * * *', async () => {
  const influencers = await getActiveInfluencers();
  for (const inf of influencers) {
    await updateInfluencerMetrics(inf.id);
  }
});

// Reportes diarios a las 00:00
cron.schedule('0 0 * * *', async () => {
  await generateDailyReports();
  await sendEmailNotifications();
});`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Database className="size-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-2">2. Base de Datos y Cache</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
                    <li><strong>PostgreSQL:</strong> Almacenamiento principal de datos históricos</li>
                    <li><strong>Redis:</strong> Cache para métricas frecuentes (TTL: 1 hora)</li>
                    <li><strong>TimescaleDB:</strong> Para series temporales de métricas</li>
                    <li><strong>Elasticsearch:</strong> Búsqueda y análisis de tendencias</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="size-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-2">3. Detección de Anomalías</h5>
                  <div className="text-sm">
                    <pre className="bg-white p-3 rounded border overflow-x-auto text-xs">
{`// Algoritmo simple de detección
const detectAnomalies = (current, historical) => {
  const avg = historical.reduce((a,b) => a+b) / historical.length;
  const stdDev = Math.sqrt(
    historical.map(x => Math.pow(x - avg, 2))
      .reduce((a,b) => a+b) / historical.length
  );
  
  // Alerta si está fuera de 2 desviaciones estándar
  if (Math.abs(current - avg) > 2 * stdDev) {
    return { isAnomaly: true, deviation: current - avg };
  }
  return { isAnomaly: false };
};`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="size-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-semibold mb-2">4. Sistema de Alertas</h5>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="font-semibold">Canales de notificación:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Email (SendGrid/AWS SES) para reportes diarios</li>
                      <li>Slack/Discord webhooks para alertas críticas</li>
                      <li>SMS (Twilio) para caídas significativas en métricas</li>
                      <li>In-app notifications para cambios moderados</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Implementation Checklist */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold mb-3 text-blue-900">Checklist de Implementación</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-blue-900">Backend</p>
                <ul className="space-y-1 text-gray-700">
                  <li>✓ Configurar servidor Node.js/Python</li>
                  <li>✓ Implementar API endpoints REST</li>
                  <li>✓ Configurar base de datos y migraciones</li>
                  <li>✓ Implementar queue system (Bull/RabbitMQ)</li>
                  <li>✓ Configurar logging y monitoring</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-blue-900">Infraestructura</p>
                <ul className="space-y-1 text-gray-700">
                  <li>✓ Deploy en AWS/GCP/Azure</li>
                  <li>✓ Configurar CI/CD pipeline</li>
                  <li>✓ Implementar load balancing</li>
                  <li>✓ Configurar backups automáticos</li>
                  <li>✓ Establecer alertas de sistema</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cost Estimation */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-3">Estimación de Costos Mensuales</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>APIs de Redes Sociales (Instagram, TikTok, YouTube)</span>
                <span className="font-semibold">$0 - $200</span>
              </div>
              <div className="flex justify-between">
                <span>Servidor (AWS EC2 t3.medium)</span>
                <span className="font-semibold">~$40</span>
              </div>
              <div className="flex justify-between">
                <span>Base de datos (RDS PostgreSQL)</span>
                <span className="font-semibold">~$50</span>
              </div>
              <div className="flex justify-between">
                <span>Redis Cache (ElastiCache)</span>
                <span className="font-semibold">~$25</span>
              </div>
              <div className="flex justify-between">
                <span>Email/SMS (SendGrid + Twilio)</span>
                <span className="font-semibold">~$30</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total Estimado</span>
                <span className="font-semibold text-[#6D37D5]">$145 - $345 / mes</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}