import { useState, useMemo } from 'react';
import { Download, FileText, Calendar, TrendingUp, Users, BarChart2, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
} from 'recharts';
import { influencers } from '../lib/mockData';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'influencer' | 'metric' | 'platform'>('influencer');
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('views');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [startDate, setStartDate] = useState('2024-10-01');
  const [endDate, setEndDate] = useState('2024-11-16');
  const [showReport, setShowReport] = useState(false);

  // Get unique platforms
  const platforms = useMemo(() => {
    return Array.from(new Set(influencers.map(inf => inf.platform)));
  }, []);

  // ============= REPORT DATA CALCULATIONS =============

  // Influencer Report Data
  const influencerReportData = useMemo(() => {
    if (reportType !== 'influencer' || !showReport) return null;

    const selectedInf = influencers.find(inf => inf.id === selectedInfluencer);
    if (!selectedInf) return null;

    // Calculate total metrics from campaigns
    let totalCampaignViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;

    selectedInf.campaignData?.forEach(campaign => {
      totalCampaignViews += campaign.views;
      totalLikes += campaign.likes;
      totalComments += campaign.comments;
      totalShares += campaign.shares;
    });

    // Platform-specific data if available
    const platformData = selectedInf.campaignData?.reduce((acc, campaign) => {
      const platform = campaign.socialMedia;
      if (!acc[platform]) {
        acc[platform] = { views: 0, likes: 0, engagement: 0, campaigns: 0 };
      }
      acc[platform].views += campaign.views;
      acc[platform].likes += campaign.likes;
      acc[platform].campaigns += 1;
      acc[platform].engagement += ((campaign.likes + campaign.comments + campaign.shares) / campaign.views) * 100;
      return acc;
    }, {} as Record<string, any>);

    // Format for chart
    const platformChartData = platformData ? Object.entries(platformData).map(([platform, data]) => ({
      platform,
      views: data.views,
      engagement: +(data.engagement / data.campaigns).toFixed(2),
    })) : [];

    return {
      influencer: selectedInf,
      totalViews: selectedInf.views + totalCampaignViews,
      totalLikes,
      totalComments,
      totalShares,
      totalEngagement: selectedInf.engagement,
      followers: selectedInf.followers,
      growthRate: selectedInf.growthRate,
      campaigns: selectedInf.campaignData?.length || 0,
      platformData: platformChartData,
      historicalData: selectedInf.historicalData,
      recentPosts: selectedInf.recentPosts,
    };
  }, [reportType, selectedInfluencer, showReport]);

  // Metric Report Data
  const metricReportData = useMemo(() => {
    if (reportType !== 'metric' || !showReport) return null;

    const filteredInfluencers = selectedPlatform === 'all' 
      ? influencers 
      : influencers.filter(inf => inf.platform === selectedPlatform);

    // Calculate metric comparison across influencers
    const metricData = filteredInfluencers.map(inf => {
      let metricValue = 0;
      let totalLikes = 0;
      let totalComments = 0;
      let totalShares = 0;

      inf.campaignData?.forEach(campaign => {
        totalLikes += campaign.likes;
        totalComments += campaign.comments;
        totalShares += campaign.shares;
      });

      switch (selectedMetric) {
        case 'views':
          metricValue = inf.views;
          break;
        case 'engagement':
          metricValue = inf.engagement;
          break;
        case 'followers':
          metricValue = inf.followers;
          break;
        case 'likes':
          metricValue = totalLikes;
          break;
        case 'comments':
          metricValue = totalComments;
          break;
        case 'shares':
          metricValue = totalShares;
          break;
      }

      return {
        name: inf.name.split(' ')[0],
        value: metricValue,
        platform: inf.platform,
      };
    }).sort((a, b) => b.value - a.value);

    // Calculate totals and averages
    const totalValue = metricData.reduce((sum, item) => sum + item.value, 0);
    const avgValue = metricData.length > 0 ? totalValue / metricData.length : 0;
    const topPerformer = metricData[0];
    const bottomPerformer = metricData[metricData.length - 1];

    return {
      metricName: selectedMetric,
      data: metricData.slice(0, 10), // Top 10
      totalValue,
      avgValue,
      topPerformer,
      bottomPerformer,
      totalInfluencers: filteredInfluencers.length,
    };
  }, [reportType, selectedMetric, selectedPlatform, showReport]);

  // Platform Report Data
  const platformReportData = useMemo(() => {
    if (reportType !== 'platform' || !showReport) return null;

    const platformStats: Record<string, any> = {};

    influencers.forEach(inf => {
      if (!platformStats[inf.platform]) {
        platformStats[inf.platform] = {
          totalViews: 0,
          totalEngagement: 0,
          totalFollowers: 0,
          influencerCount: 0,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
        };
      }

      platformStats[inf.platform].totalViews += inf.views;
      platformStats[inf.platform].totalEngagement += inf.engagement;
      platformStats[inf.platform].totalFollowers += inf.followers;
      platformStats[inf.platform].influencerCount += 1;

      inf.campaignData?.forEach(campaign => {
        platformStats[inf.platform].totalLikes += campaign.likes;
        platformStats[inf.platform].totalComments += campaign.comments;
        platformStats[inf.platform].totalShares += campaign.shares;
      });
    });

    // Format for charts
    const comparisonData = Object.entries(platformStats).map(([platform, stats]) => ({
      platform,
      avgViews: Math.floor(stats.totalViews / stats.influencerCount),
      avgEngagement: +(stats.totalEngagement / stats.influencerCount).toFixed(2),
      totalFollowers: stats.totalFollowers,
      influencers: stats.influencerCount,
      totalLikes: stats.totalLikes,
      totalComments: stats.totalComments,
      totalShares: stats.totalShares,
    }));

    const COLORS = ['#6D37D5', '#10B981', '#F59E0B', '#3B82F6'];

    const distributionData = Object.entries(platformStats).map(([platform, stats], index) => ({
      name: platform,
      value: stats.influencerCount,
      color: COLORS[index % COLORS.length],
    }));

    return {
      comparisonData,
      distributionData,
      platformStats,
    };
  }, [reportType, showReport]);

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const handleDownloadReport = (format: 'PDF' | 'Excel') => {
    alert(`Descargando reporte en formato ${format}... (Demo)`);
  };

  const getMetricLabel = (metric: string) => {
    const labels: Record<string, string> = {
      views: 'Vistas',
      engagement: 'Tasa de Engagement',
      followers: 'Seguidores',
      likes: 'Me Gusta',
      comments: 'Comentarios',
      shares: 'Compartidos',
    };
    return labels[metric] || metric;
  };

  const formatMetricValue = (value: number, metric: string) => {
    if (metric === 'engagement') return `${value.toFixed(2)}%`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Reportes</h1>
        <p className="text-gray-600">Genera reportes detallados para análisis rápido y toma de decisiones</p>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl mb-4">Tipo de Reporte</h2>
        <Tabs value={reportType} onValueChange={(value: any) => {
          setReportType(value);
          setShowReport(false);
        }}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="influencer">Por Influencer</TabsTrigger>
            <TabsTrigger value="metric">Por Métrica</TabsTrigger>
            <TabsTrigger value="platform">Por Red Social</TabsTrigger>
          </TabsList>

          {/* INFLUENCER REPORT CONFIG */}
          <TabsContent value="influencer" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Seleccionar Influencer</Label>
                <Select value={selectedInfluencer} onValueChange={setSelectedInfluencer}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Seleccionar influencer" />
                  </SelectTrigger>
                  <SelectContent>
                    {influencers.map(inf => (
                      <SelectItem key={inf.id} value={inf.id}>
                        {inf.name} - {inf.platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inf-start-date">Período</Label>
                <div className="flex gap-2">
                  <Input
                    id="inf-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11"
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Reporte Individual de Desempeño:</strong> Obtén un resumen completo del desempeño del influencer incluyendo métricas principales, tendencias históricas, y análisis por plataforma.
              </p>
            </div>
          </TabsContent>

          {/* METRIC REPORT CONFIG */}
          <TabsContent value="metric" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Métrica a Analizar</Label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="views">Vistas</SelectItem>
                    <SelectItem value="engagement">Tasa de Engagement</SelectItem>
                    <SelectItem value="followers">Seguidores</SelectItem>
                    <SelectItem value="likes">Me Gusta</SelectItem>
                    <SelectItem value="comments">Comentarios</SelectItem>
                    <SelectItem value="shares">Compartidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filtrar por Plataforma</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Plataformas</SelectItem>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metric-start-date">Período</Label>
                <div className="flex gap-2">
                  <Input
                    id="metric-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-800">
                <strong>Análisis Comparativo por Métrica:</strong> Compara el rendimiento de todos los influencers en una métrica específica para identificar top performers y áreas de oportunidad.
              </p>
            </div>
          </TabsContent>

          {/* PLATFORM REPORT CONFIG */}
          <TabsContent value="platform" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform-start-date">Período de Análisis</Label>
                <div className="flex gap-2">
                  <Input
                    id="platform-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-11"
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-purple-800">
                <strong>Análisis Comparativo entre Plataformas:</strong> Compara el rendimiento entre Instagram, YouTube, TikTok y Facebook para identificar las mejores plataformas y optimizar tu estrategia.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Generate Button */}
        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
          <Button
            onClick={handleGenerateReport}
            className="bg-[#6D37D5] hover:bg-[#5C2DB5] text-white"
            disabled={
              (reportType === 'influencer' && selectedInfluencer === 'all') ||
              !reportType
            }
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Generar Reporte
          </Button>
          
          {showReport && (
            <>
              <Button
                onClick={() => handleDownloadReport('PDF')}
                variant="outline"
                className="border-[#6D37D5] text-[#6D37D5] hover:bg-[#6D37D5]/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
              <Button
                onClick={() => handleDownloadReport('Excel')}
                variant="outline"
                className="border-[#6D37D5] text-[#6D37D5] hover:bg-[#6D37D5]/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Excel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* REPORT RESULTS */}
      {showReport && (
        <div className="space-y-6">
          {/* INFLUENCER REPORT */}
          {reportType === 'influencer' && influencerReportData && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-[#6D37D5] to-[#5C2DB5] rounded-xl p-8 text-white">
                <div className="flex items-center gap-6 mb-6">
                  <img
                    src={influencerReportData.influencer.photo}
                    alt={influencerReportData.influencer.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                  <div>
                    <h2 className="text-3xl mb-2">{influencerReportData.influencer.name}</h2>
                    <p className="text-white/90 mb-1">
                      {influencerReportData.influencer.platform} · {influencerReportData.influencer.category}
                    </p>
                    <p className="text-sm text-white/80">
                      Período: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <Eye className="w-5 h-5 text-[#6D37D5]" />
                  </div>
                  <h3 className="text-2xl mb-1">{formatMetricValue(influencerReportData.totalViews, 'views')}</h3>
                  <p className="text-sm text-gray-600">Total Vistas</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <h3 className="text-2xl mb-1">{formatMetricValue(influencerReportData.followers, 'followers')}</h3>
                  <p className="text-sm text-gray-600">Seguidores</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
                  </div>
                  <h3 className="text-2xl mb-1">{influencerReportData.totalEngagement.toFixed(1)}%</h3>
                  <p className="text-sm text-gray-600">Tasa de Engagement</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart2 className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <h3 className="text-2xl mb-1">{influencerReportData.campaigns}</h3>
                  <p className="text-sm text-gray-600">Campañas Activas</p>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl mb-6">Métricas de Engagement</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl mb-1">{formatMetricValue(influencerReportData.totalLikes, 'likes')}</p>
                    <p className="text-sm text-gray-600">Total Me Gusta</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl mb-1">{formatMetricValue(influencerReportData.totalComments, 'comments')}</p>
                    <p className="text-sm text-gray-600">Total Comentarios</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Share2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl mb-1">{formatMetricValue(influencerReportData.totalShares, 'shares')}</p>
                    <p className="text-sm text-gray-600">Total Compartidos</p>
                  </div>
                </div>
              </div>

              {/* Platform Performance */}
              {influencerReportData.platformData.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl mb-6">Rendimiento por Plataforma</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={influencerReportData.platformData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="platform" />
                      <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="views" fill="#6D37D5" name="Views" />
                      <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={3} name="Engagement %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Historical Trends */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl mb-6">Tendencia Histórica (Últimos 6 Meses)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={influencerReportData.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="followers" stroke="#6D37D5" strokeWidth={2} name="Followers" />
                    <Line yAxisId="left" type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} name="Views" />
                    <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#F59E0B" strokeWidth={2} name="Engagement %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Posts Performance */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl mb-6">Top 5 Posts Recientes</h3>
                <div className="space-y-3">
                  {influencerReportData.recentPosts.slice(0, 5).map((post, index) => (
                    <div key={post.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-[#6D37D5] text-white flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{post.title}</h4>
                        <p className="text-xs text-gray-600">{new Date(post.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div className="text-center">
                          <p className="">{formatMetricValue(post.views, 'views')}</p>
                          <p className="text-xs text-gray-600">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="">{formatMetricValue(post.likes, 'likes')}</p>
                          <p className="text-xs text-gray-600">Likes</p>
                        </div>
                        <div className="text-center">
                          <p className="">{formatMetricValue(post.comments, 'comments')}</p>
                          <p className="text-xs text-gray-600">Comments</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* METRIC REPORT */}
          {reportType === 'metric' && metricReportData && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl p-8 text-white">
                <h2 className="text-3xl mb-2">Análisis Comparativo: {getMetricLabel(metricReportData.metricName)}</h2>
                <p className="text-white/90">
                  Comparación de {metricReportData.totalInfluencers} influencers
                  {selectedPlatform !== 'all' && ` en ${selectedPlatform}`}
                </p>
                <p className="text-sm text-white/80 mt-1">
                  Período: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Total Acumulado</p>
                  <h3 className="text-3xl text-[#6D37D5]">
                    {formatMetricValue(metricReportData.totalValue, metricReportData.metricName)}
                  </h3>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Promedio</p>
                  <h3 className="text-3xl text-[#10B981]">
                    {formatMetricValue(metricReportData.avgValue, metricReportData.metricName)}
                  </h3>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Top Performer</p>
                  <h3 className="text-lg mb-1">{metricReportData.topPerformer.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatMetricValue(metricReportData.topPerformer.value, metricReportData.metricName)}
                  </p>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl mb-6">Top 10 Influencers - {getMetricLabel(metricReportData.metricName)}</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={metricReportData.data} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => formatMetricValue(value, metricReportData.metricName)}
                    />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip
                      formatter={(value: number) => formatMetricValue(value, metricReportData.metricName)}
                    />
                    <Bar dataKey="value" fill="#6D37D5" radius={[0, 8, 8, 0]} name={getMetricLabel(metricReportData.metricName)} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Table */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl mb-6">Ranking Detallado</h3>
                <div className="space-y-2">
                  {metricReportData.data.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#6D37D5] text-white flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg">
                          {formatMetricValue(item.value, metricReportData.metricName)}
                        </p>
                        <p className="text-xs text-gray-600">{getMetricLabel(metricReportData.metricName)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* PLATFORM REPORT */}
          {reportType === 'platform' && platformReportData && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-xl p-8 text-white">
                <h2 className="text-3xl mb-2">Análisis Comparativo entre Plataformas</h2>
                <p className="text-white/90">
                  Comparación de rendimiento en {platformReportData.distributionData.length} plataformas
                </p>
                <p className="text-sm text-white/80 mt-1">
                  Período: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Platform Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl mb-6">Distribución de Influencers</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={platformReportData.distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {platformReportData.distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl mb-6">Promedio de Views por Plataforma</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={platformReportData.comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="platform" />
                      <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip
                        formatter={(value: number) => `${(value / 1000000).toFixed(2)}M`}
                      />
                      <Bar dataKey="avgViews" fill="#6D37D5" radius={[8, 8, 0, 0]} name="Avg Views" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comprehensive Comparison */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl mb-6">Comparación Completa de Métricas</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={platformReportData.comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="platform" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="avgViews" fill="#6D37D5" name="Avg Views" />
                    <Line yAxisId="right" type="monotone" dataKey="avgEngagement" stroke="#10B981" strokeWidth={3} name="Avg Engagement %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Metrics by Platform */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl mb-6">Métricas de Engagement por Plataforma</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={platformReportData.comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="platform" />
                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip
                      formatter={(value: number) => `${(value / 1000000).toFixed(2)}M`}
                    />
                    <Legend />
                    <Bar dataKey="totalLikes" fill="#EF4444" name="Likes" />
                    <Bar dataKey="totalComments" fill="#F59E0B" name="Comments" />
                    <Bar dataKey="totalShares" fill="#10B981" name="Shares" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Platform Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl mb-6">Estadísticas Detalladas por Plataforma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {platformReportData.comparisonData.map((platform) => (
                    <div key={platform.platform} className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg mb-4 text-[#6D37D5]">{platform.platform}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Influencers:</span>
                          <span className="">{platform.influencers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Views:</span>
                          <span className="">{formatMetricValue(platform.avgViews, 'views')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Avg Engagement:</span>
                          <span className="">{platform.avgEngagement}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Followers:</span>
                          <span className="">{formatMetricValue(platform.totalFollowers, 'followers')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Likes:</span>
                          <span className="">{formatMetricValue(platform.totalLikes, 'likes')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* No Report Message */}
      {!showReport && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-gray-900 mb-2">Selecciona un tipo de reporte</h3>
          <p className="text-gray-600 mb-6">
            Configura los parámetros arriba y haz clic en "Generar Reporte" para visualizar los resultados
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="mb-2 text-[#6D37D5]">Por Influencer</h4>
              <p className="text-sm text-gray-600">Análisis individual completo con métricas, tendencias y posts recientes</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="mb-2 text-[#10B981]">Por Métrica</h4>
              <p className="text-sm text-gray-600">Comparación de todos los influencers en una métrica específica</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="mb-2 text-[#F59E0B]">Por Red Social</h4>
              <p className="text-sm text-gray-600">Análisis comparativo completo entre todas las plataformas</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}