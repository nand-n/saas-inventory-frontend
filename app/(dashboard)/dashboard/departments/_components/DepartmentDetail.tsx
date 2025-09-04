"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Users,
  Building,
  User,
  DollarSign,
  MapPin,
  FileText,
} from "lucide-react";
import { Department } from "@/types/department.types";

interface DepartmentDetailProps {
  department: Department;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({
  department,
  open,
  onOpenChange,
  onEdit,
}) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {department.name}
            </DialogTitle>
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Code
                  </label>
                  <p className="text-sm">{department.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <Badge
                    variant={department.isActive ? "default" : "secondary"}
                  >
                    {department.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created
                  </label>
                  <p className="text-sm">
                    {formatDate(department.createdAt ?? "")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">
                    {formatDate(department.updatedAt ?? "")}
                  </p>
                </div>
              </div>

              {department.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Description
                  </label>
                  <p className="text-sm">{department.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Budget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location & Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Location
                  </label>
                  <p className="text-sm">
                    {department.location || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Budget
                  </label>
                  <p className="text-sm">{formatCurrency(department.budget)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organizational Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Organizational Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Branch
                  </label>
                  <p className="text-sm">
                    {department.branch?.name || "Not assigned"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Parent Department
                  </label>
                  <p className="text-sm">
                    {department.parentDepartment?.name ||
                      "No parent department"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Manager
                  </label>
                  <p className="text-sm">
                    {department.manager
                      ? `${department.manager.firstName} ${department.manager.lastName}`
                      : "No manager assigned"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Sub-departments
                  </label>
                  <p className="text-sm">
                    {department.subDepartments?.length || 0} sub-departments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Employees ({department.employees?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {department.employees && department.employees.length > 0 ? (
                <div className="space-y-2">
                  {department.employees.slice(0, 5).map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {employee.jobTitle}
                        </p>
                      </div>
                      <Badge variant="outline">{employee.status}</Badge>
                    </div>
                  ))}
                  {department.employees.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{department.employees.length - 5} more employees
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  No employees assigned to this department
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentDetail;
