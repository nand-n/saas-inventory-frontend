import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/hr.types";
import { Users, Search } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface EmployeeSelectionStepProps {
  employees: Employee[];
  selectedEmployees: Employee[];
  onChange: (employees: Employee[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EmployeeSelectionStep({
  employees,
  selectedEmployees,
  onChange,
  onNext,
  onBack,
}: EmployeeSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.employeeNumber} ${emp.jobTitle}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleToggle = (employee: Employee) => {
    const isSelected = selectedEmployees.some((e) => e.id === employee.id);
    if (isSelected) {
      onChange(selectedEmployees.filter((e) => e.id !== employee.id));
    } else {
      onChange([...selectedEmployees, employee]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      onChange([]);
    } else {
      onChange(filteredEmployees);
    }
  };

  const isValid = selectedEmployees.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Select Employees
        </CardTitle>
        <CardDescription>
          Choose the employees to include in this payroll run
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleSelectAll}>
            {selectedEmployees.length === filteredEmployees.length ? "Deselect All" : "Select All"}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {filteredEmployees.length} employee(s) available
          </span>
          <Badge variant="default">
            {selectedEmployees.length} selected
          </Badge>
        </div>

        <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
          {filteredEmployees.map((employee) => {
            const isSelected = selectedEmployees.some((e) => e.id === employee.id);
            return (
              <div
                key={employee.id}
                className={cn(
                  "flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                  isSelected && "bg-primary/5"
                )}
                onClick={() => handleToggle(employee)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleToggle(employee)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {employee.employeeNumber}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {employee.jobTitle} • {employee.department?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(employee.salary ?? 0) || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {employee.employmentType.replace("_", " ")}
                  </p>
                </div>
              </div>
            );
          })}
          {filteredEmployees.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No employees found matching your search
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!isValid}>
            Next: Configure Accounts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
