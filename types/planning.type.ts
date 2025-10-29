// export enum PlanningStatus {
//   DRAFT = 'DRAFT',
//   REQUESTED = 'REQUESTED',
//   APPROVED = 'APPROVED',
//   REJECTED = 'REJECTED',
// }

// export interface Planning {
//   id: string;
//   name: string;
  
//   // Inputs
//   forecastMonthlyDemand: number;
//   forecastHorizonMonths: number;
//   currentOnHand: number;
//   leadTimeWeeks: number;
//   desiredServiceLevel: number;
//   shelfLifeMonths: number;
//   minRemainingShelfLifeMonths: number;
//   moq?: number;
//   packagingMultiple?: number;
//   safetyFactor: number;
  
//   // Computed outputs
//   totalDemand?: number;
//   weeklyDemand?: number;
//   safetyStock?: number;
//   rawOrderQuantity?: number;
//   orderQuantityRounded?: number;
//   decidedOrderQuantity?: number;
//   plannedShipmentBatches?: number;
//   perBatchQuantity?: number;
  
//   // Approval workflow
//   status: PlanningStatus;
//   approvalRequestedBy?: string;
//   approvalRequestedAt?: string;
//   approvedBy?: string;
//   approvedAt?: string;
//   approvalRemarks?: string;
  
//   // Timestamps
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreatePlanningDto {
//   name: string;
//   forecastMonthlyDemand: number;
//   forecastHorizonMonths?: number;
//   currentOnHand: number;
//   leadTimeWeeks?: number;
//   desiredServiceLevel?: number;
//   shelfLifeMonths?: number;
//   minRemainingShelfLifeMonths?: number;
//   moq?: number;
//   packagingMultiple?: number;
//   safetyFactor?: number;
// }

// export interface UpdatePlanningDto extends Partial<CreatePlanningDto> {}

// export interface ApprovePlanningDto {
//   status: PlanningStatus;
//   approvedBy: string;
//   approvalRemarks?: string;
// }


// -----------------------------------------
// 🔹 Enums
// -----------------------------------------
export enum PlanningStatus {
  DRAFT = 'DRAFT',
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum PlanningType {
  SUPPLY = 'SUPPLY',
  RESOURCE = 'RESOURCE',
  TIME = 'TIME',
  CAPACITY = 'CAPACITY',
}

// -----------------------------------------
// 🔹 Interfaces
// -----------------------------------------

export interface Planning {
  id: string;
  name: string;
  planningType: PlanningType;

  // -----------------------------
  // 🔹 SUPPLY PLANNING INPUTS
  // -----------------------------
  forecastMonthlyDemand?: number;
  forecastHorizonMonths?: number;
  currentOnHand?: number;
  leadTimeWeeks?: number;
  desiredServiceLevel?: number;
  shelfLifeMonths?: number;
  minRemainingShelfLifeMonths?: number;
  moq?: number;
  packagingMultiple?: number;
  safetyFactor?: number;

  // -----------------------------
  // 🔹 COMPUTED OUTPUTS
  // -----------------------------
  totalDemand?: number;
  weeklyDemand?: number;
  safetyStock?: number;
  rawOrderQuantity?: number;
  orderQuantityRounded?: number;
  decidedOrderQuantity?: number;
  plannedShipmentBatches?: number;
  perBatchQuantity?: number;

  // -----------------------------
  // 🔹 RESOURCE PLANNING SECTION
  // -----------------------------
  resources?: {
    manpower?: number;
    equipment?: string[];
    budget?: number;
    departmentsInvolved?: string[];
  };

  // -----------------------------
  // 🔹 TIME PLANNING SECTION
  // -----------------------------
  timeline?: {
    startDate?: string;
    endDate?: string;
    milestones?: {
      name: string;
      targetDate: string;
      status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    }[];
  };

  // -----------------------------
  // 🔹 CAPACITY PLANNING SECTION
  // -----------------------------
  capacity?: {
    productionLines?: number;
    maxOutputPerDay?: number;
    currentUtilization?: number;
    bottlenecks?: string[];
  };

  // -----------------------------
  // 🔹 APPROVAL WORKFLOW
  // -----------------------------
  status: PlanningStatus;
  approvalRequestedBy?: string;
  approvalRequestedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalRemarks?: string;

  // -----------------------------
  // 🔹 TIMESTAMPS
  // -----------------------------
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------
// 🔹 DTOs
// -----------------------------------------
export interface CreatePlanningDto {
  name: string;
  planningType?: PlanningType;

  // Supply fields
  forecastMonthlyDemand: number;
  forecastHorizonMonths?: number;
  currentOnHand: number;
  leadTimeWeeks?: number;
  desiredServiceLevel?: number;
  shelfLifeMonths?: number;
  minRemainingShelfLifeMonths?: number;
  moq?: number;
  packagingMultiple?: number;
  safetyFactor?: number;

  // Optional for other planning types
  resources?: {
    manpower?: number;
    equipment?: string[];
    budget?: number;
    departmentsInvolved?: string[];
  };

  timeline?: {
    startDate?: string;
    endDate?: string;
    milestones?: {
      name: string;
      targetDate: string;
      status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    }[];
  };

  capacity?: {
    productionLines?: number;
    maxOutputPerDay?: number;
    currentUtilization?: number;
    bottlenecks?: string[];
  };
}

export interface UpdatePlanningDto extends Partial<CreatePlanningDto> {}

export interface ApprovePlanningDto {
  status: PlanningStatus;
  approvedBy: string;
  approvalRemarks?: string;
}
