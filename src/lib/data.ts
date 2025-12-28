import type { Material, PaperOnloading, Measurement, Order } from './types';

export const initialMaterials: Material[] = [
  {
    id: 'm1',
    name: 'Standard A4 Paper',
    type: 'Rim',
    category: 'Paper',
    unitQuantity: 180,
    extraSheets: 0,
    currentStock: 90000,
    maxStock: 200000,
    reorderThreshold: 20,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'm2',
    name: 'Large Cardboard Box',
    type: 'Unit',
    category: 'Cardboard',
    unitQuantity: 1500,
    extraSheets: 0,
    currentStock: 1500,
    maxStock: 5000,
    reorderThreshold: 30,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'm3',
    name: 'Glossy Brochure Paper',
    type: 'Packet',
    category: 'Paper',
    unitQuantity: 450,
    extraSheets: 0,
    currentStock: 45000,
    maxStock: 100000,
    reorderThreshold: 25,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'm4',
    name: 'Small Shipping Box',
    type: 'Unit',
    category: 'Cardboard',
    unitQuantity: 8000,
    extraSheets: 0,
    currentStock: 8000,
    maxStock: 20000,
    reorderThreshold: 20,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'm5',
    name: 'Recycled Kraft Paper Roll',
    type: 'Roll',
    category: 'Paper',
    unitQuantity: 50,
    extraSheets: 0,
    currentStock: 50,
    maxStock: 100,
    reorderThreshold: 15,
    lastUpdated: new Date().toISOString(),
  },
];

export const initialOnloadings: PaperOnloading[] = [
  {
    id: 'onload-1',
    date: '2024-07-01T09:00:00Z',
    unitQuantity: 200,
    extraSheets: 0,
    supplier: 'PaperCorp',
    paperType: 'Standard A4 Paper',
    isReverted: false,
  },
  {
    id: 'onload-2',
    date: '2024-07-05T11:00:00Z',
    unitQuantity: 500,
    extraSheets: 0,
    supplier: 'PaperCorp',
    paperType: 'Glossy Brochure Paper',
    isReverted: false,
  },
  {
    id: 'onload-3',
    date: '2024-07-15T14:00:00Z',
    unitQuantity: 50,
    extraSheets: 0,
    supplier: 'EcoPaper',
    paperType: 'Recycled Kraft Paper Roll',
    isReverted: false,
  },
];

export const initialMeasurements: Measurement[] = [
  {
    id: 'measurement-1',
    type: 'Rim',
    sheetsPerUnit: 500,
  },
  {
    id: 'measurement-2',
    type: 'Packet',
    sheetsPerUnit: 100,
  },
    {
    id: 'measurement-3',
    type: 'Unit',
    sheetsPerUnit: 1,
  },
  {
    id: 'measurement-4',
    type: 'Roll',
    sheetsPerUnit: 1,
  },
];

export const initialOrders: Order[] = [
    {
        id: 'order-1',
        name: 'Annual Report 2024',
        client: 'Global Corp',
        details: '1000 copies, full color, glossy finish.',
        status: 'Pending',
        date: '2024-07-20T10:00:00Z',
    },
    {
        id: 'order-2',
        name: 'Marketing Brochures Q3',
        client: 'Innovate LLC',
        details: '5000 trifold brochures.',
        status: 'Pending',
        date: '2024-07-22T14:30:00Z',
    },
    {
        id: 'order-3',
        name: 'Business Cards',
        client: 'Startup Inc',
        status: 'Completed',
        date: '2024-07-18T16:00:00Z',
        materialsUsed: [
            { materialId: 'm3', materialName: 'Glossy Brochure Paper', sheetsUsed: 500 }
        ]
    }
];
