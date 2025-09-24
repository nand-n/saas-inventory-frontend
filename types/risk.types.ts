// Risk domain types aligned with backend entity

export enum RiskSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum RiskStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  MITIGATED = "mitigated",
  CLOSED = "closed",
}

// Base model fields commonly provided by backend BaseModel
export interface BaseModel {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Risk extends BaseModel {
  title: string;
  description?: string | null;
  severity: RiskSeverity;
  likelihood: number; // 0..1
  impact: number; // 0..1
  riskScore?: number | null;
  status: RiskStatus;
  branchId?: string | null;
  shipmentId?: string | null;
  mitigationPlan?: string | null;
  resolvedAt?: string | Date | null;
}

export type CreateRiskRequest = {
  title: string;
  description?: string | null;
  severity?: RiskSeverity;
  likelihood?: number;
  impact?: number;
  riskScore?: number | null;
  status?: RiskStatus;
  branchId?: string | null;
  shipmentId?: string | null;
  mitigationPlan?: string | null;
  resolvedAt?: string | Date | null;
};

export type UpdateRiskRequest = Partial<CreateRiskRequest>;

export type RiskFilters = {
  search?: string;
  severity?: RiskSeverity | RiskSeverity[];
  status?: RiskStatus | RiskStatus[];
  branchId?: string;
  shipmentId?: string;
  createdFrom?: string; // ISO date string
  createdTo?: string; // ISO date string
};


