import { useState, useMemo } from 'react';
import { Search, Filter, Eye, Plus, BarChart3, Users, FolderKanban } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Influencer } from '../lib/mockData';
import AddInfluencerDialog, { InfluencerFormData } from '../components/AddInfluencerDialog';
import AddCampaignDialog, { Campaign } from '../components/AddCampaignDialog';
import AddMetricDialog, { MetricData } from '../components/AddMetricDialog';
import { toast } from 'sonner@2.0.3';

interface InfluencersPageProps {
  onViewDetails: (id: string) => void;
  influencers: Influencer[];
  onAddInfluencer: (data: InfluencerFormData) => void;
  onAddCampaign: (campaign: Campaign) => void;
  onAddMetric: (influencerId: string, data: MetricData) => void;
  campaigns: Campaign[];
}

export default function InfluencersPage({ 
  onViewDetails, 
  influencers,
  onAddInfluencer,
  onAddCampaign,
  onAddMetric,
  campaigns
}: InfluencersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [isAddInfluencerDialogOpen, setIsAddInfluencerDialogOpen] = useState(false);
  const [isAddCampaignDialogOpen, setIsAddCampaignDialogOpen] = useState(false);
  const [isAddMetricDialogOpen, setIsAddMetricDialogOpen] = useState(false);

  // Get all campaign names for the metric dialog
  const allCampaignNames = useMemo(() => {
    const names = new Set<string>();
    
    // Add campaigns from campaigns array
    campaigns.forEach(campaign => names.add(campaign.name));
    
    // Add campaigns from influencer data
    influencers.forEach(inf => {
      inf.campaignData?.forEach(campaign => {
        names.add(campaign.campaignName);
      });
    });
    
    return Array.from(names);
  }, [campaigns, influencers]);

  // Filter influencers
  const filteredInfluencers = influencers.filter(inf => {
    const matchesSearch = inf.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || inf.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const handleAddInfluencer = (data: InfluencerFormData) => {
    onAddInfluencer(data);
    toast.success(`Influencer "${data.name}" added successfully!`, {
      description: `TAKE Code: ${data.takeCode}`,
    });
  };

  const handleAddCampaign = (campaign: Campaign) => {
    onAddCampaign(campaign);
    toast.success(`Campaign "${campaign.name}" created successfully!`, {
      description: `Platform: ${campaign.platform}`,
    });
  };

  const handleAddMetric = (influencerId: string, data: MetricData) => {
    onAddMetric(influencerId, data);
    const influencer = influencers.find(inf => inf.id === influencerId);
    toast.success('Metric data saved successfully!', {
      description: `${data.campaignName} - ${influencer?.name}`,
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      Instagram: 'bg-pink-100 text-pink-700',
      YouTube: 'bg-red-100 text-red-700',
      TikTok: 'bg-gray-900 text-white',
      Facebook: 'bg-blue-100 text-blue-700',
    };
    return colors[platform] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-8">
      {/* Header with Action Buttons */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">Influencers</h1>
            <p className="text-gray-600">Gestiona y realiza el seguimiento de todos tus influencers</p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setIsAddInfluencerDialogOpen(true)}
            className="bg-[#6D37D5] hover:bg-[#5C2DB5] text-white h-11"
          >
            <Users className="w-4 h-4 mr-2" />
            Agregar Influencer
          </Button>
          <Button
            onClick={() => setIsAddCampaignDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white h-11"
          >
            <FolderKanban className="w-4 h-4 mr-2" />
            Agregar Campaña
          </Button>
          <Button
            onClick={() => setIsAddMetricDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white h-11"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Agregar Métrica
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>

          {/* Platform Filter */}
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Plataformas</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Mostrando {filteredInfluencers.length} de {influencers.length} influencers
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Influencer</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Plataforma</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Seguidores</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Vistas</th>
                <th className="text-left py-4 px-6 text-sm text-gray-600">Interacción</th>
                <th className="text-center py-4 px-6 text-sm text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInfluencers.map((influencer) => (
                <tr
                  key={influencer.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={influencer.photo}
                        alt={influencer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm">{influencer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getPlatformColor(influencer.platform)}`}>
                      {influencer.platform}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">{formatNumber(influencer.followers)}</td>
                  <td className="py-4 px-6 text-sm">{formatNumber(influencer.views)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[60px]">
                        <div
                          className="bg-[#6D37D5] h-2 rounded-full"
                          style={{ width: `${Math.min(influencer.engagement * 8, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm">{influencer.engagement}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      <Button
                        onClick={() => onViewDetails(influencer.id)}
                        variant="ghost"
                        size="sm"
                        className="text-[#6D37D5] hover:text-[#5C2DB5] hover:bg-[#6D37D5]/10"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Influencer Dialog */}
      <AddInfluencerDialog
        open={isAddInfluencerDialogOpen}
        onOpenChange={setIsAddInfluencerDialogOpen}
        onAddInfluencer={handleAddInfluencer}
      />

      {/* Add Campaign Dialog */}
      <AddCampaignDialog
        open={isAddCampaignDialogOpen}
        onOpenChange={setIsAddCampaignDialogOpen}
        onAddCampaign={handleAddCampaign}
      />

      {/* Add Metric Dialog */}
      <AddMetricDialog
        open={isAddMetricDialogOpen}
        onOpenChange={setIsAddMetricDialogOpen}
        onAddMetric={handleAddMetric}
        influencers={influencers.map(inf => ({ id: inf.id, name: inf.name, photo: inf.photo }))}
        campaigns={allCampaignNames}
      />
    </div>
  );
}