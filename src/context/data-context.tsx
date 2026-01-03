
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { initialMaterials, initialOnloadings, initialJobOrders, initialWorkOrders, initialMeasurements, Material, PaperOnboarding, Measurement, WorkOrder, WorkOrderStatus, MaterialsUsed, APIMaterial, Job, WorkOrderPriority, JobItem } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type NewMaterialsUsed = Omit<MaterialsUsed, 'materialName'>;
type NewMaterial = Omit<Material, '_id' | 'currentStock' | 'maxStock' | 'reorderThreshold' | 'lastUpdated'>;

interface DataContextType {
  materials: Material[];
  onloadings: PaperOnboarding[];
  measurements: Measurement[];
  jobOrders: Job[];
  workOrders: WorkOrder[];
  saveMaterial: (materialData: (Omit<Material, '_id' | 'currentStock' | 'maxStock' | 'reorderThreshold' | 'lastUpdated' | 'type'> & { measurementId?: string }) | (Material & { measurementId?: string })) => void;
  deleteMaterial: (id: string) => void;
  saveOnloading: (onloadingData: Omit<PaperOnboarding, 'id' | 'date' | 'isReverted' | 'paperType'> & {papers: {paperType: string, unitQuantity: number, amount: number }[]}) => void;
  revertOnloading: (onloadingId: string) => void;
  updateMaterialStock: (materialId: string, stockChange: number) => void;
  saveMeasurement: (measurement: Omit<Measurement, '_id'>) => void;
  updateMeasurement: (measurement: Measurement) => void;
  deleteMeasurement: (id: string) => void;
  saveJobOrder: (jobData: Job | Omit<Job, 'date'>) => void;
  deleteJobOrder: (jobId: string) => void;
  saveWorkOrder: (orderData: WorkOrder | Omit<WorkOrder, 'id' | 'status' | 'date'>) => void;
  deleteWorkOrder: (orderId: string) => void;
  markWorkOrderAsComplete: (orderId: string, materialsUsed: { materialId: string; quantity: number }[]) => void;
  revertWorkOrderCompletion: (orderId: string) => void;
  updateWorkOrderStatus: (orderId: string, status: WorkOrderStatus) => void;
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
        totalSheets: apiMaterial.totalSheets,
        currentStock: apiMaterial.totalSheets,
        maxStock: 10000, // Placeholder
        reorderThreshold: 10, // Placeholder
        lastUpdated: apiMaterial.lastUpdated || new Date().toISOString(),
    };
};


export function DataProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [onloadings, setOnloadings] = useState<PaperOnboarding[]>(initialOnloadings);
  const [measurements, setMeasurements] = useState<Measurement[]>(initialMeasurements);
  const [jobOrders, setJobOrders] = useState<Job[]>(initialJobOrders);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);

  const { toast } = useToast();

  const fetchMeasurements = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/measurement/get-measurement`);
      const data = await response.json();
      if (data.success) {
        setMeasurements(data.measurements);
      } else {
          console.error("API error fetching measurements:", data.message);
          setMeasurements(initialMeasurements); 
      }
    } catch (error) {
      console.error("Failed to fetch measurements:", error);
      setMeasurements(initialMeasurements); 
      toast({
          title: "Error fetching measurements",
          description: "Could not connect to the server. Using mock data.",
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
            setMaterials(initialMaterials);
            toast({
                title: "Error fetching materials",
                description: data.message || "Could not retrieve materials. Using mock data.",
                variant: "destructive"
            });
        }
    } catch (error) {
        console.error("Failed to fetch materials:", error);
        setMaterials(initialMaterials);
        toast({
            title: "Network Error",
            description: "Could not fetch materials. Using mock data.",
            variant: "destructive"
        });
    }
  }, [toast]);

  useEffect(() => {
    // fetchMeasurements();
    // fetchMaterials();
  }, [fetchMeasurements, fetchMaterials]);

  const saveMaterial = async (materialData: (Omit<Material, '_id' | 'currentStock' | 'maxStock' | 'reorderThreshold' | 'lastUpdated' | 'type'> & { measurementId?: string }) | (Material & { measurementId?: string })) => {
    const isUpdate = '_id' in materialData && materialData._id;
    const url = isUpdate
      ? `${API_BASE_URL}/material/update-material/${materialData._id}`
      : `${API_BASE_URL}/material/add-material`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(materialData),
        });
        const result = await response.json();
        if (result.success) {
            toast({ title: "Success", description: `Material ${isUpdate ? 'updated' : 'created'} successfully.`, variant: 'success' });
            fetchMaterials(); // Refetch materials list
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    } catch (error) {
        toast({ title: "Network Error", description: "Could not save material.", variant: 'destructive' });
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/material/delete-material/${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            toast({ title: "Success", description: "Material deleted successfully.", variant: 'success' });
            fetchMaterials();
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    } catch (error) {
        toast({ title: "Network Error", description: "Could not delete material.", variant: 'destructive' });
    }
  };
  
  const saveOnloading = (onloadingData: Omit<PaperOnboarding, 'id' | 'date'| 'isReverted' | 'paperType'> & {papers: {paperType: string, unitQuantity: number, amount: number }[]}) => {
      const newOnloading: PaperOnboarding = {
        id: `onloading-${Date.now()}`,
        date: new Date().toISOString(),
        supplier: onloadingData.supplier,
        papers: onloadingData.papers,
        isReverted: false,
      };
      setOnloadings((prev) => [newOnloading, ...prev]);
      
      onloadingData.papers.forEach(paper => {
        const materialToUpdate = materials.find(m => m.name === paper.paperType);
        if (materialToUpdate) {
            const measurement = measurements.find(m => m.name === materialToUpdate.type);
            const sheetsPerUnit = measurement ? measurement.sheetsPerUnit : 1;
            const totalSheets = paper.unitQuantity * sheetsPerUnit;
            updateMaterialStock(materialToUpdate._id, totalSheets);
        }
      });
  };

  const revertOnloading = (onloadingId: string) => {
    const onloadingEntry = onloadings.find(o => o.id === onloadingId);
    if (!onloadingEntry || onloadingEntry.isReverted) return;
    
    onloadingEntry.papers.forEach(paper => {
      const materialToUpdate = materials.find(m => m.name === paper.paperType);
      if (materialToUpdate) {
          const measurement = measurements.find(m => m.name === materialToUpdate.type);
          const sheetsPerUnit = measurement ? measurement.sheetsPerUnit : 1;
          const totalSheets = paper.unitQuantity * sheetsPerUnit;
          updateMaterialStock(materialToUpdate._id, -totalSheets);
      }
    });
    
    setOnloadings(prev => prev.map(o => o.id === onloadingId ? { ...o, isReverted: true } : o));
  };

  const updateMaterialStock = (materialId: string, stockChange: number) => {
      setMaterials(prev => prev.map(m => {
        if (m._id === materialId) {
          const newStock = m.currentStock + stockChange;
          return { 
            ...m, 
            currentStock: Math.max(0, newStock),
            lastUpdated: new Date().toISOString() 
          };
        }
        return m;
      }));
  }

  const saveMeasurement = async (measurement: Omit<Measurement, '_id'>) => {
    try {
        const response = await fetch(`${API_BASE_URL}/measurement/add-measurement`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(measurement),
        });
        const result = await response.json();
        if (result.success) {
            toast({ title: "Success", description: "Measurement saved successfully.", variant: 'success' });
            fetchMeasurements();
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    } catch (error) {
        toast({ title: "Network Error", description: "Could not save measurement.", variant: 'destructive' });
    }
  };

  const updateMeasurement = async (measurement: Measurement) => {
    try {
        const response = await fetch(`${API_BASE_URL}/measurement/update-measurement/${measurement._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(measurement),
        });
        const result = await response.json();
        if (result.success) {
            toast({ title: "Success", description: "Measurement updated successfully.", variant: 'success' });
            fetchMeasurements();
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    } catch (error) {
        toast({ title: "Network Error", description: "Could not update measurement.", variant: 'destructive' });
    }
  }

  const deleteMeasurement = async (id: string) => {
      try {
          const response = await fetch(`${API_BASE_URL}/measurement/delete-measurement/${id}`, {
              method: 'DELETE',
          });
          const result = await response.json();
          if (result.success) {
              toast({ title: "Success", description: "Measurement deleted successfully.", variant: 'success' });
              fetchMeasurements();
          } else {
              toast({ title: "Error", description: result.message, variant: 'destructive' });
          }
      } catch (error) {
          toast({ title: "Network Error", description: "Could not delete measurement.", variant: 'destructive' });
      }
  };

  const saveJobOrder = (jobData: Job | Omit<Job, 'date'>) => {
    const isUpdate = 'id' in jobData && jobData.id;
    if (isUpdate) {
      setJobOrders(prev => prev.map(j => j.id === jobData.id ? { ...j, ...jobData, date: j.date } as Job : j));
    } else {
      const newJob: Job = {
        ...jobData as Omit<Job, 'date'>,
        date: new Date().toISOString(),
      };
      setJobOrders(prev => [newJob, ...prev]);
    }
  };

  const deleteJobOrder = (jobId: string) => {
    setJobOrders(prev => prev.filter(j => j.id !== jobId));
  };
  
  const saveWorkOrder = (orderData: WorkOrder | Omit<WorkOrder, 'id' | 'status' | 'date'>) => {
    const isUpdate = 'id' in orderData && orderData.id;
    if (isUpdate) {
        setWorkOrders(prev => prev.map(wo => wo.id === orderData.id ? { ...wo, ...orderData, date: wo.date } as WorkOrder : wo));
    } else {
        const newWorkOrder: WorkOrder = {
          ...orderData as Omit<WorkOrder, 'id' | 'status' | 'date'>,
          id: `wo-${Date.now()}`,
          status: 'Pending',
          date: new Date().toISOString(),
        };
        setWorkOrders(prev => [newWorkOrder, ...prev]);
    }
  };
  
  const deleteWorkOrder = (orderId: string) => {
    setWorkOrders(prev => prev.filter(wo => wo.id !== orderId));
  };

  const markWorkOrderAsComplete = (orderId: string, materialsUsed: { materialId: string; quantity: number }[]) => {
     const materialsUsedWithDetails = materialsUsed.map(mu => {
      const material = materials.find(m => m._id === mu.materialId);
      
      // Deduct stock
      updateMaterialStock(mu.materialId, -mu.quantity);

      return {
        ...mu,
        materialName: material?.name || 'Unknown',
      };
    });

    // Then, update the order status
    setWorkOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Completed', materialsUsed: materialsUsedWithDetails };
      }
      return o;
    }));
  };
  
  const revertWorkOrderCompletion = (orderId: string) => {
    const orderToRevert = workOrders.find(o => o.id === orderId);
    if (!orderToRevert || !orderToRevert.materialsUsed) return;

    // Add stock back
    orderToRevert.materialsUsed.forEach(mu => {
      updateMaterialStock(mu.materialId, mu.quantity);
    });

    // Revert status and clear materials used
    setWorkOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'In Progress', materialsUsed: [] };
      }
      return o;
    }));

    toast({
      title: "Success",
      description: "Work order reverted and stock updated.",
      variant: 'success'
    });
  };

  const updateWorkOrderStatus = (orderId: string, status: WorkOrderStatus) => {
      setWorkOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const value = { 
      materials, 
      onloadings,
      measurements,
      jobOrders,
      workOrders,
      saveMaterial, 
      deleteMaterial,
      saveOnloading,
      revertOnloading,
      updateMaterialStock,
      saveMeasurement,
      updateMeasurement,
      deleteMeasurement,
      saveJobOrder,
      deleteJobOrder,
      saveWorkOrder,
      deleteWorkOrder,
      markWorkOrderAsComplete,
      revertWorkOrderCompletion,
      updateWorkOrderStatus,
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
