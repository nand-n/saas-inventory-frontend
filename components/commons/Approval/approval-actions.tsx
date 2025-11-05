import { useState } from 'react';
import { Check, X, UserPlus, MessageSquare, AlertCircle } from 'lucide-react';
import { ActionType, CustomAction } from '@/types/approval';

interface ApprovalActionsProps {
  stepId: string;
  canApprove: boolean;
  onAction: (actionType: ActionType, options?: { comment?: string; delegatedTo?: string }) => Promise<void>;
  customActions?: CustomAction[];
  className?: string;
}

export function ApprovalActions({
  stepId,
  canApprove,
  onAction,
  customActions = [],
  className = '',
}: ApprovalActionsProps) {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [comment, setComment] = useState('');
  const [delegateUserId, setDelegateUserId] = useState('');
  const [actionType, setActionType] = useState<ActionType>('approve');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setActionType('approve');
    setShowCommentModal(true);
  };

  const handleReject = async () => {
    setActionType('reject');
    setShowCommentModal(true);
  };

  const handleDelegate = () => {
    setShowDelegateModal(true);
  };

  const handleSubmitComment = async () => {
    try {
      setLoading(true);
      setError(null);
      await onAction(actionType, { comment: comment || undefined });
      setShowCommentModal(false);
      setComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDelegate = async () => {
    if (!delegateUserId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onAction('delegate', { delegatedTo: delegateUserId });
      setShowDelegateModal(false);
      setDelegateUserId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delegation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!canApprove) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">
            You don't have permission to approve this step
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleApprove}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Check className="w-4 h-4" />
          Approve
        </button>

        <button
          onClick={handleReject}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          <X className="w-4 h-4" />
          Reject
        </button>

        <button
          onClick={handleDelegate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Delegate
        </button>

        {customActions.map((action, index) => (
          <button
            key={index}
            onClick={() => action.action(stepId, stepId)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm ${
              action.variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : action.variant === 'secondary'
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Add a comment..."
              />
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setComment('');
                  setError(null);
                }}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                disabled={loading}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loading ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelegateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Delegate Approval</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delegate to User ID
              </label>
              <input
                type="text"
                value={delegateUserId}
                onChange={(e) => setDelegateUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter user ID..."
              />
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDelegateModal(false);
                  setDelegateUserId('');
                  setError(null);
                }}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDelegate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? 'Delegating...' : 'Delegate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
