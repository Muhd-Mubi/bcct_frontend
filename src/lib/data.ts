import type { Material, PaperOnloading, Measurement, Order } from './types';

export const initialMaterials: Material[] = [];

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

// This is no longer the source of truth for measurements.
// It is kept here for reference but will be removed once the API is integrated.
export const initialMeasurements: Measurement[] = [
  {
    _id: 'measurement-1',
    name: 'Rim',
    sheetsPerUnit: 500,
  },
  {
    _id: 'measurement-2',
    name: 'Packet',
    sheetsPerUnit: 100,
  },
    {
    _id: 'measurement-3',
    name: 'Unit',
    sheetsPerUnit: 1,
  },
  {
    _id: 'measurement-4',
    name: 'Roll',
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
            { materialId: 'm3', materialName: 'Glossy Brochure Paper', sheetsUsed: 500, unitQuantity: 5, extraSheets: 0 }
        ]
    }
];
