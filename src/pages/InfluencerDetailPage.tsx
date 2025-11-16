import { ArrowLeft, Download, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Influencer } from '../lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface InfluencerDetailPageProps {
  influencerId: string;
  onBack: () => void;
  influencers: Influencer[];
}

export default function InfluencerDetailPage({ influencerId, onBack, influencers }: InfluencerDetailPageProps) {
  const influencer = influencers.find(inf => inf.id === influencerId);

  if (!influencer) {
    return (
      <div className="p-8">
        <h1 className="text-2xl">Influencer not found</h1>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  const handleExportReport = (format: string) => {
    alert(`Exporting report as ${format}... (Demo)`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Influencers
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <img
              src={influencer.photo}
              alt={influencer.name}
              className="w-24 h-24 rounded-full object-cover shadow-lg"
            />
            <div>
              <h1 className="text-3xl mb-2">{influencer.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="px-3 py-1 bg-[#6D37D5] text-white rounded-full text-sm">
                  {influencer.platform}
                </span>
                <span>{influencer.name}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => handleExportReport('PDF')}
              variant="outline"
              className="border-[#6D37D5] text-[#6D37D5] hover:bg-[#6D37D5]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              onClick={() => handleExportReport('Excel')}
              className="bg-[#6D37D5] hover:bg-[#5C2DB5] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Followers</p>
            <Eye className="w-5 h-5 text-[#6D37D5]" />
          </div>
          <h3 className="text-2xl mb-1">{formatNumber(influencer.followers)}</h3>
          <p className="text-green-600 text-sm">↑ {influencer.growthRate}% growth</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Views</p>
            <TrendingUp className="w-5 h-5 text-[#6D37D5]" />
          </div>
          <h3 className="text-2xl mb-1">{formatNumber(influencer.views)}</h3>
          <p className="text-gray-500 text-sm">Last 30 days</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Engagement Rate</p>
            <Heart className="w-5 h-5 text-[#6D37D5]" />
          </div>
          <h3 className="text-2xl mb-1">{influencer.engagement}%</h3>
          <p className="text-gray-500 text-sm">Above average</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Avg Comments</p>
            <MessageCircle className="w-5 h-5 text-[#6D37D5]" />
          </div>
          <h3 className="text-2xl mb-1">
            {formatNumber(
              influencer.recentPosts.reduce((sum, post) => sum + post.comments, 0) / 
              influencer.recentPosts.length
            )}
          </h3>
          <p className="text-gray-500 text-sm">Per post</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Historical Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl mb-6">Growth Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={influencer.historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" yAxisId="left" tickFormatter={(value) => formatNumber(value)} />
              <YAxis stroke="#666" yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'engagement') return [`${value}%`, 'Engagement'];
                  return [formatNumber(value), name];
                }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="followers"
                stroke="#6D37D5"
                strokeWidth={2}
                name="Followers"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="views"
                stroke="#10b981"
                strokeWidth={2}
                name="Views"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="engagement"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Engagement %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Posts Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl mb-6">Recent Posts Performance</h2>
          <div className="space-y-4">
            {influencer.recentPosts.map((post) => (
              <div key={post.id} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm mb-3">{post.title}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Views</p>
                    <p className="">{formatNumber(post.views)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Likes</p>
                    <p className="">{formatNumber(post.likes)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Comments</p>
                    <p className="">{formatNumber(post.comments)}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-2">{new Date(post.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600 text-sm mb-2">Platform</p>
            <p className="">{influencer.platform}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-2">Growth Rate</p>
            <p className="text-green-600">↑ {influencer.growthRate}%</p>
          </div>
        </div>
      </div>

      {/* Campaign Data Section */}
      {influencer.campaignData && influencer.campaignData.length > 0 && (
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl mb-6">Datos de Campañas</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Red Social</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Vistas</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Likes</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Comentarios</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Compartidos</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {influencer.campaignData.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{campaign.campaignName}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="inline-block px-2 py-1 bg-[#6D37D5]/10 text-[#6D37D5] rounded text-xs">
                        {campaign.socialMedia}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{formatNumber(campaign.views)}</td>
                    <td className="py-3 px-4 text-sm">{formatNumber(campaign.likes)}</td>
                    <td className="py-3 px-4 text-sm">{formatNumber(campaign.comments)}</td>
                    <td className="py-3 px-4 text-sm">{formatNumber(campaign.shares)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(campaign.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}