import { useState, useRef } from 'react';
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
import { Upload, File, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDocumentDialog({ open, onOpenChange }: UploadDocumentDialogProps) {
  const { t } = useLanguage();
  const { addDocument } = useAppStore();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
  });

  const categories = [
    { value: 'contracts', label: t('documents.contracts') },
    { value: 'invoices', label: t('documents.invoices') },
    { value: 'reports', label: t('documents.reports') },
    { value: 'templates', label: t('documents.templates') },
    { value: 'policies', label: t('documents.policies') },
    { value: 'other', label: t('documents.other') },
  ];

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
      pdf: 'pdf',
      doc: 'docx',
      docx: 'docx',
      xls: 'xlsx',
      xlsx: 'xlsx',
      jpg: 'jpg',
      jpeg: 'jpg',
      png: 'png',
      gif: 'png',
    };
    return typeMap[extension] || 'other';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill name from file name if empty
      if (!formData.name) {
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({ ...prev, name: nameWithoutExtension }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.name) {
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({ ...prev, name: nameWithoutExtension }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error(t('documents.pleaseSelectFile'));
      return;
    }

    if (!formData.category) {
      toast.error(t('common.fillRequired'));
      return;
    }
    
    addDocument({
      name: formData.name || selectedFile.name,
      category: formData.category,
      type: getFileType(selectedFile.name),
      size: selectedFile.size,
      uploadedBy: user?.name || 'Unknown',
      uploadDate: new Date().toLocaleDateString('fr-FR'),
    });

    toast.success(t('documents.documentUploaded'));

    // Reset form
    setSelectedFile(null);
    setFormData({
      name: '',
      category: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFormData({ name: '', category: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                selectedFile 
                  ? 'border-success bg-success/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }`}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                  <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <>
                  <File className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-foreground font-medium">
                    {t('documents.dragOrClickToUpload')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('documents.supportedFormats')}
                  </p>
                </>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">{t('documents.fileName')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('documents.fileName')}
                className="bg-muted/50"
              />
            </div>
            
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="gap-2" disabled={!selectedFile}>
              <Upload className="w-4 h-4" />
              {t('common.upload')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
