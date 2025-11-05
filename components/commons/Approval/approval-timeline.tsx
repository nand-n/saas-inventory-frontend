import { ApprovalStep } from '@/types/approval';
import { Check, X, Clock, Circle } from 'lucide-react';

interface ApprovalTimelineProps {
  steps: ApprovalStep[];
  currentStepIndex: number;
  className?: string;
}

export function ApprovalTimeline({
  steps,
  currentStepIndex,
  className = '',
}: ApprovalTimelineProps) {
  const getStepIcon = (step: ApprovalStep, index: number) => {
    if (step.status === 'approved') {
      return <Check className="w-5 h-5 text-white" />;
    }
    if (step.status === 'rejected') {
      return <X className="w-5 h-5 text-white" />;
    }
    if (index === currentStepIndex) {
      return <Clock className="w-5 h-5 text-white" />;
    }
    return <Circle className="w-5 h-5 text-white" />;
  };

  const getStepColor = (step: ApprovalStep, index: number): string => {
    if (step.status === 'approved') return 'bg-green-600';
    if (step.status === 'rejected') return 'bg-red-600';
    if (index === currentStepIndex) return 'bg-blue-600';
    return 'bg-gray-300';
  };

  const getStepBorderColor = (step: ApprovalStep, index: number): string => {
    if (step.status === 'approved') return 'border-green-600';
    if (step.status === 'rejected') return 'border-red-600';
    if (index === currentStepIndex) return 'border-blue-600';
    return 'border-gray-300';
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <div className="flex justify-between items-start">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepColor(
                    step,
                    index
                  )} transition-all duration-300 shadow-lg z-10 relative`}
                >
                  {getStepIcon(step, index)}
                </div>

                <div className="mt-3 text-center">
                  <p className="text-sm font-medium text-gray-900">{step.name}</p>
                  {step.completedAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(step.completedAt).toLocaleDateString()}
                    </p>
                  )}
                  {step.completedBy && (
                    <p className="text-xs text-gray-500">by {step.completedBy}</p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 -z-0">
                  <div
                    className={`h-full transition-all duration-500 ${
                      step.status === 'approved' ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                    style={{
                      width: step.status === 'approved' ? '100%' : '0%',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600" />
              <span className="text-sm text-gray-600">Rejected</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
}
