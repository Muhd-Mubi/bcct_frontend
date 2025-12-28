'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { initialMaterials, initialOrders, initialOnloadings, initialMeasurements, Material, Order, PaperOnloading, Measurement } from '@/lib/data';

interface DataContextType {
  materials: Material[];
  orders: Order[];
  onloadings: PaperOnloading[];
  measurements: Measurement[];
  saveMaterial: (material: Material) => void;
  deleteMaterial: (id: string) => void;
  saveOrder: (order: Order) => void;
  markOrderAsComplete: (orderId: string, sheetsUsed: number, rimsUsed: number) => void;
  saveOnloading: (onloadingData: Omit<PaperOnloading, 'id' | 'date'>) => void;
  updateMaterialStock: (materialId: string, stockChange: number) => void;
  saveMeasurement: (measurement: Measurement) => void;
  deleteMeasurement: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
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
  
  const saveOrder = (order: Order) => {
      const existing = orders.find((o) => o.id === order.id);
      if (existing) {
          setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
      } else {
          setOrders((prev) => [...prev, { ...order, id: `order-${prev.length + 1}` }]);
      }
  };

  const markOrderAsComplete = (orderId: string, sheetsUsed: number, rimsUsed: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'Completed', sheetsUsed, rimsUsed, completedAt: new Date().toISOString() }
          : o
      )
    );
  };
  
  const saveOnloading = (onloadingData: Omit<PaperOnloading, 'id' | 'date'>) => {
      const newOnloading: PaperOnloading = {
        ...onloadingData,
        id: `onloading-${Date.now()}`,
        date: new Date().toISOString(),
      };
      setOnloadings((prev) => [newOnloading, ...prev]);
      
      // Update material stock
      const materialToUpdate = materials.find(m => m.name === onloadingData.paperType);
      if(materialToUpdate) {
          updateMaterialStock(materialToUpdate.id, onloadingData.quantitySheets);
      }
  };

  const updateMaterialStock = (materialId: string, stockChange: number) => {
      setMaterials(prev => prev.map(m => m.id === materialId ? { ...m, currentStock: m.currentStock + stockChange } : m));
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

  const deleteMeasurement = (id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  };

  const value = { 
      materials, 
      orders,
      onloadings,
      measurements,
      saveMaterial, 
      deleteMaterial,
      saveOrder,
      markOrderAsComplete,
      saveOnloading,
      updateMaterialStock,
      saveMeasurement,
      deleteMeasurement,
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
