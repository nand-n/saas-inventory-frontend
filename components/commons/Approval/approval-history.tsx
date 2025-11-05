import { ActionType, ApprovalAction } from '@/types/approval';
import { Check, X, UserPlus, MessageSquare, Clock } from 'lucide-react';

interface ApprovalHistoryProps {
  actions: ApprovalAction[];
  className?: string;
}

export function ApprovalHistory({ actions, className = '' }: ApprovalHistoryProps) {
  const getActionIcon = (actionType: ActionType) => {
    switch (actionType) {
      case 'approve':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'reject':
        return <X className="w-5 h-5 text-red-600" />;
      case 'delegate':
        return <UserPlus className="w-5 h-5 text-blue-600" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
      case 'request_changes':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionColor = (actionType: ActionType): string => {
    switch (actionType) {
      case 'approve':
        return 'bg-green-50 border-green-200';
      case 'reject':
        return 'bg-red-50 border-red-200';
      case 'delegate':
        return 'bg-blue-50 border-blue-200';
      case 'comment':
        return 'bg-gray-50 border-gray-200';
      case 'request_changes':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getActionLabel = (actionType: ActionType): string => {
    switch (actionType) {
      case 'approve':
        return 'Approved';
      case 'reject':
        return 'Rejected';
      case 'delegate':
        return 'Delegated';
      case 'comment':
        return 'Commented';
      case 'request_changes':
        return 'Requested Changes';
      default:
        return actionType;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (actions.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 text-center ${className}`}>
        <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">No actions yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>

      <div className="space-y-3">
        {actions
          .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
          .map((action) => (
            <div
              key={action.id}
              className={`border rounded-lg p-4 ${getActionColor(action.actionType)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{getActionIcon(action.actionType)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {getActionLabel(action.actionType)}
                    </p>
                    <p className="text-xs text-gray-500 flex-shrink-0">
                      {formatDate(action.performedAt)}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mb-1">by {action.performedBy}</p>

                  {action.comment && (
                    <div className="mt-2 bg-white bg-opacity-50 rounded p-2">
                      <p className="text-sm text-gray-700">{action.comment}</p>
                    </div>
                  )}

                  {action.delegatedTo && (
                    <div className="mt-2 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-gray-700">
                        Delegated to: <span className="font-medium">{action.delegatedTo}</span>
                      </p>
                    </div>
                  )}

                  {action.metadata && Object.keys(action.metadata).length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      <details>
                        <summary className="cursor-pointer hover:text-gray-700">
                          Additional details
                        </summary>
                        <pre className="mt-2 bg-white bg-opacity-50 rounded p-2 overflow-x-auto">
                          {JSON.stringify(action.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
