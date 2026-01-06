import { forwardRef } from 'react';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientCompany?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: {
    bankName: string;
    accountNumber: string;
  };
  currency?: string;
}

interface InvoiceTemplateProps {
  data: InvoiceData;
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ data }, ref) => {
    const currency = data.currency || 'FCFA';

    return (
      <div
        ref={ref}
        className="bg-white text-black p-8 w-[210mm] min-h-[297mm] mx-auto font-sans"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="relative mb-8">
          {/* Yellow corner decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 rounded-bl-full" />
          <div className="absolute top-0 left-0 w-32 h-32 border-8 border-black rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">W</div>
              <div className="text-[8px] font-bold leading-tight">
                WEST DIGITAL<span className="text-yellow-500">HUB</span>
                <br />
                <span className="text-[6px]">CONNECT - INNOVE - IMPACT</span>
              </div>
            </div>
          </div>
          
          <div className="text-right pt-4 pr-8">
            <h1 className="text-2xl font-bold tracking-wider">
              WEST DIGITAL<span className="text-yellow-500">HUB</span>
            </h1>
            <p className="text-xs tracking-widest text-gray-600">CONNECT - INNOVE - IMPACT</p>
            <div className="mt-2 text-sm">
              <p>NUI: <span className="text-yellow-600 font-medium">M112518198169</span></p>
              <p>TEL: <span className="font-medium">658 315 610/691 497 464</span></p>
              <p className="text-xs">
                LIEU: <span className="text-yellow-600">BAFOUSSAM-Marche B</span>, En face de l'ancienne gare routière
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Title */}
        <div className="text-center my-8">
          <div className="border-t-4 border-b-4 border-yellow-400 py-2 inline-block px-8">
            <h2 className="text-2xl font-bold tracking-wider">FACTURE N° {data.invoiceNumber}</h2>
          </div>
        </div>

        {/* Client and Date Info */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs text-gray-500 uppercase">CLIENT :</p>
            <p className="text-xl font-bold">{data.clientName}</p>
            {data.clientCompany && <p className="text-sm text-gray-600">{data.clientCompany}</p>}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Date : {data.date}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase">TOTAL À PAYER</p>
            <p className="text-2xl font-bold">{data.total.toLocaleString()} {currency}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-yellow-400 text-black">
                <th className="py-3 px-4 text-left font-bold">Description</th>
                <th className="py-3 px-4 text-center font-bold">Qté</th>
                <th className="py-3 px-4 text-center font-bold">Prix</th>
                <th className="py-3 px-4 text-center font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 border-b border-gray-200">{item.description}</td>
                  <td className="py-3 px-4 text-center border-b border-gray-200">{item.quantity}</td>
                  <td className="py-3 px-4 text-center border-b border-gray-200">{item.unitPrice.toLocaleString()} {currency}</td>
                  <td className="py-3 px-4 text-center border-b border-gray-200">{item.total.toLocaleString()} {currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="font-medium mb-2">Méthode de paiement</p>
            {data.paymentMethod && (
              <div className="text-sm text-gray-600">
                <p><span className="italic">Bank Name:</span> {data.paymentMethod.bankName}</p>
                <p><span className="italic">Account No:</span> {data.paymentMethod.accountNumber}</p>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="flex justify-between gap-8 mb-1">
              <span className="font-medium">Sub-total :</span>
              <span>{data.subtotal.toLocaleString()} {currency}</span>
            </div>
            <div className="flex justify-between gap-8 mb-2">
              <span className="font-medium">Tax :</span>
              <span>{data.tax.toLocaleString()} {currency}</span>
            </div>
            <div className="bg-yellow-400 px-4 py-2 font-bold text-lg">
              Total : {data.total.toLocaleString()} {currency}
            </div>
          </div>
        </div>

        {/* Terms and Signature */}
        <div className="flex justify-between items-end mt-16 pt-8 border-t border-gray-200">
          <div className="max-w-xs">
            <p className="font-medium underline mb-2">Terms and Conditions</p>
            <p className="text-xs text-gray-600 italic">
              Please send payment within 30 days of receiving this invoice. 
              There will be 10% interest charge per month on late invoice.
            </p>
          </div>
          <div className="text-center">
            <p className="font-bold">Orlane Motue</p>
            <p className="text-sm text-gray-600">COO</p>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-yellow-400 rounded-t-full mx-8" />
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';
