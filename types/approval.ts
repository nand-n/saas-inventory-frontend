export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'in_progress';
export type ActionType = 'approve' | 'reject' | 'delegate' | 'comment' | 'request_changes';

export interface ApprovalWorkflow {
  id: string;
  name: string;
  entityType: string;
  steps: ApprovalStep[];
  isParallel?: boolean;
  autoAdvance?: boolean;
}

export interface ApprovalStep {
  id: string;
  name: string;
  order: number;
  requiredRole?: string;
  requiredUserId?: string;
  allowedRoles?: string[];
  allowedUsers?: string[];
  conditions?: ApprovalCondition[];
  status: ApprovalStatus;
  completedAt?: string;
  completedBy?: string;
}

export interface ApprovalCondition {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';
  value: string | number | boolean | string[];
}

export interface ApprovalRequest {
  id: string;
  entityType: string;
  entityId: string;
  workflowId: string;
  workflow: ApprovalWorkflow;
  currentStepIndex: number;
  status: ApprovalStatus;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ApprovalAction {
  id: string;
  approvalRequestId: string;
  stepId: string;
  actionType: ActionType;
  performedBy: string;
  performedAt: string;
  comment?: string;
  delegatedTo?: string;
  metadata?: Record<string, unknown>;
}

export interface ApprovalComment {
  id: string;
  approvalRequestId: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface ApprovalWidgetProps {
  entityType: string;
  entityId: string;
  currentUserId: string;
  currentUserRole: string;
  onApproved?: (requestId: string, stepId: string) => void;
  onRejected?: (requestId: string, stepId: string, reason?: string) => void;
  onDelegated?: (requestId: string, stepId: string, delegatedTo: string) => void;
  onStateChange?: (newStatus: ApprovalStatus) => void;
  customActions?: CustomAction[];
  className?: string;
}

export interface CustomAction {
  label: string;
  action: (requestId: string, stepId: string) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}
