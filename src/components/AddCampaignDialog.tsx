'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
import { Calendar } from 'lucide-react';

interface AddCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCampaign: (campaign: Campaign) => void;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
  platform: string;
}

export default function AddCampaignDialog({ 
  open, 
  onOpenChange, 
  onAddCampaign 
}: AddCampaignDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planned' as 'active' | 'completed' | 'planned',
    platform: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      ...formData,
    };
    
    onAddCampaign(newCampaign);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'planned',
      platform: '',
    });
    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'planned':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Campaign</DialogTitle>
          <DialogDescription>
            Create a new campaign to track influencer performance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Summer Launch 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-11"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the campaign goals and details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <Label htmlFor="platform">Primary Platform *</Label>
              <Select 
                value={formData.platform} 
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
                required
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Multi-Platform">Multi-Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'completed' | 'planned') => 
                  setFormData({ ...formData, status: value })
                }
                required
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor('planned')}`}>
                      Planned
                    </span>
                  </SelectItem>
                  <SelectItem value="active">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor('active')}`}>
                      Active
                    </span>
                  </SelectItem>
                  <SelectItem value="completed">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor('completed')}`}>
                      Completed
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            {formData.name && (
              <div className="bg-[#6D37D5]/5 rounded-lg p-4 border border-[#6D37D5]/20">
                <h4 className="text-sm mb-2 text-gray-700">Campaign Summary</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Platform:</span>
                    <span className="ml-2">{formData.platform || 'Not selected'}</span>
                  </div>
                  {formData.startDate && formData.endDate && (
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2">
                        {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6D37D5] hover:bg-[#5C2DB5] text-white"
            >
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
