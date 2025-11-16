import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine,
  ComposedChart,
  Bar,
  Scatter
} from 'recharts';
import { Brain, TrendingUp, Calendar } from 'lucide-react';
import { Influencer } from '../lib/mockData';

interface AIPredictionChartsProps {
  influencers: Influencer[];
}

export default function AIPredictionCharts({ influencers }: AIPredictionChartsProps) {
  // Generar datos históricos y predicciones
  const generateForecastData = () => {
    const data = [];
    const baseValue = influencers.reduce((sum, inf) => sum + inf.views, 0) / influencers.length;
    
    // Datos históricos (últimos 6 meses)
    const historicalMonths = ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'];
    historicalMonths.forEach((month, index) => {
      const growth = 1 + (index * 0.12);
      data.push({
        month,
        type: 'historical',
        actual: Math.floor(baseValue * growth * (0.9 + Math.random() * 0.2)),
        predicted: null,
        lowerBound: null,
        upperBound: null
      });
    });
    
    // Predicciones futuras (próximos 3 meses)
    const forecastMonths = ['Mar', 'Abr', 'May'];
    const lastValue = data[data.length - 1].actual;
    forecastMonths.forEach((month, index) => {
      const growthRate = 1.15; // 15% crecimiento proyectado
      const predicted = Math.floor(lastValue * Math.pow(growthRate, index + 1));
      const variance = predicted * 0.15; // 15% varianza
      
      data.push({
        month,
        type: 'forecast',
        actual: null,
        predicted: predicted,
        lowerBound: Math.floor(predicted - variance),
        upperBound: Math.floor(predicted + variance)
      });
    });
    
    return data;
  };

  // Datos de engagement proyectado vs real
  const generateEngagementForecast = () => {
    const months = ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'];
    return months.map((month, index) => {
      const isHistorical = index < 6;
      const baseEngagement = 3.5;
      const trend = baseEngagement + (index * 0.15);
      
      return {
        month,
        actual: isHistorical ? +(trend + (Math.random() - 0.5) * 0.5).toFixed(2) : null,
        predicted: !isHistorical ? +(trend + 0.3).toFixed(2) : null,
        target: 5.0 // Meta del 5% de engagement
      };
    });
  };

  // Análisis de correlación entre seguidores y engagement
  const generateCorrelationData = () => {
    return influencers.slice(0, 8).map(inf => ({
      name: inf.name.split(' ')[0],
      followers: inf.followers / 1000, // en miles
      engagement: inf.engagement,
      category: inf.category
    }));
  };

  // Proyección de ROI
  const generateROIForecast = () => {
    const quarters = ['Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'];
    return quarters.map((quarter, index) => {
      const isActual = index < 2;
      const baseROI = 2.5;
      const roi = baseROI + (index * 0.4);
      
      return {
        quarter,
        actualROI: isActual ? +(roi + (Math.random() - 0.5) * 0.3).toFixed(2) : null,
        predictedROI: !isActual ? +(roi + 0.5).toFixed(2) : null,
        investment: 10000 + (index * 5000),
        returns: Math.floor((10000 + (index * 5000)) * roi)
      };
    });
  };

  const forecastData = generateForecastData();
  const engagementData = generateEngagementForecast();
  const correlationData = generateCorrelationData();
  const roiData = generateROIForecast();

  // Estilo personalizado para tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toLocaleString()}
              {entry.name.includes('%') || entry.name.includes('Engagement') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Predicción de Vistas */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="size-5 text-[#6D37D5]" />
            <h3 className="text-xl">Predicción de Vistas (Próximos 3 Meses)</h3>
          </div>
          <Badge className="bg-[#6D37D5]">Modelo de Regresión Lineal</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Proyección basada en datos históricos con intervalo de confianza del 85%
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Área de confianza */}
            <Area
              type="monotone"
              dataKey="upperBound"
              fill="#6D37D5"
              fillOpacity={0.1}
              stroke="none"
              name="Límite Superior"
            />
            <Area
              type="monotone"
              dataKey="lowerBound"
              fill="#6D37D5"
              fillOpacity={0.1}
              stroke="none"
              name="Límite Inferior"
            />
            
            {/* Línea de datos reales */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#6D37D5"
              strokeWidth={3}
              dot={{ fill: '#6D37D5', r: 5 }}
              name="Datos Reales"
            />
            
            {/* Línea de predicción */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10B981"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#10B981', r: 5 }}
              name="Predicción IA"
            />
            
            {/* Línea de referencia */}
            <ReferenceLine
              x="Feb"
              stroke="#EF4444"
              strokeDasharray="3 3"
              label={{ value: 'Hoy', fill: '#EF4444', fontSize: 12 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predicción de Engagement */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-5 text-green-600" />
            <h3 className="text-lg">Proyección de Engagement Rate</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Comparación entre engagement actual y proyectado
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#6D37D5"
                fill="#6D37D5"
                fillOpacity={0.6}
                name="Engagement Real"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.4}
                strokeDasharray="5 5"
                name="Proyección"
              />
              
              <ReferenceLine
                y={5}
                stroke="#EF4444"
                strokeDasharray="3 3"
                label={{ value: 'Meta: 5%', fill: '#EF4444', fontSize: 11 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Análisis de Correlación */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="size-5 text-purple-600" />
            <h3 className="text-lg">Correlación: Seguidores vs Engagement</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Análisis de la relación entre audiencia y tasa de interacción
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="followers"
                stroke="#666"
                label={{ value: 'Seguidores (K)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                stroke="#666"
                tickFormatter={(value) => `${value}%`}
                label={{ value: 'Engagement %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Scatter
                dataKey="engagement"
                fill="#6D37D5"
                name="Influencers"
              />
              
              {/* Línea de tendencia simulada */}
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Tendencia"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-gray-700">
              <strong>Insight IA:</strong> Correlación negativa detectada (-0.42). Micro-influencers 
              (&lt;100K) tienen 23% más engagement que macro-influencers.
            </p>
          </div>
        </Card>
      </div>

      {/* Proyección de ROI */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="size-5 text-blue-600" />
          <h3 className="text-xl">Proyección de Retorno de Inversión (ROI)</h3>
          <Badge className="ml-auto bg-blue-600">Modelo Predictivo de ROI</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Análisis trimestral del retorno de inversión proyectado en campañas de influencers
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={roiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="quarter" stroke="#666" />
            <YAxis
              yAxisId="left"
              stroke="#666"
              label={{ value: 'ROI Multiplicador', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#10B981"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              label={{ value: 'Retornos ($)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar
              yAxisId="right"
              dataKey="investment"
              fill="#94A3B8"
              radius={[8, 8, 0, 0]}
              name="Inversión"
            />
            <Bar
              yAxisId="right"
              dataKey="returns"
              fill="#10B981"
              radius={[8, 8, 0, 0]}
              name="Retornos"
            />
            
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="actualROI"
              stroke="#6D37D5"
              strokeWidth={3}
              dot={{ fill: '#6D37D5', r: 5 }}
              name="ROI Real"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="predictedROI"
              stroke="#F59E0B"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#F59E0B', r: 5 }}
              name="ROI Proyectado"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">ROI Actual</p>
            <p className="text-2xl font-semibold text-green-700">2.9x</p>
            <p className="text-xs text-gray-500 mt-1">Por cada $1 invertido</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">ROI Proyectado (Q3 2025)</p>
            <p className="text-2xl font-semibold text-blue-700">4.1x</p>
            <p className="text-xs text-gray-500 mt-1">Incremento del 41%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Confianza del Modelo</p>
            <p className="text-2xl font-semibold text-purple-700">87%</p>
            <p className="text-xs text-gray-500 mt-1">Alta precisión predictiva</p>
          </div>
        </div>
      </Card>
    </div>
  );
}