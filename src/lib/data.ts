
import type { Material, PaperOnboarding, Measurement, WorkOrder, Job, JobItem } from './types';

export const initialMaterials: Material[] = [
  {
    _id: 'm1',
    name: 'Standard A4 Paper',
    type: 'Rim',
    unitQuantity: 0,
    extraSheets: 0,
    currentStock: 5000,
    maxStock: 10000,
    reorderThreshold: 15,
    lastUpdated: '2024-07-20T10:00:00Z',
  },
  {
    _id: 'm2',
    name: 'Glossy Brochure Paper',
    type: 'Packet',
    unitQuantity: 0,
    extraSheets: 0,
    currentStock: 2500,
    maxStock: 5000,
    reorderThreshold: 20,
    lastUpdated: '2024-07-22T14:30:00Z',
  },
  {
    _id: 'm3',
    name: 'Recycled Kraft Paper Roll',
    type: 'Roll',
    unitQuantity: 0,
    extraSheets: 0,
    currentStock: 800,
    maxStock: 2000,
    reorderThreshold: 10,
    lastUpdated: '2024-07-23T08:00:00Z',
  },
  {
    _id: 'm4',
    name: 'Heavy Cardstock',
    type: 'Packet',
    unitQuantity: 0,
    extraSheets: 0,
    currentStock: 1200,
    maxStock: 3000,
    reorderThreshold: 25,
    lastUpdated: '2024-07-21T16:45:00Z',
  },
  {
    _id: 'm5',
    name: 'Vellum Paper',
    type: 'Unit',
    unitQuantity: 0,
    extraSheets: 0,
    currentStock: 300,
    maxStock: 1000,
    reorderThreshold: 30,
    lastUpdated: '2024-07-24T11:00:00Z',
  },
];


export const initialOnloadings: PaperOnboarding[] = [
  {
    id: 'onload-1',
    date: '2024-07-01T09:00:00Z',
    supplier: 'PaperCorp',
    papers: [
        { paperType: 'Standard A4 Paper', unitQuantity: 200, amount: 2000 },
        { paperType: 'Glossy Brochure Paper', unitQuantity: 100, amount: 1500 },
    ],
    isReverted: false,
  },
  {
    id: 'onload-2',
    date: '2024-07-05T11:00:00Z',
    supplier: 'EcoPaper',
    papers: [{ paperType: 'Recycled Kraft Paper Roll', unitQuantity: 50, amount: 5000 }],
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

export const initialJobOrders: Job[] = [
    {
        id: 'job-1',
        department: 'Printing',
        date: '2024-07-25T10:00:00Z',
        items: [
            { name: 'Annual Report', quantity: 1000 },
            { name: 'Cover Page', quantity: 1000 }
        ]
    },
    {
        id: 'job-2',
        department: 'Binding',
        date: '2024-07-26T11:00:00Z',
        items: [
            { name: 'Marketing Brochures', quantity: 5000 }
        ]
    }
];

export const initialWorkOrders: WorkOrder[] = [
    {
        id: 'wo-1',
        jobId: 'job-1',
        items: [{ name: 'Annual Report', quantity: 1000 }],
        description: 'Print 1000 copies of the annual report.',
        priority: 'High',
        status: 'Pending',
        date: '2024-07-25T11:00:00Z',
    },
    {
        id: 'wo-2',
        jobId: 'job-2',
        items: [{ name: 'Marketing Brochures', quantity: 5000 }],
        description: 'Fold and bind 5000 marketing brochures.',
        priority: 'Medium',
        status: 'Completed',
        date: '2024-07-26T12:00:00Z',
        materialsUsed: [
            { materialId: 'm3', materialName: 'Glossy Brochure Paper', quantity: 500 }
        ]
    }
];
