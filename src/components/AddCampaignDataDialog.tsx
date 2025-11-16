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
import { Instagram, Facebook, Youtube } from 'lucide-react';

interface AddCampaignDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddData: (campaignData: CampaignData) => void;
  influencerName: string;
}

export interface CampaignData {
  socialMedia: string;
  campaignName: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export default function AddCampaignDataDialog({ 
  open, 
  onOpenChange, 
  onAddData,
  influencerName 
}: AddCampaignDataDialogProps) {
  const [formData, setFormData] = useState<CampaignData>({
    socialMedia: '',
    campaignName: '',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddData(formData);
    setFormData({
      socialMedia: '',
      campaignName: '',
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    });
    onOpenChange(false);
  };

  const handleNumberChange = (field: keyof CampaignData, value: string) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Datos de Campaña</DialogTitle>
          <DialogDescription>
            Añadir datos de rendimiento de campaña para {influencerName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-sm text-gray-600">Información de Campaña</h3>
              
              <div className="space-y-2">
                <Label htmlFor="campaignName">Nombre de Campaña *</Label>
                <Input
                  id="campaignName"
                  placeholder="Ej: Campaña Verano 2024"
                  value={formData.campaignName}
                  onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                  required
                  className="h-11"
                />
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
              <h4 className="text-sm mb-3 text-gray-700">Resumen de Métricas</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Vistas:</span>
                  <span className="ml-2">{formData.views.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Me Gusta:</span>
                  <span className="ml-2">{formData.likes.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Comentarios:</span>
                  <span className="ml-2">{formData.comments.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Compartidos:</span>
                  <span className="ml-2">{formData.shares.toLocaleString()}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-600">Engagement Rate:</span>
                  <span className="ml-2 text-[#6D37D5]">
                    {formData.views > 0 
                      ? ((formData.likes + formData.comments + formData.shares) / formData.views * 100).toFixed(2)
                      : '0.00'}%
                  </span>
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
            >
              Guardar Datos
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
