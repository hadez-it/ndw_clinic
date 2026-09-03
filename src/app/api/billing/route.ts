import { NextRequest } from 'next/server';
import { jsonResponse, sanitizeText } from '@/lib/security';
import {
  getInvoicesStore,
  createInvoiceStore,
  payInvoiceStore,
} from '@/lib/erpStore';

export async function GET() {
  try {
    const list = getInvoicesStore();

    const totalRevenue = list
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const pendingRevenue = list
      .filter((i) => i.status === 'unpaid')
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const paidCount = list.filter((i) => i.status === 'paid').length;
    const unpaidCount = list.filter((i) => i.status === 'unpaid').length;

    return jsonResponse({
      success: true,
      count: list.length,
      metrics: {
        totalRevenueMMK: totalRevenue,
        pendingRevenueMMK: pendingRevenue,
        paidCount,
        unpaidCount,
      },
      invoices: list,
    });
  } catch (err) {
    console.error('Billing GET error:', err);
    return jsonResponse({ error: 'Failed to fetch billing records' }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientId,
      patientName,
      patientPhone,
      items,
      discount,
      tax,
    } = body;

    if (!patientName || !items || !items.length) {
      return jsonResponse({ error: 'Patient name and at least one bill item required' }, 400);
    }

    const subtotal = items.reduce(
      (acc: number, item: { quantity: number; unitPrice: number }) =>
        acc + (Number(item.quantity) * Number(item.unitPrice)),
      0
    );

    const discountAmount = Number(discount) || 0;
    const taxAmount = Number(tax) || 0;
    const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount);

    const newInvoice = createInvoiceStore({
      patientId: sanitizeText(patientId || ''),
      patientName: sanitizeText(patientName),
      patientPhone: sanitizeText(patientPhone || ''),
      date: new Date().toISOString().split('T')[0],
      status: 'unpaid',
      items: items.map((it: { description: string; category: string; quantity: number; unitPrice: number }) => ({
        description: sanitizeText(it.description),
        category: (it.category || 'consultation') as 'consultation' | 'pharmacy' | 'procedure' | 'lab',
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
      })),
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      totalAmount,
    });

    return jsonResponse({
      success: true,
      message: 'Invoice generated successfully!',
      invoice: newInvoice,
    }, 201);
  } catch (err) {
    console.error('Billing POST error:', err);
    return jsonResponse({ error: 'Failed to generate invoice' }, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, paymentMethod } = body;

    if (!id || !paymentMethod) {
      return jsonResponse({ error: 'Invoice ID and payment method are required' }, 400);
    }

    const updated = payInvoiceStore(
      id,
      paymentMethod as 'cash' | 'kpay' | 'wave' | 'card'
    );

    if (!updated) {
      return jsonResponse({ error: 'Invoice not found' }, 404);
    }

    return jsonResponse({
      success: true,
      message: `Invoice ${updated.invoiceNumber} paid via ${paymentMethod.toUpperCase()}! Receipt #${updated.receiptNumber}`,
      invoice: updated,
    });
  } catch (err) {
    console.error('Billing PATCH error:', err);
    return jsonResponse({ error: 'Failed to record invoice payment' }, 500);
  }
}
