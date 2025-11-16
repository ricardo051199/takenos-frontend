# 🤖 Guía de Implementación de IA para Predicción de Tendencias - Takenos

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Modelos de Machine Learning Implementados](#modelos-de-machine-learning-implementados)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Implementación Técnica](#implementación-técnica)
5. [Entrenamiento de Modelos](#entrenamiento-de-modelos)
6. [Deploy en Producción](#deploy-en-producción)
7. [Monitoreo y Optimización](#monitoreo-y-optimización)

---

## Introducción

Esta guía detalla cómo implementar un sistema de inteligencia artificial para predecir tendencias de influencers, detectar oportunidades y generar recomendaciones estratégicas automáticamente.

### Objetivos del Sistema

✅ Predecir crecimiento de influencers (próximos 30-90 días)  
✅ Detectar tendencias emergentes en tiempo real  
✅ Identificar influencers "estrellas en ascenso"  
✅ Generar recomendaciones estratégicas personalizadas  
✅ Calcular y proyectar ROI de campañas  
✅ Detectar anomalías y alertas tempranas  

---

## Modelos de Machine Learning Implementados

### 1. Modelo de Regresión Lineal (Predicción de Crecimiento)

**Objetivo:** Predecir el crecimiento de métricas (vistas, seguidores, engagement) en los próximos períodos.

**Algoritmo:** Regresión Lineal con Regularización (Ridge/Lasso)

**Features (Variables de Entrada):**
- Datos históricos de últimos 6 meses
- Tasa de crecimiento mensual
- Engagement rate promedio
- Número de publicaciones por período
- Reach promedio
- Días de actividad

**Implementación en Python:**

```python
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

class InfluencerGrowthPredictor:
    def __init__(self):
        self.model = Ridge(alpha=1.0)
        self.scaler = StandardScaler()
        self.trained = False
    
    def prepare_features(self, historical_data):
        """
        Prepara features a partir de datos históricos
        historical_data: DataFrame con columnas [date, views, followers, engagement]
        """
        features = []
        
        # Calcular tendencias
        views_trend = np.polyfit(range(len(historical_data)), historical_data['views'], 1)[0]
        followers_trend = np.polyfit(range(len(historical_data)), historical_data['followers'], 1)[0]
        
        # Calcular estadísticas
        avg_engagement = historical_data['engagement'].mean()
        std_engagement = historical_data['engagement'].std()
        
        # Calcular momentum (últimos 3 vs primeros 3 meses)
        recent_growth = historical_data['views'].tail(3).mean() / historical_data['views'].head(3).mean()
        
        features = [
            views_trend,
            followers_trend,
            avg_engagement,
            std_engagement,
            recent_growth,
            len(historical_data),  # períodos de datos
            historical_data['views'].iloc[-1],  # último valor
        ]
        
        return np.array(features).reshape(1, -1)
    
    def train(self, training_data):
        """
        Entrena el modelo con datos históricos
        training_data: Lista de {historical: DataFrame, target: float}
        """
        X = []
        y = []
        
        for sample in training_data:
            features = self.prepare_features(sample['historical'])
            X.append(features[0])
            y.append(sample['target'])
        
        X = np.array(X)
        y = np.array(y)
        
        # Dividir en train/test
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Normalizar features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Entrenar modelo
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluar
        y_pred = self.model.predict(X_test_scaled)
        r2 = r2_score(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        
        self.trained = True
        
        return {
            'r2_score': r2,
            'mae': mae,
            'confidence': r2 * 100  # Convertir a porcentaje
        }
    
    def predict(self, historical_data):
        """
        Predice el valor futuro basado en datos históricos
        """
        if not self.trained:
            raise Exception("Modelo no entrenado. Ejecuta train() primero.")
        
        features = self.prepare_features(historical_data)
        features_scaled = self.scaler.transform(features)
        
        prediction = self.model.predict(features_scaled)[0]
        
        # Calcular intervalo de confianza (aproximado)
        confidence = self.model.score(features_scaled, [prediction]) * 100
        
        return {
            'prediction': float(prediction),
            'confidence': max(0, min(100, confidence)),
            'lower_bound': prediction * 0.85,
            'upper_bound': prediction * 1.15
        }

# Uso del modelo
predictor = InfluencerGrowthPredictor()

# Datos de entrenamiento (ejemplo)
training_samples = [
    {
        'historical': pd.DataFrame({
            'date': pd.date_range('2024-05-01', periods=6, freq='M'),
            'views': [100000, 120000, 145000, 170000, 200000, 240000],
            'followers': [50000, 55000, 62000, 70000, 80000, 95000],
            'engagement': [3.2, 3.5, 3.8, 4.0, 4.2, 4.5]
        }),
        'target': 290000  # Valor real del mes 7
    },
    # ... más muestras de entrenamiento
]

# Entrenar
results = predictor.train(training_samples)
print(f"R² Score: {results['r2_score']:.2f}")
print(f"MAE: {results['mae']:.0f}")

# Predecir para un nuevo influencer
new_influencer_data = pd.DataFrame({
    'date': pd.date_range('2024-09-01', periods=6, freq='M'),
    'views': [150000, 165000, 180000, 210000, 245000, 280000],
    'followers': [60000, 65000, 72000, 82000, 95000, 110000],
    'engagement': [3.8, 4.0, 4.1, 4.3, 4.5, 4.7]
})

prediction = predictor.predict(new_influencer_data)
print(f"Predicción próximo mes: {prediction['prediction']:,.0f} vistas")
print(f"Confianza: {prediction['confidence']:.1f}%")
```

### 2. Modelo de Clustering (Segmentación de Influencers)

**Objetivo:** Agrupar influencers en segmentos similares para identificar patrones y oportunidades.

**Algoritmo:** K-Means Clustering

**Implementación:**

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

class InfluencerSegmentation:
    def __init__(self, n_clusters=4):
        self.n_clusters = n_clusters
        self.model = KMeans(n_clusters=n_clusters, random_state=42)
        self.scaler = StandardScaler()
        self.cluster_labels = None
    
    def fit(self, influencers_data):
        """
        influencers_data: DataFrame con columnas 
        [followers, engagement, views, growth_rate, avg_likes]
        """
        # Seleccionar features
        features = influencers_data[['followers', 'engagement', 'views', 'growth_rate']].values
        
        # Normalizar
        features_scaled = self.scaler.fit_transform(features)
        
        # Aplicar clustering
        self.model.fit(features_scaled)
        self.cluster_labels = self.model.labels_
        
        # Calcular métricas de cada cluster
        influencers_data['cluster'] = self.cluster_labels
        
        cluster_stats = {}
        for i in range(self.n_clusters):
            cluster_data = influencers_data[influencers_data['cluster'] == i]
            cluster_stats[i] = {
                'size': len(cluster_data),
                'avg_followers': cluster_data['followers'].mean(),
                'avg_engagement': cluster_data['engagement'].mean(),
                'avg_growth': cluster_data['growth_rate'].mean(),
                'influencers': cluster_data.index.tolist()
            }
        
        return cluster_stats
    
    def predict(self, new_influencer):
        """
        Predice a qué cluster pertenece un nuevo influencer
        """
        features = [[
            new_influencer['followers'],
            new_influencer['engagement'],
            new_influencer['views'],
            new_influencer['growth_rate']
        ]]
        features_scaled = self.scaler.transform(features)
        cluster = self.model.predict(features_scaled)[0]
        return cluster
    
    def identify_rising_stars(self, influencers_data, cluster_stats):
        """
        Identifica influencers con alto potencial
        """
        # Criterio: Alto growth_rate + alto engagement + cluster de crecimiento
        rising_stars = influencers_data[
            (influencers_data['growth_rate'] > influencers_data['growth_rate'].quantile(0.75)) &
            (influencers_data['engagement'] > influencers_data['engagement'].median())
        ].sort_values('growth_rate', ascending=False)
        
        return rising_stars

# Uso
segmentation = InfluencerSegmentation(n_clusters=4)

influencers_df = pd.DataFrame({
    'id': range(50),
    'followers': np.random.randint(10000, 500000, 50),
    'engagement': np.random.uniform(2.0, 8.0, 50),
    'views': np.random.randint(50000, 2000000, 50),
    'growth_rate': np.random.uniform(-5, 25, 50)
})

clusters = segmentation.fit(influencers_df)
for cluster_id, stats in clusters.items():
    print(f"\nCluster {cluster_id}:")
    print(f"  Tamaño: {stats['size']}")
    print(f"  Seguidores promedio: {stats['avg_followers']:,.0f}")
    print(f"  Engagement promedio: {stats['avg_engagement']:.2f}%")
    print(f"  Crecimiento promedio: {stats['avg_growth']:.2f}%")
```

### 3. Modelo de Series Temporales (ARIMA/Prophet)

**Objetivo:** Modelar y predecir tendencias temporales complejas con estacionalidad.

**Implementación con Prophet (Facebook):**

```python
from prophet import Prophet
import pandas as pd

class TimeSeriesForecaster:
    def __init__(self):
        self.model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            changepoint_prior_scale=0.05
        )
    
    def prepare_data(self, historical_data):
        """
        Convierte datos a formato Prophet
        """
        df = historical_data[['date', 'metric']].copy()
        df.columns = ['ds', 'y']  # Prophet requiere estos nombres
        return df
    
    def fit_predict(self, historical_data, periods=30):
        """
        Entrena y predice para los próximos 'periods' días
        """
        df = self.prepare_data(historical_data)
        
        # Entrenar modelo
        self.model.fit(df)
        
        # Crear dataframe de fechas futuras
        future = self.model.make_future_dataframe(periods=periods)
        
        # Predecir
        forecast = self.model.predict(future)
        
        return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
    
    def detect_trend_changes(self, forecast):
        """
        Detecta cambios significativos en tendencias
        """
        forecast['pct_change'] = forecast['yhat'].pct_change() * 100
        
        # Detectar cambios > 10%
        significant_changes = forecast[abs(forecast['pct_change']) > 10]
        
        return significant_changes

# Uso
forecaster = TimeSeriesForecaster()

# Datos históricos (últimos 6 meses diarios)
dates = pd.date_range('2024-05-01', '2024-10-31', freq='D')
historical_data = pd.DataFrame({
    'date': dates,
    'metric': np.random.randint(80000, 120000, len(dates)) + 
              np.linspace(0, 40000, len(dates))  # Tendencia creciente
})

# Predecir próximos 30 días
forecast = forecaster.fit_predict(historical_data, periods=30)
print(forecast.head(10))

# Detectar cambios de tendencia
changes = forecaster.detect_trend_changes(forecast)
print(f"\nCambios significativos detectados: {len(changes)}")
```

### 4. Sistema de Recomendaciones (Collaborative Filtering)

**Objetivo:** Recomendar estrategias basadas en influencers similares exitosos.

**Implementación:**

```python
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class StrategyRecommender:
    def __init__(self):
        self.influencer_matrix = None
        self.influencer_ids = None
        self.similarity_matrix = None
    
    def build_matrix(self, influencers_data):
        """
        Construye matriz de características de influencers
        """
        features = ['followers', 'engagement', 'views', 'growth_rate', 
                   'avg_likes', 'avg_comments', 'posting_frequency']
        
        self.influencer_matrix = influencers_data[features].values
        self.influencer_ids = influencers_data['id'].values
        
        # Calcular similitud coseno
        self.similarity_matrix = cosine_similarity(self.influencer_matrix)
    
    def find_similar_influencers(self, influencer_id, top_n=5):
        """
        Encuentra influencers similares
        """
        idx = np.where(self.influencer_ids == influencer_id)[0][0]
        similarities = self.similarity_matrix[idx]
        
        # Ordenar por similitud (excluyendo el mismo influencer)
        similar_indices = similarities.argsort()[::-1][1:top_n+1]
        
        similar_ids = self.influencer_ids[similar_indices]
        similarity_scores = similarities[similar_indices]
        
        return list(zip(similar_ids, similarity_scores))
    
    def recommend_strategies(self, influencer_id, strategies_db):
        """
        Recomienda estrategias basadas en influencers similares exitosos
        strategies_db: Dict {influencer_id: [list of strategies]}
        """
        similar = self.find_similar_influencers(influencer_id)
        
        recommendations = []
        for similar_id, score in similar:
            if similar_id in strategies_db:
                for strategy in strategies_db[similar_id]:
                    recommendations.append({
                        'strategy': strategy,
                        'confidence': score * 100,
                        'source_influencer': similar_id
                    })
        
        return sorted(recommendations, key=lambda x: x['confidence'], reverse=True)

# Uso
recommender = StrategyRecommender()

# Datos de influencers
influencers_df = pd.DataFrame({
    'id': range(20),
    'followers': np.random.randint(10000, 500000, 20),
    'engagement': np.random.uniform(2.0, 8.0, 20),
    'views': np.random.randint(50000, 2000000, 20),
    'growth_rate': np.random.uniform(-5, 25, 20),
    'avg_likes': np.random.randint(1000, 50000, 20),
    'avg_comments': np.random.randint(100, 5000, 20),
    'posting_frequency': np.random.randint(3, 20, 20)
})

recommender.build_matrix(influencers_df)

# Base de datos de estrategias exitosas
strategies_db = {
    0: ['Publicar videos cortos diarios', 'Colaborar con marcas fitness'],
    1: ['Contenido educativo semanal', 'Live streams mensuales'],
    5: ['Stories interactivos', 'Reels con música trending'],
}

# Recomendar para influencer #10
recommendations = recommender.recommend_strategies(10, strategies_db)
for rec in recommendations[:3]:
    print(f"Estrategia: {rec['strategy']}")
    print(f"Confianza: {rec['confidence']:.1f}%\n")
```

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Dashboard  │  │ AI Insights│  │Predictions │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└────────────────────────┬────────────────────────────────┘
                         │ REST API / WebSocket
┌────────────────────────▼────────────────────────────────┐
│              API LAYER (Node.js/FastAPI)                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ API Router │  │Auth/Tokens │  │Rate Limiter│        │
│  └────────────┘  └────────────┘  └────────────┘        │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│            ML SERVICES (Python/TensorFlow)              │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Prediction Svc  │  │ Clustering Svc  │              │
│  │ (Ridge/Prophet) │  │    (K-Means)    │              │
│  └─────────────────┘  └─────────────────┘              │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ Anomaly Detect  │  │ Recommendation  │              │
│  │   (Isolation    │  │ (Collaborative) │              │
│  │    Forest)      │  │                 │              │
│  └─────────────────┘  └─────────────────┘              │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│            DATA LAYER (PostgreSQL + Redis)              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │  Raw Data  │  │ Aggregated │  │   Cache    │        │
│  │ (Postgres) │  │   (TS DB)  │  │  (Redis)   │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│      TRAINING & RETRAINING (Apache Airflow)             │
│  - Daily data collection                                │
│  - Weekly model retraining                              │
│  - Monthly model evaluation                             │
└─────────────────────────────────────────────────────────┘
```

---

## Deploy en Producción

### Usando Docker + Kubernetes

**Dockerfile para servicio ML:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**requirements.txt:**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
scikit-learn==1.3.2
pandas==2.1.3
numpy==1.26.2
prophet==1.1.5
tensorflow==2.15.0
redis==5.0.1
psycopg2-binary==2.9.9
pydantic==2.5.2
```

**Kubernetes Deployment:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-prediction-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-prediction
  template:
    metadata:
      labels:
        app: ml-prediction
    spec:
      containers:
      - name: ml-api
        image: takenos/ml-prediction:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secrets
              key: url
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
---
apiVersion: v1
kind: Service
metadata:
  name: ml-prediction-service
spec:
  selector:
    app: ml-prediction
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

---

## Monitoreo y Optimización

### Métricas Clave a Monitorear

```python
import time
from prometheus_client import Counter, Histogram, Gauge

# Definir métricas
prediction_requests = Counter('prediction_requests_total', 'Total de requests de predicción')
prediction_latency = Histogram('prediction_latency_seconds', 'Latencia de predicciones')
model_accuracy = Gauge('model_accuracy', 'Precisión del modelo', ['model_type'])
cache_hit_rate = Gauge('cache_hit_rate', 'Tasa de aciertos de cache')

class MonitoredPredictor:
    def __init__(self, base_predictor):
        self.predictor = base_predictor
    
    def predict(self, data):
        prediction_requests.inc()
        
        start_time = time.time()
        result = self.predictor.predict(data)
        duration = time.time() - start_time
        
        prediction_latency.observe(duration)
        
        return result
```

### Dashboard de Grafana

```yaml
# grafana-dashboard.json (extracto)
{
  "dashboard": {
    "panels": [
      {
        "title": "Prediction Requests/min",
        "targets": [
          {
            "expr": "rate(prediction_requests_total[1m])"
          }
        ]
      },
      {
        "title": "Model Accuracy",
        "targets": [
          {
            "expr": "model_accuracy"
          }
        ]
      },
      {
        "title": "Prediction Latency (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, prediction_latency_seconds)"
          }
        ]
      }
    ]
  }
}
```

---

## Mejores Prácticas

1. **Reentrenamiento Regular**
   - Entrenar modelos semanalmente con datos nuevos
   - Validar rendimiento antes de deployment
   - Mantener versiones anteriores para rollback

2. **A/B Testing de Modelos**
   - Comparar modelos nuevos vs antiguos en producción
   - Medir impacto en métricas de negocio
   - Gradual rollout (10% → 50% → 100%)

3. **Feature Engineering**
   - Experimentar con nuevas features
   - Analizar importancia de features
   - Eliminar features redundantes

4. **Optimización de Rendimiento**
   - Cache de predicciones frecuentes (Redis)
   - Batch predictions para múltiples influencers
   - Model quantization para reducir tamaño

5. **Seguridad y Privacidad**
   - Encriptar datos sensibles
   - Anonimizar datos de entrenamiento
   - Auditar acceso a modelos

---

## Costos Estimados (Producción)

| Componente | Costo Mensual |
|------------|---------------|
| GCP ML Engine (2 instancias n1-standard-4) | $280 |
| PostgreSQL (Cloud SQL) | $80 |
| Redis (Memorystore) | $40 |
| Cloud Storage (modelos + datos) | $20 |
| Monitoring (Cloud Monitoring) | $30 |
| **TOTAL** | **$450/mes** |

---

## Recursos Adicionales

- [Scikit-learn Documentation](https://scikit-learn.org/)
- [Prophet Documentation](https://facebook.github.io/prophet/)
- [TensorFlow Guide](https://www.tensorflow.org/guide)
- [MLOps Best Practices](https://ml-ops.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

© 2025 Takenos - Sistema de IA para Predicción de Tendencias de Influencers
