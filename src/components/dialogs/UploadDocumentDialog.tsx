import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStore } from '@/stores/appStore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, File } from 'lucide-react';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDocumentDialog({ open, onOpenChange }: UploadDocumentDialogProps) {
  const { t } = useLanguage();
  const { addDocument } = useAppStore();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: 'pdf',
  });

  const categories = [
    { value: 'contracts', label: t('documents.contracts') },
    { value: 'invoices', label: t('documents.invoices') },
    { value: 'reports', label: t('documents.reports') },
    { value: 'templates', label: t('documents.templates') },
    { value: 'policies', label: t('documents.policies') },
    { value: 'other', label: t('documents.other') },
  ];

  const fileTypes = [
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'Word (DOCX)' },
    { value: 'xlsx', label: 'Excel (XLSX)' },
    { value: 'jpg', label: 'Image (JPG)' },
    { value: 'png', label: 'Image (PNG)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addDocument({
      name: formData.name,
      category: formData.category,
      type: formData.type,
      size: Math.floor(Math.random() * 5000000) + 100000, // Random file size
      uploadedBy: user?.name || 'Unknown',
      uploadDate: new Date().toLocaleDateString('fr-FR'),
    });

    setFormData({
      name: '',
      category: '',
      type: 'pdf',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {t('documents.uploadDocument')}
          </DialogTitle>
          <DialogDescription>
            {t('documents.subtitle')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <File className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {t('common.upload')} - Cliquez ou glissez un fichier
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">{t('documents.fileName')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du document"
                className="bg-muted/50"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">{t('finance.category')}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder={t('finance.category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="gap-2">
              <Upload className="w-4 h-4" />
              {t('common.upload')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
