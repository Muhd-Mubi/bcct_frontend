import type { Material, PaperOnboarding, Measurement, WorkOrder, Job } from './types';

export const initialMaterials: Material[] = [];

export const initialOnloadings: PaperOnboarding[] = [
  {
    id: 'onload-1',
    date: '2024-07-01T09:00:00Z',
    supplier: 'PaperCorp',
    papers: [
        { paperType: 'Standard A4 Paper', unitQuantity: 200, extraSheets: 0 },
        { paperType: 'Glossy Brochure Paper', unitQuantity: 100, extraSheets: 0 },
    ],
    isReverted: false,
  },
  {
    id: 'onload-2',
    date: '2024-07-05T11:00:00Z',
    supplier: 'EcoPaper',
    papers: [{ paperType: 'Recycled Kraft Paper Roll', unitQuantity: 50, extraSheets: 0 }],
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

export const initialJobs: Job[] = [
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
        description: 'Print 1000 copies of the annual report.',
        priority: 'High',
        status: 'Pending',
        date: '2024-07-25T11:00:00Z',
    },
    {
        id: 'wo-2',
        jobId: 'job-2',
        description: 'Fold and bind 5000 marketing brochures.',
        priority: 'Medium',
        status: 'Completed',
        date: '2024-07-26T12:00:00Z',
        materialsUsed: [
            { materialId: 'm3', materialName: 'Glossy Brochure Paper', quantity: 500 }
        ]
    }
];
