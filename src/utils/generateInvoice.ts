import { InvoiceData, InvoiceItem } from '@/components/invoice/InvoiceTemplate';

// Generate invoice number
export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PE${year}${month}${random}`;
};

// Format date for invoice
export const formatInvoiceDate = (date?: Date): string => {
  const d = date || new Date();
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Create invoice from transaction
export const createInvoiceFromTransaction = (
  transaction: {
    description: string;
    amount: number;
    category: string;
    date: string;
  },
  clientName: string,
  clientCompany?: string
): InvoiceData => {
  const items: InvoiceItem[] = [
    {
      description: transaction.description,
      quantity: 1,
      unitPrice: transaction.amount,
      total: transaction.amount,
    }
  ];

  return {
    invoiceNumber: generateInvoiceNumber(),
    date: formatInvoiceDate(new Date()),
    clientName,
    clientCompany,
    items,
    subtotal: transaction.amount,
    tax: 0,
    total: transaction.amount,
    paymentMethod: {
      bankName: 'Mobile Money',
      accountNumber: '658 315 610'
    },
    currency: 'FCFA'
  };
};

// Create invoice from booking
export const createInvoiceFromBooking = (
  booking: {
    spaceName: string;
    clientName: string;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
  }
): InvoiceData => {
  // Calculate hours
  const startHour = parseInt(booking.startTime.split(':')[0]);
  const endHour = parseInt(booking.endTime.split(':')[0]);
  const hours = endHour - startHour;
  const pricePerHour = hours > 0 ? Math.round(booking.totalPrice / hours) : booking.totalPrice;

  const items: InvoiceItem[] = [
    {
      description: `Location ${booking.spaceName} - ${booking.date}`,
      quantity: hours,
      unitPrice: pricePerHour,
      total: booking.totalPrice,
    }
  ];

  return {
    invoiceNumber: generateInvoiceNumber(),
    date: formatInvoiceDate(new Date()),
    clientName: booking.clientName,
    items,
    subtotal: booking.totalPrice,
    tax: 0,
    total: booking.totalPrice,
    paymentMethod: {
      bankName: 'Mobile Money',
      accountNumber: '658 315 610'
    },
    currency: 'FCFA'
  };
};

// Create invoice from media project
export const createInvoiceFromProject = (
  project: {
    title: string;
    client: string;
    budget: number;
    type: string;
  }
): InvoiceData => {
  const typeLabels: Record<string, string> = {
    video: 'Production Vidéo',
    audio: 'Production Audio',
    podcast: 'Production Podcast'
  };

  const items: InvoiceItem[] = [
    {
      description: `${typeLabels[project.type] || 'Production'} - ${project.title}`,
      quantity: 1,
      unitPrice: project.budget,
      total: project.budget,
    }
  ];

  return {
    invoiceNumber: generateInvoiceNumber(),
    date: formatInvoiceDate(new Date()),
    clientName: project.client,
    items,
    subtotal: project.budget,
    tax: 0,
    total: project.budget,
    paymentMethod: {
      bankName: 'Mobile Money',
      accountNumber: '658 315 610'
    },
    currency: 'FCFA'
  };
};

// Print invoice
export const printInvoice = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Facture</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            background: white;
            color: black;
          }
          .invoice {
            padding: 40px;
            max-width: 210mm;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          .logo-circle {
            width: 100px;
            height: 100px;
            border: 6px solid black;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .company-info {
            text-align: right;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
          }
          .yellow { color: #EAB308; }
          .title {
            text-align: center;
            margin: 30px 0;
            padding: 10px 40px;
            border-top: 4px solid #EAB308;
            border-bottom: 4px solid #EAB308;
            display: inline-block;
          }
          .title-container { text-align: center; }
          .client-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background: #EAB308;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) { background: #f9f9f9; }
          .totals {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          .total-box {
            background: #EAB308;
            padding: 10px 20px;
            font-weight: bold;
            font-size: 18px;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
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
