import { NextRequest } from 'next/server';
import { jsonResponse, sanitizeText } from '@/lib/security';
import {
  getMedicinesStore,
  createMedicineStore,
  updateMedicineStockStore,
} from '@/lib/erpStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;

    const medicines = getMedicinesStore(category);
    const lowStockItems = medicines.filter((m) => m.currentStock <= m.reorderLevel);

    return jsonResponse(
      {
        success: true,
        count: medicines.length,
        lowStockCount: lowStockItems.length,
        medicines,
      },
      200,
      {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
      }
    );
  } catch (err) {
    console.error('Pharmacy GET error:', err);
    return jsonResponse({ error: 'Failed to fetch medicines' }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      genericName,
      brandName,
      category,
      dosageForm,
      strength,
      currentStock,
      reorderLevel,
      unitPrice,
      costPrice,
      expiryDate,
      batchNumber,
    } = body;

    if (!genericName || !brandName || !dosageForm || !unitPrice) {
      return jsonResponse({ error: 'Missing required medicine information' }, 400);
    }

    const newMed = createMedicineStore({
      genericName: sanitizeText(genericName),
      brandName: sanitizeText(brandName),
      category: sanitizeText(category || 'General Medicine'),
      dosageForm: dosageForm as 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops' | 'Sachet',
      strength: sanitizeText(strength || 'Standard'),
      currentStock: Number(currentStock) || 0,
      reorderLevel: Number(reorderLevel) || 20,
      unitPrice: Number(unitPrice),
      costPrice: Number(costPrice) || Math.round(Number(unitPrice) * 0.6),
      expiryDate: sanitizeText(expiryDate || '2028-01-01'),
      batchNumber: sanitizeText(batchNumber || `BX-${Date.now().toString().slice(-4)}`),
    });

    return jsonResponse({
      success: true,
      message: 'New medicine added to pharmacy inventory',
      medicine: newMed,
    }, 201);
  } catch (err) {
    console.error('Pharmacy POST error:', err);
    return jsonResponse({ error: 'Failed to add medicine' }, 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, delta } = body;

    if (!id || delta === undefined) {
      return jsonResponse({ error: 'Medicine ID and delta are required' }, 400);
    }

    const updated = updateMedicineStockStore(id, Number(delta));
    if (!updated) {
      return jsonResponse({ error: 'Medicine not found' }, 404);
    }

    return jsonResponse({
      success: true,
      message: `Stock updated for ${updated.brandName}. New stock: ${updated.currentStock}`,
      medicine: updated,
    });
  } catch (err) {
    console.error('Pharmacy PATCH error:', err);
    return jsonResponse({ error: 'Failed to update stock' }, 500);
  }
}
