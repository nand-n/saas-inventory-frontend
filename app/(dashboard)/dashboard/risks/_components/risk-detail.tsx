"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Risk, RiskSeverity, RiskStatus } from "@/types/risk.types";
import dayjs from "dayjs";

interface RiskDetailProps {
  risk: Risk;
  onEdit: (risk: Risk) => void;
  onDelete: (risk: Risk) => void;
  onView: (risk: Risk) => void;
}

const RiskDetail: React.FC<RiskDetailProps> = ({
  risk,
  onEdit,
  onDelete,
  onView,
}) => {
  const getSeverityColor = (severity: RiskSeverity) => {
    switch (severity) {
      case RiskSeverity.LOW:
        return "bg-green-100 text-green-800 border-green-200";
      case RiskSeverity.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case RiskSeverity.HIGH:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case RiskSeverity.CRITICAL:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: RiskStatus) => {
    switch (status) {
      case RiskStatus.OPEN:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case RiskStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case RiskStatus.MITIGATED:
        return "bg-green-100 text-green-800 border-green-200";
      case RiskStatus.CLOSED:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateRiskScore = () => {
    return (risk.likelihood * risk.impact * 100).toFixed(1);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 75) return "Critical";
    if (score >= 50) return "High";
    if (score >= 25) return "Medium";
    return "Low";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {risk.title}
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Badge className={getSeverityColor(risk.severity)}>
                {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
              </Badge>
              <Badge className={getStatusColor(risk.status)}>
                {risk.status.replace("_", " ").charAt(0).toUpperCase() +
                  risk.status.replace("_", " ").slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(risk)}
              className="text-blue-600 hover:text-blue-700"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(risk)}
              className="text-green-600 hover:text-green-700"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(risk)}
              className="text-red-600 hover:text-red-700"
            >
              <TrashIcon className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {risk.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Description
            </h4>
            <p className="text-sm text-gray-600">{risk.description}</p>
          </div>
        )}

        {/* Risk Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Risk Score
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {calculateRiskScore()}
              </span>
              <Badge variant="outline" className="text-xs">
                {getRiskLevel(parseFloat(calculateRiskScore()))}
              </Badge>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Likelihood
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {(risk.likelihood * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Impact</h4>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {(risk.impact * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risk.branchId && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Branch ID
              </h4>
              <p className="text-sm text-gray-600">{risk.branchId}</p>
            </div>
          )}

          {risk.shipmentId && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Shipment ID
              </h4>
              <p className="text-sm text-gray-600">{risk.shipmentId}</p>
            </div>
          )}
        </div>

        {/* Mitigation Plan */}
        {risk.mitigationPlan && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Mitigation Plan
            </h4>
            <p className="text-sm text-gray-600">{risk.mitigationPlan}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Created</h4>
            <p className="text-sm text-gray-600">
              {dayjs(risk.createdAt).format("MMM DD, YYYY HH:mm")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Last Updated
            </h4>
            <p className="text-sm text-gray-600">
              {dayjs(risk.updatedAt).format("MMM DD, YYYY HH:mm")}
            </p>
          </div>
        </div>

        {/* Resolution Date */}
        {risk.resolvedAt && (
          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Resolved At
            </h4>
            <p className="text-sm text-gray-600">
              {dayjs(risk.resolvedAt).format("MMM DD, YYYY HH:mm")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskDetail;
