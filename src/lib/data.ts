import type { Material, Order, PaperOnloading } from './types';

export const initialMaterials: Material[] = [
  {
    id: 'm1',
    name: 'Standard A4 Paper',
    type: 'Paper',
    supplier: 'PaperCorp',
    currentStock: 90000,
    maxStock: 200000,
    unitWeight: 0.005, // kg per sheet
    unitHeight: 0.01, // cm per sheet
    reorderThreshold: 20,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'm2',
    name: 'Large Cardboard Box',
    type: 'Cardboard',
    supplier: 'BoxCo',
    currentStock: 1500,
    maxStock: 5000,
    unitWeight: 0.5, // kg per box
    unitHeight: 0.2, // cm per box (stacked flat)
    reorderThreshold: 30,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'm3',
    name: 'Glossy Brochure Paper',
    type: 'Paper',
    supplier: 'PaperCorp',
    currentStock: 45000,
    maxStock: 100000,
    unitWeight: 0.008, // kg per sheet
    unitHeight: 0.015, // cm per sheet
    reorderThreshold: 25,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'm4',
    name: 'Small Shipping Box',
    type: 'Cardboard',
    supplier: 'BoxCo',
    currentStock: 8000,
    maxStock: 20000,
    unitWeight: 0.2, // kg per box
    unitHeight: 0.1, // cm per box
    reorderThreshold: 20,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'm5',
    name: 'Recycled Kraft Paper Roll',
    type: 'Paper',
    supplier: 'EcoPaper',
    currentStock: 50,
    maxStock: 100,
    unitWeight: 10, // kg per roll
    unitHeight: 5, // cm per roll
    reorderThreshold: 15,
    lastUpdated: new Date().toISOString(),
  },
];

export const initialOrders: Order[] = [
  {
    id: 'order-1',
    name: 'Annual Report 2024',
    details: '1000 copies, full color, glossy finish',
    clientName: 'Global Corp',
    status: 'Pending',
    createdAt: '2024-07-20T10:00:00Z',
  },
  {
    id: 'order-2',
    name: 'Marketing Brochures Q3',
    details: '5000 tri-fold brochures, standard paper',
    clientName: 'Innovate LLC',
    status: 'Completed',
    createdAt: '2024-07-15T14:30:00Z',
    completedAt: '2024-07-22T16:00:00Z',
    sheetsUsed: 5000,
    rimsUsed: 10,
  },
  {
    id: 'order-3',
    name: 'Business Cards',
    details: '500 cards, heavy cardstock',
    clientName: 'Startup Inc',
    status: 'Pending',
    createdAt: '2024-07-22T11:00:00Z',
  },
];

export const initialOnloadings: PaperOnloading[] = [
  {
    id: 'onload-1',
    date: '2024-07-01T09:00:00Z',
    quantityRims: 200,
    quantitySheets: 100000,
    supplier: 'PaperCorp',
    paperType: 'Standard A4 Paper',
  },
  {
    id: 'onload-2',
    date: '2024-07-05T11:00:00Z',
    quantityRims: 100,
    quantitySheets: 50000,
    supplier: 'PaperCorp',
    paperType: 'Glossy Brochure Paper',
  },
  {
    id: 'onload-3',
    date: '2024-07-15T14:00:00Z',
    quantityRims: 50,
    quantitySheets: 5000,
    supplier: 'EcoPaper',
    paperType: 'Recycled Kraft Paper Roll',
  },
];
