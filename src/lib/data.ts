import type { Material } from './types';

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
