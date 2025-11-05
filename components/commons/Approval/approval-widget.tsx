import { useApprovalEngine } from '@/hooks/useApprovalEngine';
import { ApprovalWidgetProps } from '@/types/approval';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { ApprovalTimeline } from './approval-timeline';
import { ApprovalActions } from './approval-actions';
import { ApprovalHistory } from './approval-history';

export function ApprovalWidget({
  entityType,
  entityId,
  currentUserId,
  currentUserRole,
  onApproved,
  onRejected,
  onDelegated,
  onStateChange,
  customActions = [],
  className = '',
}: ApprovalWidgetProps) {
  const {
    approvalRequest,
    actions,
    loading,
    error,
    performAction,
    canUserApprove,
    getCurrentStep,
    getProgress,
    refresh,
  } = useApprovalEngine({
    entityType,
    entityId,
    currentUserId,
    onStateChange,
  });

  const currentStep = getCurrentStep();
  const progress = getProgress();

  const handleAction = async (
    actionType: 'approve' | 'reject' | 'delegate' | 'comment' | 'request_changes',
    options?: { comment?: string; delegatedTo?: string }
  ) => {
    if (!currentStep) return;

    await performAction(actionType, currentStep.id, options);

    if (actionType === 'approve' && onApproved) {
      onApproved(approvalRequest!.id, currentStep.id);
    } else if (actionType === 'reject' && onRejected) {
      onRejected(approvalRequest!.id, currentStep.id, options?.comment);
    } else if (actionType === 'delegate' && onDelegated && options?.delegatedTo) {
      onDelegated(approvalRequest!.id, currentStep.id, options.delegatedTo);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading approval workflow...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <div className="flex-1">
            <h3 className="font-semibold">Error Loading Approval</h3>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!approvalRequest) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
        <div className="text-center text-gray-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No approval workflow found for this {entityType}</p>
          <p className="text-sm text-gray-500 mt-1">ID: {entityId}</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
          statusColors[approvalRequest.status]
        }`}
      >
        {approvalRequest.status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {approvalRequest.workflow.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {entityType} #{entityId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <button
              onClick={refresh}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% Complete</p>
      </div>

      <div className="p-6">
        <ApprovalTimeline
          steps={approvalRequest.workflow.steps}
          currentStepIndex={approvalRequest.currentStepIndex}
          className="mb-8"
        />

        {currentStep && approvalRequest.status === 'in_progress' && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-1">Current Step</h3>
              <p className="text-blue-700">{currentStep.name}</p>
              {currentStep.requiredRole && (
                <p className="text-sm text-blue-600 mt-2">
                  Required Role: <span className="font-medium">{currentStep.requiredRole}</span>
                </p>
              )}
            </div>

            <ApprovalActions
              stepId={currentStep.id}
              canApprove={canUserApprove(currentStep.id)}
              onAction={handleAction}
              customActions={customActions}
            />
          </div>
        )}

        {approvalRequest.status === 'approved' && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">This request has been fully approved</p>
            </div>
            {approvalRequest.completedAt && (
              <p className="text-sm text-green-700 mt-1">
                Completed on {new Date(approvalRequest.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {approvalRequest.status === 'rejected' && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">This request has been rejected</p>
            </div>
          </div>
        )}

        <ApprovalHistory actions={actions} />
      </div>

      {approvalRequest.metadata && Object.keys(approvalRequest.metadata).length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <details>
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              Request Metadata
            </summary>
            <pre className="mt-3 bg-white rounded-lg p-4 text-xs text-gray-600 overflow-x-auto border border-gray-200">
              {JSON.stringify(approvalRequest.metadata, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
