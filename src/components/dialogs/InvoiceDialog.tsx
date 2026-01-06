import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InvoiceTemplate, InvoiceData } from '@/components/invoice/InvoiceTemplate';
import { Printer, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: InvoiceData | null;
}

export function InvoiceDialog({ open, onOpenChange, invoiceData }: InvoiceDialogProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const handlePrint = () => {
    if (!invoiceRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture ${invoiceData?.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: white; color: black; }
            .invoice-container { padding: 20px; }
            .header-section { position: relative; margin-bottom: 30px; padding-top: 20px; }
            .corner-decoration { position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: #EAB308; border-bottom-left-radius: 100%; }
            .logo-container { position: absolute; top: 0; left: 0; width: 100px; height: 100px; border: 6px solid black; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
            .logo-w { font-size: 28px; font-weight: bold; }
            .logo-text { font-size: 8px; font-weight: bold; line-height: 1.2; }
            .logo-sub { font-size: 6px; }
            .company-header { text-align: right; padding-right: 90px; }
            .company-name { font-size: 22px; font-weight: bold; letter-spacing: 2px; }
            .yellow { color: #EAB308; }
            .tagline { font-size: 10px; letter-spacing: 3px; color: #666; }
            .contact-info { margin-top: 10px; font-size: 12px; }
            .title-section { text-align: center; margin: 40px 0; }
            .title-box { display: inline-block; border-top: 3px solid #EAB308; border-bottom: 3px solid #EAB308; padding: 8px 40px; }
            .title-text { font-size: 20px; font-weight: bold; letter-spacing: 2px; }
            .client-section { display: flex; justify-content: space-between; margin-bottom: 25px; }
            .client-label { font-size: 10px; color: #888; text-transform: uppercase; }
            .client-name { font-size: 18px; font-weight: bold; }
            .total-label { font-size: 10px; color: #888; text-transform: uppercase; text-align: right; }
            .total-value { font-size: 22px; font-weight: bold; text-align: right; }
            .date-info { text-align: center; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            th { background: #EAB308; padding: 10px 15px; text-align: left; font-weight: bold; font-size: 13px; }
            th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: center; }
            td { padding: 12px 15px; border-bottom: 1px solid #e5e5e5; font-size: 12px; }
            td:nth-child(2), td:nth-child(3), td:nth-child(4) { text-align: center; }
            tr:nth-child(even) { background: #fafafa; }
            .totals-section { display: flex; justify-content: space-between; margin-bottom: 50px; }
            .payment-info { max-width: 200px; }
            .payment-title { font-weight: 600; margin-bottom: 8px; font-size: 13px; }
            .payment-details { font-size: 11px; color: #666; line-height: 1.5; }
            .totals-box { text-align: right; }
            .subtotal-row { display: flex; justify-content: space-between; gap: 30px; font-size: 13px; margin-bottom: 5px; }
            .total-final { background: #EAB308; padding: 10px 20px; font-weight: bold; font-size: 16px; margin-top: 10px; }
            .footer-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; }
            .terms { max-width: 250px; }
            .terms-title { font-weight: 600; text-decoration: underline; margin-bottom: 8px; font-size: 12px; }
            .terms-text { font-size: 10px; color: #666; font-style: italic; line-height: 1.4; }
            .signature { text-align: center; }
            .signature-name { font-weight: bold; font-size: 14px; }
            .signature-title { font-size: 12px; color: #666; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header-section">
              <div class="corner-decoration"></div>
              <div class="logo-container">
                <div class="logo-w">W</div>
                <div class="logo-text">WEST DIGITAL<span class="yellow">HUB</span></div>
                <div class="logo-sub">CONNECT - INNOVE - IMPACT</div>
              </div>
              <div class="company-header">
                <div class="company-name">WEST DIGITAL<span class="yellow">HUB</span></div>
                <div class="tagline">CONNECT - INNOVE - IMPACT</div>
                <div class="contact-info">
                  <div>NUI: <span class="yellow">M112518198169</span></div>
                  <div>TEL: <strong>658 315 610/691 497 464</strong></div>
                  <div style="font-size: 10px;">LIEU: <span class="yellow">BAFOUSSAM-Marche B</span>, En face de l'ancienne gare routière</div>
                </div>
              </div>
            </div>
            
            <div class="title-section">
              <div class="title-box">
                <div class="title-text">FACTURE N° ${invoiceData?.invoiceNumber}</div>
              </div>
            </div>
            
            <div class="client-section">
              <div>
                <div class="client-label">CLIENT :</div>
                <div class="client-name">${invoiceData?.clientName}</div>
                ${invoiceData?.clientCompany ? `<div style="font-size: 12px; color: #666;">${invoiceData.clientCompany}</div>` : ''}
              </div>
              <div class="date-info">Date : ${invoiceData?.date}</div>
              <div>
                <div class="total-label">TOTAL À PAYER</div>
                <div class="total-value">${invoiceData?.total.toLocaleString()} ${invoiceData?.currency || 'FCFA'}</div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qté</th>
                  <th>Prix</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData?.items.map((item, i) => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toLocaleString()} ${invoiceData?.currency || 'FCFA'}</td>
                    <td>${item.total.toLocaleString()} ${invoiceData?.currency || 'FCFA'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals-section">
              <div class="payment-info">
                <div class="payment-title">Méthode de paiement</div>
                <div class="payment-details">
                  <div><em>Bank Name:</em> ${invoiceData?.paymentMethod?.bankName || 'Mobile Money'}</div>
                  <div><em>Account No:</em> ${invoiceData?.paymentMethod?.accountNumber || '658 315 610'}</div>
                </div>
              </div>
              <div class="totals-box">
                <div class="subtotal-row"><span>Sub-total :</span><span>${invoiceData?.subtotal.toLocaleString()} ${invoiceData?.currency || 'FCFA'}</span></div>
                <div class="subtotal-row"><span>Tax :</span><span>${invoiceData?.tax.toLocaleString()} ${invoiceData?.currency || 'FCFA'}</span></div>
                <div class="total-final">Total : ${invoiceData?.total.toLocaleString()} ${invoiceData?.currency || 'FCFA'}</div>
              </div>
            </div>
            
            <div class="footer-section">
              <div class="terms">
                <div class="terms-title">Terms and Conditions</div>
                <div class="terms-text">Please send payment within 30 days of receiving this invoice. There will be 10% interest charge per month on late invoice.</div>
              </div>
              <div class="signature">
                <div class="signature-name">Orlane Motue</div>
                <div class="signature-title">COO</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!invoiceData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t('invoice.preview')} - {invoiceData.invoiceNumber}</span>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                {t('invoice.print')}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="border rounded-lg overflow-hidden bg-white">
          <div ref={invoiceRef} className="scale-75 origin-top-left" style={{ width: '133.33%' }}>
            <InvoiceTemplate data={invoiceData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
