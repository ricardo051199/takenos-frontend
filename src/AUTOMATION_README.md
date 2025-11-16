# 🤖 Guía de Automatización de Datos - Takenos

Esta guía documenta dos métodos principales para automatizar la recolección de datos de influencers en la plataforma Takenos.

## 📋 Tabla de Contenidos

1. [Importación Masiva desde APIs](#1-importación-masiva-desde-apis)
2. [Monitoreo Automático Continuo](#2-monitoreo-automático-continuo)
3. [Configuración Técnica](#configuración-técnica)
4. [Mejores Prácticas](#mejores-prácticas)

---

## 1. Importación Masiva desde APIs

### 🎯 Objetivo
Conectar directamente con las APIs oficiales de redes sociales para importar datos de influencers de forma masiva y bajo demanda.

### 🔑 Plataformas Soportadas

#### Instagram Business API
- **Endpoint Base:** `https://graph.facebook.com/v18.0/`
- **Métricas Disponibles:**
  - Conteo de seguidores
  - Engagement rate
  - Alcance de publicaciones
  - Impresiones
  - Demografía de audiencia

**Requisitos:**
```bash
# 1. Registrar app en Meta for Developers
https://developers.facebook.com/

# 2. Permisos necesarios
- instagram_basic
- instagram_manage_insights
- pages_read_engagement

# 3. Obtener Access Token
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

#### TikTok Creator API
- **Endpoint Base:** `https://open-api.tiktok.com/`
- **Métricas Disponibles:**
  - Seguidores
  - Vistas de video
  - Likes totales
  - Comentarios
  - Shares

**Requisitos:**
```bash
# 1. Registrar app en TikTok for Developers
https://developers.tiktok.com/

# 2. Scopes necesarios
- user.info.basic
- video.list
- video.insights

# 3. OAuth 2.0 Flow
# Los influencers deben autorizar tu app
```

#### YouTube Data API v3
- **Endpoint Base:** `https://www.googleapis.com/youtube/v3/`
- **Métricas Disponibles:**
  - Suscriptores
  - Vistas totales
  - Videos publicados
  - Tiempo de visualización
  - Engagement (likes/dislikes)

**Requisitos:**
```bash
# 1. Crear proyecto en Google Cloud Console
https://console.cloud.google.com/

# 2. Habilitar YouTube Data API v3

# 3. Crear credenciales OAuth 2.0

# 4. Ejemplo de request
curl "https://www.googleapis.com/youtube/v3/channels" \
  -d "part=statistics,snippet" \
  -d "id=CHANNEL_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 📊 Flujo de Importación

```javascript
// Ejemplo de implementación en Node.js
const importInfluencers = async (platform, criteria) => {
  try {
    // 1. Validar credenciales
    const apiToken = process.env[`${platform.toUpperCase()}_API_TOKEN`];
    
    // 2. Buscar influencers según criterios
    const influencersList = await searchInfluencers(platform, {
      minFollowers: criteria.minFollowers,
      minEngagement: criteria.minEngagement,
      category: criteria.category
    });
    
    // 3. Para cada influencer, obtener métricas completas
    const enrichedData = await Promise.all(
      influencersList.map(async (influencer) => {
        const metrics = await fetchMetrics(platform, influencer.id);
        const insights = await fetchInsights(platform, influencer.id);
        
        return {
          ...influencer,
          ...metrics,
          ...insights,
          importedAt: new Date().toISOString()
        };
      })
    );
    
    // 4. Guardar en base de datos (evitar duplicados)
    await saveToDatabase(enrichedData, { upsert: true });
    
    // 5. Notificar éxito
    return {
      success: true,
      imported: enrichedData.length,
      platform
    };
    
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
};
```

### ✨ Características Principales

1. **Filtros Inteligentes**
   - Seguidores mínimos
   - Engagement rate mínimo
   - Categoría de contenido
   - Ubicación geográfica
   - Idioma principal

2. **Detección de Duplicados**
   ```javascript
   const checkDuplicate = async (platform, username) => {
     const existing = await db.influencers.findOne({
       platform,
       username: username.toLowerCase()
     });
     return existing !== null;
   };
   ```

3. **Validación de Datos**
   - Verificación de perfiles activos
   - Detección de bots/cuentas falsas
   - Validación de métricas anormales

4. **Historial de Importaciones**
   - Registro de todas las importaciones
   - Tracking de cambios
   - Rollback en caso de errores

---

## 2. Monitoreo Automático Continuo

### 🎯 Objetivo
Mantener los datos de influencers actualizados automáticamente mediante actualizaciones programadas y monitoreo continuo.

### ⚙️ Configuración de Cron Jobs

#### Usando node-cron (Node.js)

```javascript
import cron from 'node-cron';

// Actualización cada hora
cron.schedule('0 * * * *', async () => {
  console.log('Running hourly update...');
  const activeInfluencers = await getActiveInfluencers();
  
  for (const influencer of activeInfluencers) {
    await updateInfluencerMetrics(influencer.id);
  }
});

// Reportes diarios a las 00:00
cron.schedule('0 0 * * *', async () => {
  console.log('Generating daily reports...');
  await generateDailyReports();
  await sendEmailNotifications();
});

// Limpieza semanal (domingos a las 02:00)
cron.schedule('0 2 * * 0', async () => {
  console.log('Running weekly cleanup...');
  await cleanupOldData();
  await optimizeDatabase();
});
```

#### Usando AWS CloudWatch Events

```yaml
# cloudwatch-events.yml
Events:
  HourlyUpdate:
    Type: Schedule
    Properties:
      Schedule: rate(1 hour)
      State: ENABLED
      Targets:
        - Arn: !GetAtt UpdateFunction.Arn
          Id: HourlyUpdateTarget

  DailyReport:
    Type: Schedule
    Properties:
      Schedule: cron(0 0 * * ? *)
      State: ENABLED
      Targets:
        - Arn: !GetAtt ReportFunction.Arn
          Id: DailyReportTarget
```

### 📊 Datos Monitoreados

1. **Métricas Principales**
   - Conteo de seguidores
   - Engagement rate
   - Publicaciones recientes
   - Alcance promedio

2. **Métricas Avanzadas** (Opcional)
   - Menciones de marca
   - Análisis de sentimiento
   - Tendencias de crecimiento
   - Comparación con competidores

### 🚨 Sistema de Alertas

```javascript
const checkForAnomalies = async (influencerId) => {
  const current = await getCurrentMetrics(influencerId);
  const historical = await getHistoricalMetrics(influencerId, 30); // 30 días
  
  // Calcular promedio y desviación estándar
  const avg = historical.reduce((sum, h) => sum + h.followers, 0) / historical.length;
  const stdDev = Math.sqrt(
    historical
      .map(h => Math.pow(h.followers - avg, 2))
      .reduce((sum, val) => sum + val, 0) / historical.length
  );
  
  // Detectar anomalías (> 2 desviaciones estándar)
  if (Math.abs(current.followers - avg) > 2 * stdDev) {
    const change = ((current.followers - avg) / avg * 100).toFixed(1);
    
    // Enviar alerta
    await sendAlert({
      type: change > 0 ? 'positive_spike' : 'negative_drop',
      influencerId,
      metric: 'followers',
      change: `${change}%`,
      current: current.followers,
      average: avg
    });
  }
};
```

### 📧 Notificaciones

#### Email (usando SendGrid)
```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendDailyReport = async (recipient, data) => {
  const msg = {
    to: recipient,
    from: 'reports@takenos.com',
    subject: 'Reporte Diario de Influencers - Takenos',
    html: generateReportHTML(data)
  };
  
  await sgMail.send(msg);
};
```

#### Slack Webhook
```javascript
const sendSlackAlert = async (message) => {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: message,
      channel: '#influencer-alerts',
      icon_emoji: ':warning:'
    })
  });
};
```

### 🔄 Optimización Dinámica

```javascript
// Ajustar frecuencia según actividad
const optimizeUpdateFrequency = async (influencerId) => {
  const activity = await getActivityLevel(influencerId);
  
  let frequency;
  if (activity.postsPerWeek > 7) {
    frequency = 'hourly'; // Muy activo
  } else if (activity.postsPerWeek > 3) {
    frequency = 'every_4_hours'; // Activo
  } else {
    frequency = 'daily'; // Poco activo
  }
  
  await updateMonitoringConfig(influencerId, { frequency });
};
```

---

## Configuración Técnica

### 🗄️ Base de Datos

#### Schema PostgreSQL

```sql
-- Tabla de influencers
CREATE TABLE influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  profile_url TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(platform, username)
);

-- Tabla de métricas (time-series)
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES influencers(id),
  followers INTEGER,
  engagement_rate DECIMAL(5,2),
  avg_likes INTEGER,
  avg_comments INTEGER,
  reach INTEGER,
  impressions INTEGER,
  recorded_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_influencer_time (influencer_id, recorded_at)
);

-- Tabla de importaciones
CREATE TABLE import_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50),
  status VARCHAR(20),
  influencers_count INTEGER,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT
);

-- Tabla de alertas
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES influencers(id),
  type VARCHAR(50),
  severity VARCHAR(20),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 🚀 Stack Tecnológico Recomendado

```yaml
Backend:
  - Node.js 18+ o Python 3.11+
  - Express.js o FastAPI
  - TypeScript (recomendado)

Base de Datos:
  - PostgreSQL 15+ (principal)
  - Redis 7+ (cache)
  - TimescaleDB (time-series)

Queue System:
  - Bull (Node.js)
  - Celery (Python)
  - AWS SQS

Monitoreo:
  - Prometheus + Grafana
  - New Relic o DataDog
  - Sentry (error tracking)

Infraestructura:
  - Docker + Docker Compose
  - Kubernetes (producción)
  - AWS/GCP/Azure
```

### 📦 Variables de Entorno

```bash
# .env file
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/takenos
REDIS_URL=redis://localhost:6379

# Social Media APIs
INSTAGRAM_CLIENT_ID=your_client_id
INSTAGRAM_CLIENT_SECRET=your_client_secret
TIKTOK_API_KEY=your_api_key
YOUTUBE_API_KEY=your_api_key

# Notifications
SENDGRID_API_KEY=your_sendgrid_key
SLACK_WEBHOOK_URL=your_slack_webhook
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

---

## Mejores Prácticas

### ✅ DO's

1. **Rate Limiting**
   - Respeta los límites de las APIs
   - Implementa exponential backoff
   - Usa colas para distribuir requests

2. **Error Handling**
   ```javascript
   const withRetry = async (fn, maxRetries = 3) => {
     for (let i = 0; i < maxRetries; i++) {
       try {
         return await fn();
       } catch (error) {
         if (i === maxRetries - 1) throw error;
         await sleep(Math.pow(2, i) * 1000); // Exponential backoff
       }
     }
   };
   ```

3. **Logging**
   - Log todas las operaciones importantes
   - Usa niveles de log apropiados
   - Implementa log rotation

4. **Seguridad**
   - Encripta tokens y API keys
   - Usa HTTPS siempre
   - Implementa autenticación robusta
   - Sanitiza inputs

5. **Performance**
   - Usa cache agresivamente
   - Implementa paginación
   - Optimiza queries de BD
   - Usa índices apropiados

### ❌ DON'Ts

1. **NO guardes credenciales en código**
2. **NO hagas requests síncronos en bucles**
3. **NO ignores errores de API**
4. **NO actualices todo siempre** (optimiza)
5. **NO olvides limpiar datos antiguos**

---

## 📊 Costos Estimados

### Mensual (para ~50 influencers monitoreados)

| Servicio | Costo Mensual |
|----------|---------------|
| APIs de Redes Sociales | $0 - $200 |
| Servidor (AWS EC2 t3.medium) | $40 |
| Base de Datos (RDS PostgreSQL) | $50 |
| Redis Cache (ElastiCache) | $25 |
| Email/SMS (SendGrid + Twilio) | $30 |
| Monitoreo (New Relic) | $0 - $100 |
| Storage (S3) | $5 |
| **TOTAL** | **$150 - $450** |

---

## 🚀 Empezar Rápido

```bash
# 1. Clonar repositorio
git clone https://github.com/takenos/automation

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Ejecutar migraciones
npm run migrate

# 5. Iniciar servicios
docker-compose up -d

# 6. Ejecutar automation
npm run automation:start
```

---

## 📚 Recursos Adicionales

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [TikTok Creator API Docs](https://developers.tiktok.com/doc/overview)
- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [Node-cron Documentation](https://github.com/node-cron/node-cron)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)

---

## 🤝 Soporte

Para preguntas o soporte técnico:
- Email: tech@takenos.com
- Slack: #automation-support
- Documentación: https://docs.takenos.com/automation

---

© 2025 Takenos - Automatización de Influencers
