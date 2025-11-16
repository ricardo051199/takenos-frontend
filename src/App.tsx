import { useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InfluencersPage from './pages/InfluencersPage';
import InfluencerDetailPage from './pages/InfluencerDetailPage';
import AutomationPage from './pages/AutomationPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { influencers as initialInfluencers, Influencer, CampaignDataEntry } from './lib/mockData';
import { InfluencerFormData } from './components/AddInfluencerDialog';
import { Campaign } from './components/AddCampaignDialog';
import { MetricData } from './components/AddMetricDialog';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setSelectedInfluencerId(null);
  };

  const handleViewInfluencerDetails = (id: string) => {
    setSelectedInfluencerId(id);
    setActivePage('influencer-detail');
  };

  const handleBackToInfluencers = () => {
    setActivePage('influencers');
    setSelectedInfluencerId(null);
  };

  const handleAddInfluencer = (data: InfluencerFormData) => {
    const newInfluencer: Influencer = {
      id: Date.now().toString(),
      name: data.name,
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      platform: data.socialMedia.instagram ? 'Instagram' : 
                data.socialMedia.tiktok ? 'TikTok' :
                data.socialMedia.youtube ? 'YouTube' : 'Facebook',
      followers: 0,
      views: 0,
      engagement: 0,
      category: 'General',
      growthRate: 0,
      takeCode: data.takeCode,
      socialMedia: data.socialMedia,
      campaignData: [],
      recentPosts: [],
      historicalData: [],
    };
    
    setInfluencers(prev => [...prev, newInfluencer]);
  };

  const handleAddCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [...prev, campaign]);
  };

  const handleAddMetric = (influencerId: string, data: MetricData) => {
    const campaignEntry: CampaignDataEntry = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString().split('T')[0],
    };

    setInfluencers(prev => prev.map(inf => {
      if (inf.id === influencerId) {
        const updatedCampaignData = [...(inf.campaignData || []), campaignEntry];
        
        const totalViews = updatedCampaignData.reduce((sum, campaign) => sum + campaign.views, 0);
        const totalLikes = updatedCampaignData.reduce((sum, campaign) => sum + campaign.likes, 0);
        const totalComments = updatedCampaignData.reduce((sum, campaign) => sum + campaign.comments, 0);
        const totalShares = updatedCampaignData.reduce((sum, campaign) => sum + campaign.shares, 0);
        
        const totalInteractions = totalLikes + totalComments + totalShares;
        const engagementRate = totalViews > 0 ? (totalInteractions / totalViews) * 100 : 0;
        
        const updatedFollowers = data.followers && data.followers > 0 ? data.followers : inf.followers;
        
        return {
          ...inf,
          followers: updatedFollowers,
          views: totalViews,
          engagement: parseFloat(engagementRate.toFixed(2)),
          campaignData: updatedCampaignData,
        };
      }
      return inf;
    }));
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render current page
  const renderPage = () => {
    if (activePage === 'influencer-detail' && selectedInfluencerId) {
      return (
        <InfluencerDetailPage
          influencerId={selectedInfluencerId}
          onBack={handleBackToInfluencers}
          influencers={influencers}
        />
      );
    }

    switch (activePage) {
      case 'dashboard':
        return <Dashboard influencers={influencers} />;
      case 'influencers':
        return (
          <InfluencersPage 
            onViewDetails={handleViewInfluencerDetails}
            influencers={influencers}
            onAddInfluencer={handleAddInfluencer}
            onAddCampaign={handleAddCampaign}
            onAddMetric={handleAddMetric}
            campaigns={campaigns}
          />
        );
      case 'automation':
        return <AutomationPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard influencers={influencers} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}