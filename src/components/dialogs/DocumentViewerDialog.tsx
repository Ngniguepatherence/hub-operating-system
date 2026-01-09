import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet, FileImage, File, X, Maximize2, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  } | null;
}

// Mock content for demonstration - in production this would come from actual file storage
const mockDocumentContents: Record<string, { title: string; sections: { heading: string; content: string }[] }> = {
  'contracts': {
    title: 'Contrat de Prestation de Services',
    sections: [
      { 
        heading: 'Article 1 - Objet du Contrat',
        content: 'Le présent contrat a pour objet de définir les conditions dans lesquelles le Prestataire s\'engage à fournir des services de production média au Client. Ces services comprennent la création, la production et la livraison de contenus audiovisuels selon les spécifications définies dans l\'annexe technique.'
      },
      {
        heading: 'Article 2 - Durée',
        content: 'Le présent contrat est conclu pour une durée de 12 mois à compter de sa date de signature. Il pourra être renouvelé par tacite reconduction pour des périodes successives de même durée, sauf dénonciation par l\'une des parties.'
      },
      {
        heading: 'Article 3 - Obligations du Prestataire',
        content: 'Le Prestataire s\'engage à :\n• Réaliser les prestations avec diligence et professionnalisme\n• Respecter les délais convenus\n• Maintenir la confidentialité des informations\n• Fournir un travail de qualité conforme aux standards de l\'industrie'
      },
      {
        heading: 'Article 4 - Conditions Financières',
        content: 'La rémunération du Prestataire est fixée conformément au devis accepté par le Client. Les factures sont payables à 30 jours date de facture. Tout retard de paiement entraînera l\'application de pénalités de retard.'
      }
    ]
  },
  'invoices': {
    title: 'Facture',
    sections: [
      {
        heading: 'Informations Facture',
        content: 'Numéro: FAC-2024-089\nDate d\'émission: 21 Décembre 2024\nDate d\'échéance: 21 Janvier 2025\nMontant HT: 1 500 000 FCFA\nTVA (19.25%): 288 750 FCFA\nMontant TTC: 1 788 750 FCFA'
      },
      {
        heading: 'Détail des Prestations',
        content: '• Production vidéo corporate - 800 000 FCFA\n• Montage et post-production - 400 000 FCFA\n• Motion design et animations - 200 000 FCFA\n• Livraison formats multiples - 100 000 FCFA'
      },
      {
        heading: 'Conditions de Paiement',
        content: 'Paiement par virement bancaire:\nBanque: BICEC Cameroun\nCompte: 10099 00001 02345678901 47\nRIB: CM21 10099 00001 02345678901 47'
      }
    ]
  },
  'reports': {
    title: 'Rapport Financier Q4 2024',
    sections: [
      {
        heading: 'Résumé Exécutif',
        content: 'Le quatrième trimestre 2024 a été marqué par une croissance soutenue de 25% par rapport à la même période de l\'année précédente. Les revenus totaux s\'élèvent à 45 000 000 FCFA.'
      },
      {
        heading: 'Analyse des Revenus',
        content: '• Production Média: 28 000 000 FCFA (+30%)\n• Location Espaces: 12 000 000 FCFA (+15%)\n• Formation & Académie: 5 000 000 FCFA (+40%)'
      },
      {
        heading: 'Charges d\'Exploitation',
        content: '• Salaires et charges: 18 000 000 FCFA\n• Équipements: 4 500 000 FCFA\n• Loyers et charges: 3 200 000 FCFA\n• Marketing: 2 800 000 FCFA'
      },
      {
        heading: 'Résultat Net',
        content: 'Bénéfice net du trimestre: 16 500 000 FCFA\nMarge nette: 36.7%\nCapital social: 50 000 000 FCFA\nTrésorerie disponible: 22 000 000 FCFA'
      }
    ]
  },
  'templates': {
    title: 'Template Brief Projet',
    sections: [
      {
        heading: '1. Informations Générales',
        content: 'Client: [Nom du client]\nProjet: [Titre du projet]\nType: □ Vidéo □ Audio □ Podcast □ Autre\nDate souhaitée: [JJ/MM/AAAA]\nBudget estimé: [Montant] FCFA'
      },
      {
        heading: '2. Objectifs du Projet',
        content: 'Décrivez les objectifs principaux:\n• Objectif 1: _______________\n• Objectif 2: _______________\n• Public cible: _______________\n• Message clé: _______________'
      },
      {
        heading: '3. Spécifications Techniques',
        content: 'Format de livraison:\n□ 16:9 (YouTube, Web)\n□ 9:16 (TikTok, Reels)\n□ 1:1 (Instagram)\nDurée: ___ minutes\nRésolution: □ 1080p □ 4K'
      },
      {
        heading: '4. Livrables Attendus',
        content: '• Fichier master haute résolution\n• Version web optimisée\n• Sous-titres\n• Miniatures\n• Fichiers sources (optionnel)'
      }
    ]
  },
  'policies': {
    title: 'Charte Graphique West Digital Hub',
    sections: [
      {
        heading: 'Logo et Identité',
        content: 'Le logo West Digital Hub doit être utilisé conformément aux directives suivantes:\n• Zone de protection: 20% de la hauteur du logo\n• Taille minimale: 30px de hauteur\n• Versions autorisées: couleur, monochrome, inversé'
      },
      {
        heading: 'Palette de Couleurs',
        content: 'Couleurs principales:\n• Bleu WDH: #1E40AF\n• Orange accent: #F97316\n• Gris foncé: #374151\n\nCouleurs secondaires:\n• Bleu clair: #3B82F6\n• Gris clair: #9CA3AF'
      },
      {
        heading: 'Typographie',
        content: 'Police principale: Inter\n• Titres: Inter Bold (700)\n• Sous-titres: Inter Semi-Bold (600)\n• Corps: Inter Regular (400)\n\nPolice secondaire: Roboto Mono (pour le code)'
      },
      {
        heading: 'Applications',
        content: 'Documents officiels:\n• En-tête avec logo et coordonnées\n• Pied de page avec mentions légales\n• Marges: 2.5cm\n• Interligne: 1.5'
      }
    ]
  },
  'other': {
    title: 'Document',
    sections: [
      {
        heading: 'Contenu',
        content: 'Ce document contient des informations générales. Le contenu complet est disponible en téléchargement.'
      }
    ]
  }
};

export function DocumentViewerDialog({ open, onOpenChange, document: doc }: DocumentViewerDialogProps) {
  const { t } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!doc) return null;

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

  const documentContent = mockDocumentContents[doc.category] || mockDocumentContents['other'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isFullscreen ? 'max-w-[95vw] h-[95vh]' : 'max-w-4xl max-h-[85vh]'} flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(doc.type)}
              <div>
                <DialogTitle className="text-lg">{doc.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className={getCategoryColor(doc.category)}>
                    {getCategoryLabel(doc.category)}
                  </Badge>
                  <span>•</span>
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{doc.type.toUpperCase()}</span>
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
        
        {/* Document Content Preview */}
        <ScrollArea className="flex-1 mt-4">
          <div className="bg-background border border-border rounded-lg p-6 md:p-8 min-h-[400px]">
            {/* Document Header */}
            <div className="border-b border-border pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{documentContent.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{doc.name}</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>{doc.uploadDate}</p>
                  <p>{doc.uploadedBy}</p>
                </div>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-6">
              {documentContent.sections.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h2 className="text-lg font-semibold text-foreground">{section.heading}</h2>
                  <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed pl-4 border-l-2 border-primary/30">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Document Footer */}
            <div className="mt-8 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Document généré par West Digital Hub • Confidentiel
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border flex-shrink-0">
          <div className="text-xs text-muted-foreground">
            <span>{t('documents.uploadedBy')}: {doc.uploadedBy}</span>
            <span className="mx-2">•</span>
            <span>{doc.uploadDate}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.close')}
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              {t('common.download')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
