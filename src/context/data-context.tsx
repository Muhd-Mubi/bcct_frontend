
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { initialOnloadings, initialOrders, Material, PaperOnloading, Measurement, Order, OrderStatus, MaterialsUsed, APIMaterial } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type NewMaterialsUsed = Omit<MaterialsUsed, 'materialName' | 'sheetsUsed'>;
type NewMaterial = Omit<Material, '_id' | 'currentStock' | 'maxStock' | 'reorderThreshold' | 'lastUpdated'>;

interface DataContextType {
  materials: Material[];
  onloadings: PaperOnloading[];
  measurements: Measurement[];
  orders: Order[];
  saveMaterial: (materialData: (Omit<Material, '_id' | 'currentStock' | 'maxStock' | 'reorderThreshold' | 'lastUpdated' | 'type'> & { measurementId?: string }) | (Material & { measurementId?: string })) => void;
  deleteMaterial: (id: string) => void;
  saveOnloading: (onloadingData: Omit<PaperOnloading, 'id' | 'date' | 'isReverted'>) => void;
  revertOnloading: (onloadingId: string) => void;
  updateMaterialStock: (materialId: string, stockChange: number) => void;
  saveMeasurement: (measurement: Omit<Measurement, '_id'>) => void;
  updateMeasurement: (measurement: Measurement) => void;
  saveOrder: (orderData: Omit<Order, 'id' | 'status' | 'date'>) => void;
  markOrderAsComplete: (orderId: string, materialsUsed: NewMaterialsUsed[]) => void;
  markOrderAsDiscarded: (orderId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE_URL = 'https://bcctbackend-production.up.railway.app';

// Adapter to convert API material to frontend material
const adaptMaterial = (apiMaterial: APIMaterial): Material => {
    return {
        _id: apiMaterial._id,
        name: apiMaterial.name,
        type: apiMaterial.measurementId?.name || 'N/A',
        unitQuantity: apiMaterial.unitQuantity || 0,
        extraSheets: apiMaterial.extraSheets || 0,
        currentStock: apiMaterial.totalSheets,
        maxStock: 10000, // Placeholder
        reorderThreshold: 10, // Placeholder
        lastUpdated: apiMaterial.lastUpdated || new Date().toISOString(),
    };
};


export function DataProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [onloadings, setOnloadings] = useState<PaperOnloading[]>(initialOnloadings);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const { toast } = useToast();

  const fetchMeasurements = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/measurement/get-measurement`);
      const data = await response.json();
      if (data.success) {
        setMeasurements(data.measurements);
      } else {
          console.error("API error fetching measurements:", data.message);
          setMeasurements([]); 
      }
    } catch (error) {
      console.error("Failed to fetch measurements:", error);
      setMeasurements([]); 
      toast({
          title: "Error fetching measurements",
          description: "Could not connect to the server.",
          variant: "destructive"
      });
    }
  }, [toast]);
  
  const fetchMaterials = useCallback(async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/material/get-material`);
        const data = await response.json();
        if (data.success) {
            const adaptedMaterials = data.materials.map(adaptMaterial);
            setMaterials(adaptedMaterials);
        } else {
            console.error("API error fetching materials:", data.message);
            setMaterials([]);
            toast({
                title: "Error fetching materials",
                description: data.message || "Could not retrieve materials.",
                variant: "destructive"
            });
        }
    } catch (error) {
        console.error("Failed to fetch materials:", error);
        setMaterials([]);
        toast({
            title: "Network Error",
            description: "Could not fetch materials. Please check your connection.",
            variant: "destructive"
        });
    }
  }, [toast]);

  useEffect(() => {
    fetchMeasurements();
    fetchMaterials();
  }, [fetchMeasurements, fetchMaterials]);

  const saveMaterial = async (materialData: (Omit<Material, '_id' | 'currentStock' | 'maxStock' | 'reorderThreshold' | 'lastUpdated' | 'type'> & { measurementId?: string }) | (Material & { measurementId?: string })) => {
    const isUpdate = '_id' in materialData && materialData._id;
    const payload = {
        name: materialData.name,
        unitQuantity: materialData.unitQuantity,
        extraSheets: materialData.extraSheets,
        measurementId: materialData.measurementId || null
    };

    if (isUpdate) {
        // Update existing material
        try {
            const response = await fetch(`${API_BASE_URL}/material/update-material/${materialData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.success) {
                fetchMaterials(); // Refetch all materials to get the updated list
                toast({ title: "Success", description: "Material updated successfully.", variant: 'success' });
            } else {
                toast({ title: "Error", description: result.message || "Failed to update material.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Network Error", description: "Could not update material.", variant: "destructive" });
        }
    } else {
        // Create new material
        try {
            const response = await fetch(`${API_BASE_URL}/material/create-material`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (result.success) {
                fetchMaterials(); // Refetch to get the latest list with the new material
                toast({ title: "Success", description: "Material created successfully.", variant: 'success' });
            } else {
                toast({ title: "Error", description: result.message || "Failed to create material.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Network Error", description: "Could not create material.", variant: "destructive" });
        }
    }
  };

  const deleteMaterial = async (id: string) => {
     try {
        const response = await fetch(`${API_BASE_URL}/material/delete-material/${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            setMaterials((prev) => prev.filter((m) => m._id !== id));
            toast({ title: "Success", description: "Material deleted successfully.", variant: 'success' });
        } else {
            toast({ title: "Error", description: result.message || "Failed to delete material.", variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Network Error", description: "Could not delete material.", variant: "destructive" });
    }
  };
  
  const saveOnloading = (onloadingData: Omit<PaperOnloading, 'id' | 'date'| 'isReverted'>) => {
    const materialToUpdate = materials.find(m => m.name === onloadingData.paperType);
    const measurement = measurements.find(m => m.name === materialToUpdate?.type);
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
          updateMaterialStock(materialToUpdate._id, totalSheets);
      }
  };

  const revertOnloading = (onloadingId: string) => {
    const onloadingEntry = onloadings.find(o => o.id === onloadingId);
    if (!onloadingEntry || onloadingEntry.isReverted) return;

    const materialToUpdate = materials.find(m => m.name === onloadingEntry.paperType);
    if (materialToUpdate) {
        const measurement = measurements.find(m => m.name === materialToUpdate.type);
        const sheetsPerUnit = measurement ? measurement.sheetsPerUnit : 1;
        const totalSheets = (onloadingEntry.unitQuantity * sheetsPerUnit) + onloadingEntry.extraSheets;
        
        // Subtract the stock
        updateMaterialStock(materialToUpdate._id, -totalSheets);
    }
    
    // Mark as reverted
    setOnloadings(prev => prev.map(o => o.id === onloadingId ? { ...o, isReverted: true } : o));
  };

  const updateMaterialStock = (materialId: string, stockChange: number) => {
      setMaterials(prev => prev.map(m => {
        if (m._id === materialId) {
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

  const saveMeasurement = async (measurement: Omit<Measurement, '_id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/measurement/create-measurement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(measurement),
      });
      const result = await response.json();
      if (result.success) {
        fetchMeasurements(); // Refresh data
        toast({
            title: "Success",
            description: result.message,
            variant: 'success',
        });
      } else {
        toast({
            title: "Error",
            description: result.message || "Failed to save measurement.",
            variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to save measurement:", error);
      toast({
            title: "Network Error",
            description: "Could not save measurement. Please check your connection.",
            variant: "destructive",
        });
    }
  };

  const updateMeasurement = async (measurement: Measurement) => {
    try {
      const response = await fetch(`${API_BASE_URL}/measurement/update-measurement/${measurement._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: measurement.name, sheetsPerUnit: measurement.sheetsPerUnit }),
      });
      const result = await response.json();
      if(result.success) {
        fetchMeasurements(); // Refresh data
        toast({
            title: "Success",
            description: result.message,
            variant: 'success',
        });
      } else {
        toast({
            title: "Error",
            description: result.message || "Failed to update measurement.",
            variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update measurement:", error);
      toast({
        title: "Network Error",
        description: "Could not update measurement. Please check your connection.",
        variant: "destructive",
    });
    }
  }

  const saveOrder = (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      status: 'Pending',
      date: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const markOrderAsComplete = (orderId: string, materialsUsed: NewMaterialsUsed[]) => {
     const materialsUsedWithDetails: MaterialsUsed[] = materialsUsed.map(mu => {
      const material = materials.find(m => m._id === mu.materialId);
      const measurement = measurements.find(m => m.name === material?.type);
      const sheetsPerUnit = measurement?.sheetsPerUnit || 1;
      const totalSheetsUsed = (mu.unitQuantity * sheetsPerUnit) + mu.extraSheets;

      // Deduct stock
      updateMaterialStock(mu.materialId, -totalSheetsUsed);

      return {
        ...mu,
        materialName: material?.name || 'Unknown',
        sheetsUsed: totalSheetsUsed,
      };
    });

    // Then, update the order status
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Completed', materialsUsed: materialsUsedWithDetails };
      }
      return o;
    }));
  };

  const markOrderAsDiscarded = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Discarded' } : o));
  };

  const value = { 
      materials, 
      onloadings,
      measurements,
      orders,
      saveMaterial, 
      deleteMaterial,
      saveOnloading,
      revertOnloading,
      updateMaterialStock,
      saveMeasurement,
      updateMeasurement,
      saveOrder,
      markOrderAsComplete,
      markOrderAsDiscarded,
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
