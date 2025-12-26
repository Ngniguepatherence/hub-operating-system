import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useAppStore } from '@/stores/appStore';
import { UploadDocumentDialog } from '@/components/dialogs/UploadDocumentDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  FileText, 
  Folder, 
  Download, 
  Trash2, 
  Eye,
  File,
  FileSpreadsheet,
  FileImage,
  MoreHorizontal,
  FolderOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Documents() {
  const { t } = useLanguage();
  const { canManage } = usePermissions();
  const { documents, folders, deleteDocument } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const canManageDocuments = canManage('documents');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-destructive" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-8 h-8 text-success" />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <FileImage className="w-8 h-8 text-primary" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-info" />;
      default:
        return <File className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'contracts':
        return t('documents.contracts');
      case 'invoices':
        return t('documents.invoices');
      case 'reports':
        return t('documents.reports');
      case 'templates':
        return t('documents.templates');
      case 'policies':
        return t('documents.policies');
      default:
        return t('documents.other');
    }
  };

  const handleDelete = (id: string) => {
    setSelectedDocument(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocument) {
      deleteDocument(selectedDocument);
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <DashboardLayout title={t('documents.title')} subtitle={t('documents.subtitle')}>
      {/* Folders Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {folders.map((folder) => (
          <Card 
            key={folder.id} 
            className="glass-card cursor-pointer hover:border-primary/30 transition-all group"
            onClick={() => setCategoryFilter(folder.category)}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="p-3 rounded-xl bg-primary/10 mb-2 group-hover:bg-primary/20 transition-colors">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground truncate w-full">{folder.name}</p>
              <p className="text-xs text-muted-foreground">{folder.count} {t('documents.files')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48 bg-muted/50">
            <SelectValue placeholder={t('finance.category')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')} {t('documents.files')}</SelectItem>
            <SelectItem value="contracts">{t('documents.contracts')}</SelectItem>
            <SelectItem value="invoices">{t('documents.invoices')}</SelectItem>
            <SelectItem value="reports">{t('documents.reports')}</SelectItem>
            <SelectItem value="templates">{t('documents.templates')}</SelectItem>
            <SelectItem value="policies">{t('documents.policies')}</SelectItem>
            <SelectItem value="other">{t('documents.other')}</SelectItem>
          </SelectContent>
        </Select>
        {canManageDocuments && (
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('documents.uploadDocument')}
          </Button>
        )}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="glass-card hover:border-primary/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground truncate">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">{formatFileSize(doc.size)}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" /> {t('common.view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" /> {t('common.download')}
                        </DropdownMenuItem>
                        {canManageDocuments && (
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> {t('common.delete')}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(doc.category)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    <span>{doc.uploadedBy}</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('common.noData')}</p>
        </div>
      )}

      <UploadDocumentDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('common.confirm')}
        description={t('crm.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
}
