'use client';
import React from 'react';
import { date } from 'zod';

export type APIMaterial = {
  _id: string;
  name: string;
  measurementId: {
    _id:string;
    name: string;
    sheetsPerUnit: number;
  } | null; // Can be null
  unitQuantity?: number;
  extraSheets?: number;
  totalSheets: number;
  lastUpdated?: string;
  __v?: number;
}

export type Material = {
  _id: string;
  name: string;
  type?: string; // Will be 'N/A' if measurementId is null
  measurement : string;
  unitQuantity: number;
  extraSheets: number;
  currentStock?: number;
  maxStock?: number;
  reorderThreshold?: number;
  lastUpdated?: string;
  thresholdUnits?: number
};

export type QualityStatus = 'Good' | 'Low' | 'Very Low';
export type LiveStatus = 'Normal' | 'Near Low' | 'Low';

export type UserRole = 'leadership' | 'admin' | 'technical';

type UserRoleContextType = {
  role: UserRole;
  isAdmin: boolean;
  isLeadership: boolean;
  isTechnical: boolean;
};

export const UserRoleContext = React.createContext<UserRoleContextType>({
  role: 'technical',
  isAdmin: false,
  isLeadership: false,
  isTechnical: true,
});

export type PaperOnboarding = {
  _id: string;
  createdAt: string;
  supplier: string;
  items: {
    paperType: string;
    unitQuantity: number;
    pricePerUnit: number;
  }[],
  isReversal?: boolean;
};

export type Measurement = {
  _id: string;
  name: string;
  sheetsPerUnit: number;
  numberOfMaterials : number;
};

export type WorkOrderStatus = 'pending' | 'in progress' | 'completed';
export type WorkOrderPriority = 'low'| 'medium'  | 'high';

export type MaterialsUsed = {
  materialId: string;
  materialName: string;
  quantity: number;
};

export type JobItem = {
  name: string;
  quantity: number;
};

export type Job = {
  _id: string;
  job_id: string;
  department: string;
  createdAt: String | Date;
  tasks: JobItem[];
__v?: number;
numberOfWorkOrders?: number;
id?: string;
}

export type WorkOrder = {
  _id: string;
  job: string;
  tasks: JobItem[];
  description?: string;
  priority: WorkOrderPriority ;
  status: WorkOrderStatus;
  createdAt: string | Date;
  deliveryDate?: Date | null
  materialsUsed?: MaterialsUsed[];
  __v? : number
};

export type StockLedgerEntry = {
    id: string;
    jobId: string; // Job Order ID or Supplier Name
    workOrderId?: string;
    type: "WORK_ORDER" | "ONBOARDING" | "ONBOARDING_REVERSAL" | "WORK_ORDER_REVERSAL";
    unitQuantity: number;
    extraSheets: number;
    changeInSheets: number;
    unitPrice: number;
    totalPrice: number;
    stockBefore: { units: number; extraSheets: number };
    stockAfter: { units: number; extraSheets: number };
    date: string;
};
