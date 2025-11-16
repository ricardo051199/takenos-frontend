import { useState, useMemo } from 'react';
import { TrendingUp, Users, Eye, Award, Filter, Brain } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import AIInsights from '../components/AIInsights';
import AIPredictionCharts from '../components/AIPredictionCharts';
import { Influencer } from '../lib/mockData';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ComposedChart,
  Area,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface DashboardProps {
  influencers: Influencer[];
}

export default function Dashboard({ influencers }: DashboardProps) {
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');

  // Get unique campaigns across all influencers
  const allCampaigns = useMemo(() => {
    const campaigns = new Set<string>();
    influencers.forEach(inf => {
      inf.campaignData?.forEach(campaign => {
        campaigns.add(campaign.campaignName);
      });
    });
    return Array.from(campaigns);
  }, [influencers]);

  // Get unique platforms
  const allPlatforms = useMemo(() => {
    return Array.from(new Set(influencers.map(inf => inf.platform)));
  }, [influencers]);

  // Filter influencers based on selected filters
  const filteredInfluencers = useMemo(() => {
    return influencers.filter(inf => {
      // Filter by influencer
      if (selectedInfluencer !== 'all' && inf.id !== selectedInfluencer) {
        return false;
      }

      // Filter by platform
      if (selectedPlatform !== 'all' && inf.platform !== selectedPlatform) {
        return false;
      }

      // Filter by campaign (check if influencer has this campaign)
      if (selectedCampaign !== 'all') {
        const hasCampaign = inf.campaignData?.some(
          campaign => campaign.campaignName === selectedCampaign
        );
        if (!hasCampaign) {
          return false;
        }
      }

      return true;
    });
  }, [influencers, selectedInfluencer, selectedPlatform, selectedCampaign]);

  // Calculate metrics based on filtered data
  const metrics = useMemo(() => {
    let totalViews = 0;
    let totalEngagement = 0;
    let totalCampaigns = 0;
    const platformViews: Record<string, number> = {};
    const platformEngagement: Record<string, { total: number; count: number }> = {};

    filteredInfluencers.forEach(inf => {
      // If specific campaign is selected, only count that campaign's data
      if (selectedCampaign !== 'all') {
        const campaignData = inf.campaignData?.filter(
          c => c.campaignName === selectedCampaign
        );
        campaignData?.forEach(campaign => {
          totalViews += campaign.views;
          totalCampaigns++;
        });
      } else {
        // Count all data
        totalViews += inf.views;
        inf.campaignData?.forEach(campaign => {
          totalViews += campaign.views;
          totalCampaigns++;
        });
      }

      totalEngagement += inf.engagement;

      // Platform stats
      if (!platformViews[inf.platform]) {
        platformViews[inf.platform] = 0;
        platformEngagement[inf.platform] = { total: 0, count: 0 };
      }
      platformViews[inf.platform] += inf.views;
      platformEngagement[inf.platform].total += inf.engagement;
      platformEngagement[inf.platform].count += 1;
    });

    const avgEngagement = filteredInfluencers.length > 0
      ? totalEngagement / filteredInfluencers.length
      : 0;

    // Find best platform
    const bestPlatform = Object.entries(platformViews).reduce(
      (prev, current) => (current[1] > prev[1] ? current : prev),
      ['N/A', 0]
    );

    // Platform engagement data for chart
    const platformEngagementData = Object.entries(platformEngagement).map(
      ([platform, data]) => ({
        platform,
        engagement: data.count > 0 ? +(data.total / data.count).toFixed(1) : 0,
      })
    );

    return {
      totalViews,
      totalInfluencers: filteredInfluencers.length,
      totalCampaigns,
      avgEngagement,
      bestPlatform,
      platformEngagementData,
    };
  }, [filteredInfluencers, selectedCampaign]);

  // Top influencers from filtered data
  const topInfluencers = useMemo(() => {
    return [...filteredInfluencers]
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
  }, [filteredInfluencers]);

  const topInfluencer = topInfluencers[0];

  // Generate weekly views data based on filtered influencers
  const weeklyViewsData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const baseValue = metrics.totalViews / 7;
    
    return days.map((day, index) => ({
      day,
      views: Math.floor(baseValue * (0.8 + Math.random() * 0.4)),
    }));
  }, [metrics.totalViews]);

  // Influencer Comparison Data
  const influencerComparisonData = useMemo(() => {
    return filteredInfluencers.slice(0, 6).map(inf => {
      // Calculate total likes and shares from campaign data
      let totalLikes = 0;
      let totalShares = 0;
      let totalComments = 0;
      
      inf.campaignData?.forEach(campaign => {
        totalLikes += campaign.likes || 0;
        totalShares += campaign.shares || 0;
        totalComments += campaign.comments || 0;
      });

      return {
        name: inf.name.split(' ')[0], // Short name for better display
        views: inf.views,
        likes: totalLikes,
        shares: totalShares,
        comments: totalComments,
        followers: inf.followers,
        engagement: inf.engagement,
      };
    });
  }, [filteredInfluencers]);

  // Campaign Performance Data
  const campaignPerformanceData = useMemo(() => {
    const campaignStats: Record<string, { views: number; engagement: number; count: number }> = {};
    
    filteredInfluencers.forEach(inf => {
      inf.campaignData?.forEach(campaign => {
        if (!campaignStats[campaign.campaignName]) {
          campaignStats[campaign.campaignName] = { views: 0, engagement: 0, count: 0 };
        }
        campaignStats[campaign.campaignName].views += campaign.views;
        const engagementRate = ((campaign.likes + campaign.comments + campaign.shares) / campaign.views) * 100;
        campaignStats[campaign.campaignName].engagement += engagementRate;
        campaignStats[campaign.campaignName].count += 1;
      });
    });

    return Object.entries(campaignStats).map(([name, stats]) => ({
      campaign: name,
      views: stats.views,
      engagement: +(stats.engagement / stats.count).toFixed(2),
    }));
  }, [filteredInfluencers]);

  // Monthly Trends Data (last 6 months)
  const monthlyTrendsData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const baseViews = metrics.totalViews / 6;
    
    return months.map((month, index) => {
      const growth = 1 + (index * 0.15); // 15% growth per month
      return {
        month,
        views: Math.floor(baseViews * growth * (0.9 + Math.random() * 0.2)),
        engagement: +(metrics.avgEngagement * (0.85 + index * 0.03)).toFixed(1),
        influencers: Math.floor(metrics.totalInfluencers * (0.7 + index * 0.05)),
      };
    });
  }, [metrics.totalViews, metrics.avgEngagement, metrics.totalInfluencers]);

  // Platform Distribution Data
  const platformDistributionData = useMemo(() => {
    const platformCounts: Record<string, number> = {};
    
    filteredInfluencers.forEach(inf => {
      platformCounts[inf.platform] = (platformCounts[inf.platform] || 0) + 1;
    });

    const COLORS = ['#6D37D5', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

    return Object.entries(platformCounts).map(([platform, count], index) => ({
      name: platform,
      value: count,
      color: COLORS[index % COLORS.length],
    }));
  }, [filteredInfluencers]);

  // Influencers by Campaign Comparison
  const influencersByCampaignData = useMemo(() => {
    if (selectedCampaign === 'all') return [];

    const influencersInCampaign = filteredInfluencers
      .filter(inf => inf.campaignData?.some(c => c.campaignName === selectedCampaign))
      .map(inf => {
        const campaignData = inf.campaignData?.find(c => c.campaignName === selectedCampaign);
        return {
          name: inf.name.split(' ')[0],
          views: campaignData?.views || 0,
          likes: campaignData?.likes || 0,
          comments: campaignData?.comments || 0,
          shares: campaignData?.shares || 0,
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return influencersInCampaign;
  }, [filteredInfluencers, selectedCampaign]);

  const clearFilters = () => {
    setSelectedInfluencer('all');
    setSelectedPlatform('all');
    setSelectedCampaign('all');
  };

  const hasActiveFilters = selectedInfluencer !== 'all' || selectedPlatform !== 'all' || selectedCampaign !== 'all';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Panel de Análisis y rendimiento</h1>
        <p className="text-gray-600">Resumen del desempeño de tus influencers</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#6D37D5]" />
          <h2 className="text-lg">Filtros</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="ml-auto text-xs text-gray-600 hover:text-gray-900"
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Influencer Filter */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Influencer</label>
            <Select value={selectedInfluencer} onValueChange={setSelectedInfluencer}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Influencers</SelectItem>
                {influencers.map(inf => (
                  <SelectItem key={inf.id} value={inf.id}>
                    {inf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platform Filter */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Red Social</label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Redes</SelectItem>
                {allPlatforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campaign Filter */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Campaña</label>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Campañas</SelectItem>
                {allCampaigns.length > 0 ? (
                  allCampaigns.map(campaign => (
                    <SelectItem key={campaign} value={campaign}>
                      {campaign}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No hay campañas
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-600">Filtros activos:</span>
              {selectedInfluencer !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6D37D5]/10 text-[#6D37D5] rounded-full text-xs">
                  {influencers.find(inf => inf.id === selectedInfluencer)?.name}
                </span>
              )}
              {selectedPlatform !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6D37D5]/10 text-[#6D37D5] rounded-full text-xs">
                  {selectedPlatform}
                </span>
              )}
              {selectedCampaign !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#6D37D5]/10 text-[#6D37D5] rounded-full text-xs">
                  {selectedCampaign}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Vistas"
          value={metrics.totalViews > 0 ? `${(metrics.totalViews / 1000000).toFixed(1)}M` : '0'}
          icon={Eye}
          trend={{ value: 14.2, isPositive: true }}
        />
        <MetricCard
          title="Total Influencers"
          value={metrics.totalInfluencers}
          icon={Users}
          subtitle="Cuentas Activas"
        />
        <MetricCard
          title="Plataforma con Mejor Desempeño"
          value={metrics.bestPlatform[0]}
          subtitle={`${(metrics.bestPlatform[1] / 1000000).toFixed(0)}M vistas`}
          icon={Award}
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Promedio de Interacción"
          value={`${metrics.avgEngagement.toFixed(1)}%`}
          icon={TrendingUp}
          trend={{ value: 2.3, isPositive: true }}
        />
      </div>

      {/* Top Influencers Section */}
      {topInfluencer ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Influencer with Most Views */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl mb-4">Influencer con más Vistas</h2>
            <div className="flex items-center gap-4">
              <img
                src={topInfluencer.photo}
                alt={topInfluencer.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg mb-1">{topInfluencer.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{topInfluencer.platform} · {topInfluencer.category}</p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Vistas: </span>
                    <span className="">{(topInfluencer.views / 1000000).toFixed(1)}M</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Interacción: </span>
                    <span className="">{topInfluencer.engagement}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Influencers of the Week */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl mb-4">Top Influencers</h2>
            <div className="space-y-4">
              {topInfluencers.map((influencer, index) => (
                <div key={influencer.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6D37D5] text-white flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <img
                    src={influencer.photo}
                    alt={influencer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm">{influencer.name}</h4>
                    <p className="text-gray-600 text-xs">{influencer.platform}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{(influencer.views / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-gray-600">vistas</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 mb-8 text-center">
          <p className="text-gray-500">No hay datos disponibles con los filtros seleccionados</p>
          <Button
            onClick={clearFilters}
            className="mt-4 bg-[#6D37D5] hover:bg-[#5C2DB5] text-white"
          >
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl mb-6">Crecimiento de Vistas a lo Largo del Tiempo</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyViewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip
                formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M`, 'Vistas']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#6D37D5"
                strokeWidth={3}
                dot={{ fill: '#6D37D5', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Engagement Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl mb-6">Interacción por Plataforma</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.platformEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="platform" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(value) => `${value}%`} />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Interacción']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="engagement" fill="#6D37D5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Comparative Charts Section */}
      <div className="mt-8 mb-4">
        <h2 className="text-2xl mb-2">Análisis Comparativo</h2>
        <p className="text-gray-600 text-sm">Análisis profundo de comparaciones de rendimiento en diferentes dimensiones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Influencer Comparison Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl mb-6">Comparación de Influencers – Métricas de Interacción</h2>
          <p className="text-sm text-gray-500 mb-4">Comparación de Vistas, Me Gusta y Compartidos entre los principales influencers</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={influencerComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip
                formatter={(value: number) => `${(value / 1000000).toFixed(2)}M`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="views" fill="#6D37D5" radius={[8, 8, 0, 0]} name="Vistas" />
              <Bar dataKey="likes" fill="#10B981" radius={[8, 8, 0, 0]} name="Me Gustas" />
              <Bar dataKey="shares" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Compartidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign Performance Chart */}
        {campaignPerformanceData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl mb-6">Rendimiento de la Campaña</h2>
            <p className="text-sm text-gray-500 mb-4">Total de vistas e interacción en todas las campañas</p>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="campaign" stroke="#666" angle={-15} textAnchor="end" height={80} />
                <YAxis yAxisId="left" stroke="#666" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="views" fill="#6D37D5" radius={[8, 8, 0, 0]} name="Vistas" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagement"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 4 }}
                  name="Interacción %"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Trends & Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl mb-6">Tendencias de Rendimiento de los Últimos 6 Meses</h2>
          <p className="text-sm text-gray-500 mb-4">Tendencias históricas de crecimiento a lo largo del tiempo</p>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={monthlyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis yAxisId="left" stroke="#666" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" tickFormatter={(value) => `${value}%`} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="views"
                fill="#6D37D5"
                fillOpacity={0.3}
                stroke="#6D37D5"
                strokeWidth={2}
                name="Vistas"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="engagement"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
                name="Interacción %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution Chart */}
        {platformDistributionData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl mb-6">Distribución por Plataforma</h2>
            <p className="text-sm text-gray-500 mb-4">Número de influencers por plataforma</p>
            <ResponsiveContainer width="100%" height={320}>
              <RePieChart>
                <Pie
                  data={platformDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}`, 'Influencers']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Campaign-Specific Comparison */}
      {selectedCampaign !== 'all' && influencersByCampaignData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl mb-6">Rendimiento de Influencers en "{selectedCampaign}"</h2>
          <p className="text-sm text-gray-500 mb-4">Comparación de los principales influencers dentro de esta campaña</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={influencersByCampaignData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="views" fill="#6D37D5" radius={[0, 8, 8, 0]} name="Views" />
              <Bar dataKey="likes" fill="#10B981" radius={[0, 8, 8, 0]} name="Likes" />
              <Bar dataKey="comments" fill="#F59E0B" radius={[0, 8, 8, 0]} name="Comments" />
              <Bar dataKey="shares" fill="#EF4444" radius={[0, 8, 8, 0]} name="Shares" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI Insights and Predictions Section */}
      <div className="mt-8 mb-4">
        <div className="flex items-center gap-2">
          <Brain className="size-6 text-[#6D37D5]" />
          <h2 className="text-2xl mb-2">Análisis Predictivo con Inteligencia Artificial</h2>
        </div>
        <p className="text-gray-600 text-sm">
          Predicciones y tendencias generadas mediante algoritmos de machine learning
        </p>
      </div>

      {/* Tab View for AI Features */}
      <Tabs defaultValue="insights" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
          <TabsTrigger value="predictions">Predicciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-6">
          <AIInsights influencers={filteredInfluencers} />
        </TabsContent>
        
        <TabsContent value="predictions" className="mt-6">
          <AIPredictionCharts influencers={filteredInfluencers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}