import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, FileImage, File } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    type: string;
    size: number;
    category: string;
    uploadedBy: string;
    uploadDate: string;
  } | null;
}

export function DocumentViewerDialog({ open, onOpenChange, document: doc }: DocumentViewerDialogProps) {
  const { t } = useLanguage();

  if (!doc) return null;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-16 h-16 text-destructive" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-16 h-16 text-success" />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <FileImage className="w-16 h-16 text-primary" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-16 h-16 text-info" />;
      default:
        return <File className="w-16 h-16 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'contracts': return t('documents.contracts');
      case 'invoices': return t('documents.invoices');
      case 'reports': return t('documents.reports');
      case 'templates': return t('documents.templates');
      case 'policies': return t('documents.policies');
      default: return t('documents.other');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-4">{doc.name}</DialogTitle>
          <DialogDescription>
            {getCategoryLabel(doc.category)} • {formatFileSize(doc.size)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg">
          {getFileIcon(doc.type)}
          <h3 className="text-lg font-semibold mt-4">{doc.name}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t('documentViewer.previewNotAvailable') || 'Aperçu non disponible'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {getCategoryLabel(doc.category)} • {formatFileSize(doc.size)}
          </p>
          <Button className="mt-6">
            <Download className="w-4 h-4 mr-2" />
            {t('common.download')}
          </Button>
        </div>

        <div className="pt-4 border-t border-border text-xs text-muted-foreground flex justify-between">
          <span>{t('documents.uploadedBy')}: {doc.uploadedBy}</span>
          <span>{doc.uploadDate}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
