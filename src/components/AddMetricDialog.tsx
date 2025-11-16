'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Instagram, Facebook, Youtube, TrendingUp } from 'lucide-react';

interface AddMetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMetric: (influencerId: string, metric: MetricData) => void;
  influencers: Array<{ id: string; name: string; photo: string }>;
  campaigns: string[];
}

export interface MetricData {
  socialMedia: string;
  campaignName: string;
  followers?: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export default function AddMetricDialog({ 
  open, 
  onOpenChange, 
  onAddMetric,
  influencers,
  campaigns
}: AddMetricDialogProps) {
  const [selectedInfluencer, setSelectedInfluencer] = useState('');
  const [formData, setFormData] = useState<MetricData>({
    socialMedia: '',
    campaignName: '',
    followers: undefined,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInfluencer) {
      return;
    }
    
    onAddMetric(selectedInfluencer, formData);
    
    setSelectedInfluencer('');
    setFormData({
      socialMedia: '',
      campaignName: '',
      followers: undefined,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    });
    onOpenChange(false);
  };

  const handleNumberChange = (field: keyof MetricData, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const getSocialMediaIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'Facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'YouTube':
        return <Youtube className="w-4 h-4 text-red-600" />;
      case 'TikTok':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const selectedInfluencerData = influencers.find(inf => inf.id === selectedInfluencer);

  const engagementRate = formData.views > 0 
    ? ((formData.likes + formData.comments + formData.shares) / formData.views * 100).toFixed(2)
    : '0.00';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Datos de Métrica</DialogTitle>
          <DialogDescription>
            Registra las métricas de rendimiento de campaña para un influencer
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="influencer">Seleccionar Influencer *</Label>
              <Select 
                value={selectedInfluencer} 
                onValueChange={setSelectedInfluencer}
                required
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Elegir un influencer">
                    {selectedInfluencerData && (
                      <div className="flex items-center gap-2">
                        <img
                          src={selectedInfluencerData.photo}
                          alt={selectedInfluencerData.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span>{selectedInfluencerData.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {influencers.length > 0 ? (
                    influencers.map(influencer => (
                      <SelectItem key={influencer.id} value={influencer.id}>
                        <div className="flex items-center gap-2">
                          <img
                            src={influencer.photo}
                            alt={influencer.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{influencer.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No hay influencers disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm text-gray-600">Información de Campaña</h3>
              
              <div className="space-y-2">
                <Label htmlFor="campaignName">Nombre de Campaña *</Label>
                <Select 
                  value={formData.campaignName} 
                  onValueChange={(value) => setFormData({ ...formData, campaignName: value })}
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Seleccionar nombre de campaña" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.length > 0 ? (
                      campaigns.map(campaign => (
                        <SelectItem key={campaign} value={campaign}>
                          {campaign}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No hay campañas disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Selecciona una campaña existente o crea una nueva primero
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialMedia">Red Social *</Label>
                <Select 
                  value={formData.socialMedia} 
                  onValueChange={(value) => setFormData({ ...formData, socialMedia: value })}
                  required
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Seleccionar red social">
                      {formData.socialMedia && (
                        <div className="flex items-center gap-2">
                          {getSocialMediaIcon(formData.socialMedia)}
                          <span>{formData.socialMedia}</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        Instagram
                      </div>
                    </SelectItem>
                    <SelectItem value="Facebook">
                      <div className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook
                      </div>
                    </SelectItem>
                    <SelectItem value="TikTok">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        TikTok
                      </div>
                    </SelectItem>
                    <SelectItem value="YouTube">
                      <div className="flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-600" />
                        YouTube
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm text-gray-600">Métricas de Rendimiento</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="followers">Seguidores (Opcional)</Label>
                  <Input
                    id="followers"
                    type="number"
                    min="0"
                    placeholder="Número actual de seguidores"
                    value={formData.followers || ''}
                    onChange={(e) => handleNumberChange('followers', e.target.value)}
                    className="h-11"
                  />
                  <p className="text-xs text-gray-500">
                    Cantidad de seguidores al momento de esta campaña
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="views">Vistas *</Label>
                  <Input
                    id="views"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.views || ''}
                    onChange={(e) => handleNumberChange('views', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="likes">Me Gusta *</Label>
                  <Input
                    id="likes"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.likes || ''}
                    onChange={(e) => handleNumberChange('likes', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Comentarios *</Label>
                  <Input
                    id="comments"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.comments || ''}
                    onChange={(e) => handleNumberChange('comments', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shares">Compartidos *</Label>
                  <Input
                    id="shares"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.shares || ''}
                    onChange={(e) => handleNumberChange('shares', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#6D37D5]/5 rounded-lg p-4 border border-[#6D37D5]/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#6D37D5]" />
                <h4 className="text-sm text-gray-700">Resumen de Métricas</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Vistas:</span>
                  <span className="ml-2 font-medium">{formData.views.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Me Gusta:</span>
                  <span className="ml-2 font-medium">{formData.likes.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Comentarios:</span>
                  <span className="ml-2 font-medium">{formData.comments.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Compartidos:</span>
                  <span className="ml-2 font-medium">{formData.shares.toLocaleString()}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-600">Engagement Rate:</span>
                  <span className="ml-2 font-medium text-[#6D37D5]">{engagementRate}%</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#6D37D5] hover:bg-[#5C2DB5] text-white"
              disabled={!selectedInfluencer}
            >
              Guardar Métrica
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
