import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, FileImage, File, Maximize2, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

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
    content?: string;
    url?: string;
  } | null;
}

// Sample document URLs for demonstration
const sampleDocumentUrls: Record<string, string> = {
  'pdf': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  'docx': 'https://calibre-ebook.com/downloads/demos/demo.docx',
  'xlsx': 'https://go.microsoft.com/fwlink/?LinkID=521962',
};

export function DocumentViewerDialog({ open, onOpenChange, document: doc }: DocumentViewerDialogProps) {
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!doc) return null;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-destructive" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-6 h-6 text-success" />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <FileImage className="w-6 h-6 text-primary" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-6 h-6 text-blue-500" />;
      default:
        return <File className="w-6 h-6 text-muted-foreground" />;
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contracts': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'invoices': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'reports': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'templates': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case 'policies': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Check if document type can be previewed
  const canPreview = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'].includes(doc.type.toLowerCase());
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(doc.type.toLowerCase());
  const isPdf = doc.type.toLowerCase() === 'pdf';
  const isOfficeDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(doc.type.toLowerCase());

  // Get preview URL - use actual URL if provided, otherwise sample
  const getPreviewUrl = () => {
    if (doc.url) return doc.url;
    
    // For demo, use sample documents
    if (isPdf) return sampleDocumentUrls.pdf;
    if (isOfficeDoc) {
      // Use Google Docs Viewer for Office documents
      const sampleUrl = doc.type.includes('xls') ? sampleDocumentUrls.xlsx : sampleDocumentUrls.docx;
      return `https://docs.google.com/viewer?url=${encodeURIComponent(sampleUrl)}&embedded=true`;
    }
    return null;
  };

  const previewUrl = getPreviewUrl();

  const handleDownload = () => {
    if (previewUrl && !previewUrl.includes('docs.google.com')) {
      window.open(previewUrl, '_blank');
    }
  };

  const handleOpenExternal = () => {
    if (previewUrl) {
      const url = previewUrl.includes('docs.google.com') 
        ? previewUrl.replace('&embedded=true', '')
        : previewUrl;
      window.open(url, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] h-[95vh]' : 'max-w-5xl h-[85vh]'} flex flex-col p-0`}>
        {/* Header */}
        <DialogHeader className="flex-shrink-0 p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(doc.type)}
              <div>
                <DialogTitle className="text-base">{doc.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className={getCategoryColor(doc.category)}>
                    {getCategoryLabel(doc.category)}
                  </Badge>
                  <span className="text-xs">•</span>
                  <span className="text-xs">{formatFileSize(doc.size)}</span>
                  <span className="text-xs">•</span>
                  <span className="text-xs">{doc.type.toUpperCase()}</span>
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenExternal}
                title={t('documentViewer.openExternal')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        {/* Document Viewer */}
        <div className="flex-1 bg-muted/30 overflow-hidden">
          {isPdf && previewUrl && (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title={doc.name}
            />
          )}
          
          {isImage && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img 
                src={doc.url || '/placeholder.svg'} 
                alt={doc.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          )}
          
          {isOfficeDoc && previewUrl && (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title={doc.name}
            />
          )}
          
          {!canPreview && !isOfficeDoc && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
              {getFileIcon(doc.type)}
              <p className="mt-4 text-lg font-medium text-foreground">{doc.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('documentViewer.previewNotAvailable')}
              </p>
              <Button className="mt-4" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                {t('common.download')}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border flex-shrink-0 bg-background">
          <div className="text-xs text-muted-foreground">
            <span>{t('documents.uploadedBy')}: {doc.uploadedBy}</span>
            <span className="mx-2">•</span>
            <span>{doc.uploadDate}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.close')}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              {t('common.download')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
