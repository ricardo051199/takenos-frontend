import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb, 
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Zap
} from 'lucide-react';
import { Influencer } from '../lib/mockData';

interface AIInsightsProps {
  influencers: Influencer[];
}

// Función para calcular predicción de crecimiento usando regresión lineal simple
const predictGrowth = (historicalData: number[]): { prediction: number; confidence: number } => {
  if (historicalData.length < 2) return { prediction: 0, confidence: 0 };
  
  const n = historicalData.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  const yValues = historicalData;
  
  // Calcular promedios
  const xMean = xValues.reduce((a, b) => a + b, 0) / n;
  const yMean = yValues.reduce((a, b) => a + b, 0) / n;
  
  // Calcular pendiente (slope)
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }
  
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  // Predicción para el siguiente período
  const prediction = slope * n + intercept;
  
  // Calcular R² (coeficiente de determinación) como medida de confianza
  const predictions = xValues.map(x => slope * x + intercept);
  const ssRes = yValues.reduce((sum, y, i) => sum + Math.pow(y - predictions[i], 2), 0);
  const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const rSquared = 1 - (ssRes / ssTot);
  const confidence = Math.max(0, Math.min(100, rSquared * 100));
  
  return { prediction, confidence };
};

// Detectar anomalías en datos
const detectAnomalies = (data: number[]): boolean[] => {
  if (data.length < 3) return data.map(() => false);
  
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const stdDev = Math.sqrt(
    data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / data.length
  );
  
  return data.map(value => Math.abs(value - mean) > 2 * stdDev);
};

export default function AIInsights({ influencers }: AIInsightsProps) {
  // Generar datos históricos simulados para demostración
  const generateHistoricalData = (baseValue: number, trend: 'up' | 'down' | 'stable') => {
    const data = [];
    let current = baseValue * 0.7;
    
    for (let i = 0; i < 6; i++) {
      if (trend === 'up') {
        current = current * (1.1 + Math.random() * 0.1);
      } else if (trend === 'down') {
        current = current * (0.9 + Math.random() * 0.05);
      } else {
        current = current * (0.95 + Math.random() * 0.1);
      }
      data.push(current);
    }
    
    return data;
  };

  // Calcular predicciones para cada influencer
  const influencerPredictions = influencers.slice(0, 5).map(inf => {
    const historical = generateHistoricalData(inf.views, 'up');
    const { prediction, confidence } = predictGrowth(historical);
    const growthRate = ((prediction - inf.views) / inf.views) * 100;
    
    return {
      influencer: inf,
      currentViews: inf.views,
      predictedViews: Math.floor(prediction),
      growthRate: growthRate,
      confidence: confidence,
      trend: growthRate > 0 ? 'up' : 'down',
      riskLevel: confidence < 60 ? 'high' : confidence < 80 ? 'medium' : 'low'
    };
  });

  // Detectar influencers con crecimiento acelerado
  const risingStars = influencerPredictions
    .filter(pred => pred.growthRate > 15 && pred.confidence > 70)
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 3);

  // Detectar influencers que necesitan atención
  const needsAttention = influencerPredictions
    .filter(pred => pred.growthRate < 0 || pred.confidence < 60)
    .slice(0, 3);

  // Generar recomendaciones inteligentes
  const recommendations = [
    {
      id: 1,
      type: 'opportunity',
      priority: 'high',
      title: 'Oportunidad de Inversión Detectada',
      description: `${risingStars[0]?.influencer.name || 'Varios influencers'} muestra un crecimiento del ${risingStars[0]?.growthRate.toFixed(1)}% proyectado. Considera aumentar presupuesto.`,
      impact: 'Alto impacto potencial en ROI',
      confidence: risingStars[0]?.confidence || 85
    },
    {
      id: 2,
      type: 'optimization',
      priority: 'medium',
      title: 'Optimizar Estrategia Multi-Plataforma',
      description: 'Los influencers con presencia en Instagram y TikTok tienen 35% más engagement. Considera expandir a ambas plataformas.',
      impact: '+35% engagement promedio',
      confidence: 82
    },
    {
      id: 3,
      type: 'alert',
      priority: 'high',
      title: 'Rendimiento Decreciente Detectado',
      description: `${needsAttention.length} influencers muestran tendencias negativas. Revisa contenido y estrategia.`,
      impact: 'Prevenir pérdida de audiencia',
      confidence: 78
    },
    {
      id: 4,
      type: 'trend',
      priority: 'medium',
      title: 'Tendencia Emergente: Contenido de Video Corto',
      description: 'Videos de 15-30 segundos generan 42% más shares que contenido largo. Ajusta estrategia de contenido.',
      impact: '+42% en compartidos',
      confidence: 88
    }
  ];

  // Calcular métricas predictivas globales
  const totalPredictedGrowth = influencerPredictions.reduce(
    (sum, pred) => sum + pred.growthRate, 0
  ) / influencerPredictions.length;

  const avgConfidence = influencerPredictions.reduce(
    (sum, pred) => sum + pred.confidence, 0
  ) / influencerPredictions.length;

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <div className="bg-gradient-to-r from-[#6D37D5] to-[#8B5CF6] rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Brain className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl">Insights de Inteligencia Artificial</h2>
            <p className="text-white/80 text-sm">
              Análisis predictivo y recomendaciones basadas en machine learning
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="size-4" />
              <span className="text-sm text-white/80">Crecimiento Proyectado</span>
            </div>
            <div className="text-2xl">{totalPredictedGrowth > 0 ? '+' : ''}{totalPredictedGrowth.toFixed(1)}%</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Target className="size-4" />
              <span className="text-sm text-white/80">Nivel de Confianza</span>
            </div>
            <div className="text-2xl">{avgConfidence.toFixed(0)}%</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="size-4" />
              <span className="text-sm text-white/80">Modelos Activos</span>
            </div>
            <div className="text-2xl">4</div>
            <p className="text-xs text-white/60 mt-1">Regresión, Clustering, NLP, Anomalías</p>
          </div>
        </div>
      </div>

      {/* Predicciones Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rising Stars */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-5 text-yellow-500" />
            <h3 className="text-xl">Estrellas en Ascenso</h3>
            <Badge className="ml-auto bg-yellow-500">IA Detectado</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Influencers con mayor potencial de crecimiento según nuestro modelo predictivo
          </p>
          <div className="space-y-4">
            {risingStars.map((pred, index) => (
              <div key={pred.influencer.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{pred.influencer.name}</h4>
                      <ArrowUpRight className="size-4 text-green-600 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pred.influencer.platform}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Crecimiento: </span>
                        <span className="font-semibold text-green-700">+{pred.growthRate.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Confianza: </span>
                        <span className="font-semibold">{pred.confidence.toFixed(0)}%</span>
                      </div>
                    </div>
                    <Progress value={pred.confidence} className="h-2 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Needs Attention */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="size-5 text-orange-500" />
            <h3 className="text-xl">Requiere Atención</h3>
            <Badge className="ml-auto bg-orange-500">Alerta IA</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Influencers con tendencias descendentes o alto nivel de incertidumbre
          </p>
          <div className="space-y-4">
            {needsAttention.length > 0 ? needsAttention.map((pred, index) => (
              <div key={pred.influencer.id} className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{pred.influencer.name}</h4>
                      <ArrowDownRight className="size-4 text-orange-600 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pred.influencer.platform}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Cambio: </span>
                        <span className="font-semibold text-orange-700">
                          {pred.growthRate > 0 ? '+' : ''}{pred.growthRate.toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Riesgo: </span>
                        <span className="font-semibold capitalize">{pred.riskLevel === 'high' ? 'Alto' : pred.riskLevel === 'medium' ? 'Medio' : 'Bajo'}</span>
                      </div>
                    </div>
                    <Progress value={pred.confidence} className="h-2 mt-2" />
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="size-12 mx-auto mb-2 opacity-50" />
                <p>¡Excelente! Todos los influencers están en buen camino</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recomendaciones Inteligentes */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="size-5 text-[#6D37D5]" />
          <h3 className="text-xl">Recomendaciones Estratégicas</h3>
          <Badge className="ml-auto bg-[#6D37D5]">Impulsado por IA</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Acciones recomendadas basadas en análisis de patrones y tendencias del mercado
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  rec.type === 'opportunity' ? 'bg-green-100' :
                  rec.type === 'optimization' ? 'bg-blue-100' :
                  rec.type === 'alert' ? 'bg-red-100' :
                  'bg-purple-100'
                }`}>
                  {rec.type === 'opportunity' && <Zap className="size-4 text-green-700" />}
                  {rec.type === 'optimization' && <Target className="size-4 text-blue-700" />}
                  {rec.type === 'alert' && <AlertTriangle className="size-4 text-red-700" />}
                  {rec.type === 'trend' && <TrendingUp className="size-4 text-purple-700" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{rec.title}</h4>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        rec.priority === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {rec.priority === 'high' ? 'Alta' : 'Media'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{rec.impact}</span>
                    <span className="text-gray-400">Confianza: {rec.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabla de Predicciones Detalladas */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="size-5 text-[#6D37D5]" />
          <h3 className="text-xl">Predicciones Detalladas por Influencer</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">Influencer</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Plataforma</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Actual</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Predicción (30d)</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Crecimiento</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Confianza</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {influencerPredictions.map((pred) => (
                <tr key={pred.influencer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={pred.influencer.photo}
                        alt={pred.influencer.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-sm">{pred.influencer.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{pred.influencer.platform}</td>
                  <td className="py-3 px-4 text-right text-sm">
                    {(pred.currentViews / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-semibold">
                    {(pred.predictedViews / 1000000).toFixed(1)}M
                  </td>
                  <td className={`py-3 px-4 text-right text-sm font-semibold ${
                    pred.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {pred.growthRate > 0 ? '+' : ''}{pred.growthRate.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={pred.confidence} className="h-2 w-16" />
                      <span className="text-xs text-gray-600">{pred.confidence.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {pred.trend === 'up' ? (
                      <TrendingUp className="size-5 text-green-600 mx-auto" />
                    ) : (
                      <TrendingDown className="size-5 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
