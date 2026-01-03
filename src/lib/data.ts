
import type { Material, PaperOnboarding, Measurement, WorkOrder, Job, JobItem } from './types';

// This is no longer the source of truth for measurements.
// It is kept here for reference but will be removed once the API is integrated.
export const initialMeasurements: Measurement[] = [
  { _id: 'measurement-1', name: 'Rim', sheetsPerUnit: 500 },
  { _id: 'measurement-2', name: 'Packet', sheetsPerUnit: 100 },
  { _id: 'measurement-3', name: 'Roll', sheetsPerUnit: 1 },
  { _id: 'measurement-4', name: 'Box', sheetsPerUnit: 2500 },
  { _id: 'measurement-5', name: 'Unit', sheetsPerUnit: 1 },
];

export const initialMaterials: Material[] = [
  {
    _id: 'm1',
    name: 'Standard A4 80gsm',
    type: 'Rim',
    unitQuantity: 40,
    extraSheets: 0,
    currentStock: 20000,
    maxStock: 50000,
    reorderThreshold: 15,
    lastUpdated: '2024-07-28T10:00:00Z',
  },
  {
    _id: 'm2',
    name: 'Glossy Brochure 150gsm',
    type: 'Packet',
    unitQuantity: 95,
    extraSheets: 0,
    currentStock: 9500,
    maxStock: 20000,
    reorderThreshold: 20,
    lastUpdated: '2024-07-28T14:30:00Z',
  },
  {
    _id: 'm3',
    name: 'Recycled Kraft Roll 120gsm',
    type: 'Roll',
    unitQuantity: 0,
    extraSheets: 30,
    currentStock: 30,
    maxStock: 100,
    reorderThreshold: 10,
    lastUpdated: '2024-07-27T08:00:00Z',
  },
  {
    _id: 'm4',
    name: 'Heavy Cardstock 300gsm',
    type: 'Packet',
    unitQuantity: 70,
    extraSheets: 0,
    currentStock: 7000,
    maxStock: 15000,
    reorderThreshold: 25,
    lastUpdated: '2024-07-26T16:45:00Z',
  },
  {
    _id: 'm5',
    name: 'Vellum Paper 90gsm',
    type: 'Packet',
    unitQuantity: 28,
    extraSheets: 0,
    currentStock: 2800,
    maxStock: 5000,
    reorderThreshold: 30,
    lastUpdated: '2024-07-28T11:00:00Z',
  },
   {
    _id: 'm6',
    name: 'Matte Finish A3 120gsm',
    type: 'Rim',
    unitQuantity: 20,
    extraSheets: 0,
    currentStock: 10000,
    maxStock: 25000,
    reorderThreshold: 20,
    lastUpdated: '2024-07-25T09:20:00Z',
  },
  {
    _id: 'm7',
    name: 'Carbonless NCR Paper',
    type: 'Box',
    unitQuantity: 4,
    extraSheets: 0,
    currentStock: 10000,
    maxStock: 20000,
    reorderThreshold: 10,
    lastUpdated: '2024-07-28T18:00:00Z',
  },
];


export const initialOnloadings: PaperOnboarding[] = [
  {
    id: 'onload-1',
    date: '2024-07-20T09:00:00Z',
    supplier: 'PaperCorp',
    papers: [
        { paperType: 'Standard A4 80gsm', unitQuantity: 50, amount: 125000 },
        { paperType: 'Glossy Brochure 150gsm', unitQuantity: 100, amount: 20000 },
    ],
    isReverted: false,
  },
  {
    id: 'onload-2',
    date: '2024-07-21T11:00:00Z',
    supplier: 'EcoPaper',
    papers: [{ paperType: 'Recycled Kraft Roll 120gsm', unitQuantity: 50, amount: 15000 }],
    isReverted: false,
  },
  {
    id: 'onload-3',
    date: '2024-07-22T15:00:00Z',
    supplier: 'Quality Sheets Ltd.',
    papers: [{ paperType: 'Heavy Cardstock 300gsm', unitQuantity: 100, amount: 35000 }],
    isReverted: false,
  },
    {
    id: 'onload-4',
    date: '2024-07-23T10:00:00Z',
    supplier: 'Fine Papers Inc.',
    papers: [{ paperType: 'Vellum Paper 90gsm', unitQuantity: 50, amount: 22500 }],
    isReverted: false,
  },
  {
    id: 'onload-5',
    date: '2024-07-24T12:00:00Z',
    supplier: 'PaperCorp',
    papers: [
        { paperType: 'Matte Finish A3 120gsm', unitQuantity: 30, amount: 105000 },
        { paperType: 'Carbonless NCR Paper', unitQuantity: 5, amount: 62500 }
    ],
    isReverted: false,
  },
  {
    id: 'onload-6',
    date: '2024-07-15T09:00:00Z',
    supplier: 'Old Stock Supplier',
    papers: [{ paperType: 'Standard A4 80gsm', unitQuantity: 10, amount: 20000 }],
    isReverted: true,
  }
];

export const initialJobOrders: Job[] = [
    {
        id: 'job-101',
        department: 'Printing',
        date: '2024-07-25T10:00:00Z',
        items: [ { name: 'Annual Report 2024', quantity: 2000 }, { name: 'Cover Page', quantity: 2000 }]
    },
    {
        id: 'job-102',
        department: 'Marketing',
        date: '2024-07-26T11:00:00Z',
        items: [ { name: 'Q3 Marketing Brochures', quantity: 10000 } ]
    },
    {
        id: 'job-103',
        department: 'Packaging',
        date: '2024-07-27T09:30:00Z',
        items: [ { name: 'Product Boxes', quantity: 500 } ]
    },
    {
        id: 'job-104',
        department: 'Stationery',
        date: '2024-07-28T14:00:00Z',
        items: [ { name: 'Wedding Invitations', quantity: 300 } ]
    },
    {
        id: 'job-105',
        department: 'Administration',
        date: '2024-07-29T10:00:00Z',
        items: [ { name: 'Invoice Books', quantity: 150 } ]
    }
];

export const initialWorkOrders: WorkOrder[] = [
    {
        id: 'wo-001',
        jobId: 'job-101',
        items: [{ name: 'Annual Report 2024', quantity: 2000 }],
        description: 'Print 2000 copies of the annual report, 150 pages, full color.',
        priority: 'High',
        status: 'Completed',
        date: '2024-07-25T11:00:00Z',
        materialsUsed: [ { materialId: 'm1', materialName: 'Standard A4 80gsm', quantity: 3000 } ]
    },
    {
        id: 'wo-002',
        jobId: 'job-102',
        items: [{ name: 'Q3 Marketing Brochures', quantity: 5000 }],
        description: 'Print and fold 5000 brochures for the upcoming campaign.',
        priority: 'High',
        status: 'In Progress',
        date: '2024-07-26T12:00:00Z'
    },
    {
        id: 'wo-003',
        jobId: 'job-102',
        items: [{ name: 'Q3 Marketing Brochures', quantity: 5000 }],
        description: 'Second batch of 5000 brochures.',
        priority: 'Medium',
        status: 'Pending',
        date: '2024-07-26T13:00:00Z',
    },
    {
        id: 'wo-004',
        jobId: 'job-103',
        items: [{ name: 'Product Boxes', quantity: 500 }],
        description: 'Cut and score 500 product boxes from heavy cardstock.',
        priority: 'Medium',
        status: 'Completed',
        date: '2024-07-27T10:00:00Z',
        materialsUsed: [ { materialId: 'm4', materialName: 'Heavy Cardstock 300gsm', quantity: 1000 } ]
    },
     {
        id: 'wo-005',
        jobId: 'job-104',
        items: [{ name: 'Wedding Invitations', quantity: 300 }],
        description: 'Print 300 wedding invitations on Vellum paper.',
        priority: 'High',
        status: 'In Progress',
        date: '2024-07-28T15:00:00Z',
    },
    {
        id: 'wo-006',
        jobId: 'job-105',
        items: [{ name: 'Invoice Books', quantity: 150 }],
        description: 'Create 150 duplicate invoice books.',
        priority: 'Low',
        status: 'Pending',
        date: '2024-07-29T11:00:00Z',
    },
    {
        id: 'wo-007',
        jobId: 'job-101',
        items: [{ name: 'Cover Page', quantity: 2000 }],
        description: 'Print 2000 covers for the annual reports on cardstock.',
        priority: 'High',
        status: 'Completed',
        date: '2024-07-26T09:00:00Z',
        materialsUsed: [ { materialId: 'm4', materialName: 'Heavy Cardstock 300gsm', quantity: 2000 } ]
    },
    {
        id: 'wo-008',
        jobId: 'job-105',
        items: [{ name: 'Invoice Books', quantity: 150 }],
        description: 'Second set of 150 invoice books.',
        priority: 'Low',
        status: 'Pending',
        date: '2024-07-30T10:00:00Z',
    },
];
