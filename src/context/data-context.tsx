'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { initialMaterials, initialOnloadings, initialMeasurements, Material, PaperOnloading, Measurement } from '@/lib/data';

interface DataContextType {
  materials: Material[];
  onloadings: PaperOnloading[];
  measurements: Measurement[];
  saveMaterial: (material: Material) => void;
  deleteMaterial: (id: string) => void;
  saveOnloading: (onloadingData: Omit<PaperOnloading, 'id' | 'date' | 'isReverted'>) => void;
  revertOnloading: (onloadingId: string) => void;
  updateMaterialStock: (materialId: string, stockChange: number) => void;
  saveMeasurement: (measurement: Measurement) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [onloadings, setOnloadings] = useState<PaperOnloading[]>(initialOnloadings);
  const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements);


  const saveMaterial = (material: Material) => {
    setMaterials((prev) => {
      const existing = prev.find((m) => m.id === material.id);
      if (existing) {
        return prev.map((m) => (m.id === material.id ? material : m));
      } else {
        return [...prev, { ...material, id: `m${prev.length + 1}` }];
      }
    });
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };
  
  const saveOnloading = (onloadingData: Omit<PaperOnloading, 'id' | 'date'| 'isReverted'>) => {
    const materialToUpdate = materials.find(m => m.name === onloadingData.paperType);
    const measurement = measurements.find(m => m.type === materialToUpdate?.type);
    const sheetsPerUnit = measurement ? measurement.sheetsPerUnit : 1;
    const totalSheets = (onloadingData.unitQuantity * sheetsPerUnit) + onloadingData.extraSheets;

      const newOnloading: PaperOnloading = {
        ...onloadingData,
        id: `onloading-${Date.now()}`,
        date: new Date().toISOString(),
        isReverted: false,
      };
      setOnloadings((prev) => [newOnloading, ...prev]);
      
      // Update material stock
      if(materialToUpdate) {
          updateMaterialStock(materialToUpdate.id, totalSheets);
      }
  };

  const revertOnloading = (onloadingId: string) => {
    const onloadingEntry = onloadings.find(o => o.id === onloadingId);
    if (!onloadingEntry || onloadingEntry.isReverted) return;

    const materialToUpdate = materials.find(m => m.name === onloadingEntry.paperType);
    if (materialToUpdate) {
        const measurement = measurements.find(m => m.type === materialToUpdate.type);
        const sheetsPerUnit = measurement ? measurement.sheetsPerUnit : 1;
        const totalSheets = (onloadingEntry.unitQuantity * sheetsPerUnit) + onloadingEntry.extraSheets;
        
        // Subtract the stock
        updateMaterialStock(materialToUpdate.id, -totalSheets);
    }
    
    // Mark as reverted
    setOnloadings(prev => prev.map(o => o.id === onloadingId ? { ...o, isReverted: true } : o));
  };

  const updateMaterialStock = (materialId: string, stockChange: number) => {
      setMaterials(prev => prev.map(m => {
        if (m.id === materialId) {
          const newStock = m.currentStock + stockChange;
          return { 
            ...m, 
            currentStock: Math.max(0, newStock), // Ensure stock doesn't go negative
            lastUpdated: new Date().toISOString() 
          };
        }
        return m;
      }));
  }

  const saveMeasurement = (measurement: Measurement) => {
    setMeasurements((prev) => {
      const existing = prev.find((m) => m.id === measurement.id);
      if (existing) {
        return prev.map((m) => (m.id === measurement.id ? measurement : m));
      } else {
        return [...prev, { ...measurement, id: `measurement-${prev.length + 1}` }];
      }
    });
  };

  const value = { 
      materials, 
      onloadings,
      measurements,
      saveMaterial, 
      deleteMaterial,
      saveOnloading,
      revertOnloading,
      updateMaterialStock,
      saveMeasurement,
    };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
