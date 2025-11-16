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

interface AddInfluencerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddInfluencer: (influencer: InfluencerFormData) => void;
}

export interface InfluencerFormData {
  name: string;
  takeCode: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
  };
}

export default function AddInfluencerDialog({ open, onOpenChange, onAddInfluencer }: AddInfluencerDialogProps) {
  const [formData, setFormData] = useState<InfluencerFormData>({
    name: '',
    takeCode: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddInfluencer(formData);
    // Reset form
    setFormData({
      name: '',
      takeCode: '',
      socialMedia: {
        instagram: '',
        facebook: '',
        tiktok: '',
        youtube: '',
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Influencer</DialogTitle>
          <DialogDescription>
            Completa la información del influencer para agregarlo a la plataforma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-sm text-gray-600">Información Básica</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Influencer *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Juan Pérez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="takeCode">Código TAKE *</Label>
                <Input
                  id="takeCode"
                  placeholder="Ej: TAKE001"
                  value={formData.takeCode}
                  onChange={(e) => setFormData({ ...formData, takeCode: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm text-gray-600">Redes Sociales</h3>
              <p className="text-xs text-gray-500">Ingresa al menos un username de red social</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">@</span>
                    <Input
                      id="instagram"
                      placeholder="username"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                      })}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">@</span>
                    <Input
                      id="facebook"
                      placeholder="username"
                      value={formData.socialMedia.facebook}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                      })}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">@</span>
                    <Input
                      id="tiktok"
                      placeholder="username"
                      value={formData.socialMedia.tiktok}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, tiktok: e.target.value }
                      })}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">@</span>
                    <Input
                      id="youtube"
                      placeholder="username"
                      value={formData.socialMedia.youtube}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialMedia: { ...formData.socialMedia, youtube: e.target.value }
                      })}
                      className="h-11"
                    />
                  </div>
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
              Añadir Influencer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
