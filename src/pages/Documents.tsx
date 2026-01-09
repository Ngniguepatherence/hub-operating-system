import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useAppStore, Document as DocumentType } from '@/stores/appStore';
import { UploadDocumentDialog } from '@/components/dialogs/UploadDocumentDialog';
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog';
import { DocumentViewerDialog } from '@/components/dialogs/DocumentViewerDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  File,
  FileSpreadsheet,
  FileImage,
  MoreHorizontal,
  FolderOpen,
  FolderLock,
  Lock,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Documents() {
  const { t } = useLanguage();
  const { canManage, canAccessDocumentCategory, getAccessibleDocumentCategories, userRole } = usePermissions();
  const { documents, folders, deleteDocument } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);

  const canManageDocuments = canManage('documents');
  const accessibleCategories = getAccessibleDocumentCategories();

  // Filter documents based on category access and search
  const filteredDocuments = documents.filter(doc => {
    const hasAccess = canAccessDocumentCategory(doc.category);
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? doc.category === selectedCategory : true;
    return hasAccess && matchesSearch && matchesCategory;
  });

  // Group documents by category
  const documentsByCategory = accessibleCategories.reduce((acc, category) => {
    acc[category] = filteredDocuments.filter(doc => doc.category === category);
    return acc;
  }, {} as Record<string, DocumentType[]>);

  const getFileIcon = (type: string, size: 'sm' | 'lg' = 'lg') => {
    const sizeClass = size === 'sm' ? 'w-5 h-5' : 'w-8 h-8';
    switch (type) {
      case 'pdf':
        return <FileText className={`${sizeClass} text-destructive`} />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className={`${sizeClass} text-success`} />;
      case 'jpg':
      case 'png':
      case 'jpeg':
        return <FileImage className={`${sizeClass} text-primary`} />;
      case 'doc':
      case 'docx':
        return <FileText className={`${sizeClass} text-info`} />;
      default:
        return <File className={`${sizeClass} text-muted-foreground`} />;
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

  const getCategoryIcon = (category: string) => {
    const isAccessible = canAccessDocumentCategory(category);
    if (!isAccessible) {
      return <FolderLock className="w-6 h-6 text-muted-foreground" />;
    }
    return <FolderOpen className="w-6 h-6 text-primary" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contracts': return 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40';
      case 'invoices': return 'bg-green-500/10 border-green-500/20 hover:border-green-500/40';
      case 'reports': return 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40';
      case 'templates': return 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40';
      case 'policies': return 'bg-red-500/10 border-red-500/20 hover:border-red-500/40';
      default: return 'bg-muted/50 border-border hover:border-primary/30';
    }
  };

  const handleDelete = (id: string) => {
    setSelectedDocumentId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocumentId) {
      deleteDocument(selectedDocumentId);
      setDeleteDialogOpen(false);
      setSelectedDocumentId(null);
    }
  };

  const handleViewDocument = (doc: DocumentType) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const allCategories = ['contracts', 'invoices', 'reports', 'templates', 'policies', 'other'];

  // View: All categories (folder view)
  if (!selectedCategory) {
    return (
      <DashboardLayout title={t('documents.title')} subtitle={t('documents.subtitle')}>
        {/* Search and Actions */}
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
          {canManageDocuments && (
            <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              {t('documents.uploadDocument')}
            </Button>
          )}
        </div>

        {/* Role Access Info */}
        <Card className="mb-6 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>
                {t('documents.accessInfo') || 'Accès basé sur votre rôle'}: <strong className="text-foreground">{userRole?.toUpperCase()}</strong>
              </span>
              <span className="mx-2">•</span>
              <span>{accessibleCategories.length} {t('documents.categoriesAccessible') || 'catégories accessibles'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Folders Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {allCategories.map((category) => {
            const isAccessible = canAccessDocumentCategory(category);
            const folder = folders.find(f => f.category === category);
            const docCount = isAccessible 
              ? documents.filter(d => d.category === category).length 
              : 0;
            
            return (
              <Card 
                key={category} 
                className={`cursor-pointer transition-all border ${
                  isAccessible 
                    ? getCategoryColor(category)
                    : 'bg-muted/20 border-border opacity-60 cursor-not-allowed'
                }`}
                onClick={() => isAccessible && setSelectedCategory(category)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`p-3 rounded-xl mb-2 ${isAccessible ? 'bg-primary/10' : 'bg-muted/50'}`}>
                    {getCategoryIcon(category)}
                  </div>
                  <p className="text-sm font-medium text-foreground truncate w-full">
                    {getCategoryLabel(category)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAccessible ? `${docCount} ${t('documents.files')}` : (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {t('documents.restricted') || 'Restreint'}
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Documents by Category (Accordion) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('documents.recentDocuments') || 'Documents récents'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {accessibleCategories.map((category) => {
                const categoryDocs = documentsByCategory[category] || [];
                if (categoryDocs.length === 0) return null;
                
                return (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="w-5 h-5 text-primary" />
                        <span>{getCategoryLabel(category)}</span>
                        <Badge variant="secondary" className="ml-2">{categoryDocs.length}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-8">
                        {categoryDocs.slice(0, 3).map((doc) => (
                          <div 
                            key={doc.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => handleViewDocument(doc)}
                          >
                            <div className="flex items-center gap-3">
                              {getFileIcon(doc.type, 'sm')}
                              <div>
                                <p className="text-sm font-medium text-foreground">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)} • {doc.uploadDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {categoryDocs.length > 3 && (
                          <Button 
                            variant="ghost" 
                            className="w-full mt-2"
                            onClick={() => setSelectedCategory(category)}
                          >
                            {t('common.viewAll')} ({categoryDocs.length})
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        <UploadDocumentDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
        
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title={t('common.confirm')}
          description={t('crm.deleteConfirm')}
          onConfirm={confirmDelete}
        />

        <DocumentViewerDialog
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          document={selectedDocument}
        />
      </DashboardLayout>
    );
  }

  // View: Single category
  const categoryDocuments = filteredDocuments.filter(doc => doc.category === selectedCategory);

  return (
    <DashboardLayout title={getCategoryLabel(selectedCategory)} subtitle={`${categoryDocuments.length} ${t('documents.files')}`}>
      {/* Back button and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => setSelectedCategory(null)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>
        {canManageDocuments && (
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('documents.uploadDocument')}
          </Button>
        )}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {categoryDocuments.map((doc) => (
          <Card key={doc.id} className="glass-card hover:border-primary/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div 
                  className="p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleViewDocument(doc)}
                >
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 
                        className="font-medium text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleViewDocument(doc)}
                      >
                        {doc.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{formatFileSize(doc.size)}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDocument(doc)}>
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
                      {doc.type.toUpperCase()}
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

      {categoryDocuments.length === 0 && (
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

      <DocumentViewerDialog
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        document={selectedDocument}
      />
    </DashboardLayout>
  );
}
