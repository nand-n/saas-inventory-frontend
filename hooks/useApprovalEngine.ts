import { useState, useEffect, useCallback } from 'react';
import {
  ApprovalRequest,
  ApprovalAction,
  ApprovalStatus,
  ActionType,
} from '../types/approval';

interface UseApprovalEngineProps {
  entityType: string;
  entityId: string;
  currentUserId: string;
  onStateChange?: (newStatus: ApprovalStatus) => void;
}

export function useApprovalEngine({
  entityType,
  entityId,
  currentUserId,
  onStateChange,
}: UseApprovalEngineProps) {
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest | null>(null);
  const [actions, setActions] = useState<ApprovalAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovalRequest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/approvals?entityType=${entityType}&entityId=${entityId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch approval request');
      }

      const data = await response.json();
      setApprovalRequest(data.approvalRequest);
      setActions(data.actions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    fetchApprovalRequest();
  }, [fetchApprovalRequest]);

  const performAction = async (
    actionType: ActionType,
    stepId: string,
    options?: { comment?: string; delegatedTo?: string }
  ) => {
    if (!approvalRequest) return;

    try {
      const response = await fetch('/api/approvals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalRequestId: approvalRequest.id,
          stepId,
          actionType,
          performedBy: currentUserId,
          comment: options?.comment,
          delegatedTo: options?.delegatedTo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform action');
      }

      const result = await response.json();
      setApprovalRequest(result.approvalRequest);
      setActions(result.actions);

      if (onStateChange && result.approvalRequest.status !== approvalRequest.status) {
        onStateChange(result.approvalRequest.status);
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const canUserApprove = (stepId: string): boolean => {
    if (!approvalRequest) return false;

    const step = approvalRequest.workflow.steps.find((s) => s.id === stepId);
    if (!step) return false;

    if (step.requiredUserId && step.requiredUserId !== currentUserId) {
      return false;
    }

    if (step.allowedUsers && !step.allowedUsers.includes(currentUserId)) {
      return false;
    }

    return true;
  };

  const getCurrentStep = () => {
    if (!approvalRequest) return null;
    return approvalRequest.workflow.steps[approvalRequest.currentStepIndex];
  };

  const getProgress = () => {
    if (!approvalRequest) return 0;
    const total = approvalRequest.workflow.steps.length;
    const completed = approvalRequest.workflow.steps.filter(
      (s) => s.status === 'approved'
    ).length;
    return (completed / total) * 100;
  };

  return {
    approvalRequest,
    actions,
    loading,
    error,
    performAction,
    canUserApprove,
    getCurrentStep,
    getProgress,
    refresh: fetchApprovalRequest,
  };
}
