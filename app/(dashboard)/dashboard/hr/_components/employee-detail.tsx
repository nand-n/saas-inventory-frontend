import React from "react";

import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Building,
  Award,
  Globe,
} from "lucide-react";
import { Employee } from "@/types/hr.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

interface EmployeeDetailsProps {
  employee: Employee;
  onEdit: () => void;
  onClose: () => void;
  canEdit: boolean;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({
  employee,
  onEdit,
  onClose,
  canEdit,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {employee.firstName.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {employee.firstName}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {employee?.jobTitle ?? "-"} • {employee?.department?.name ?? "-"}
            </p>
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                employee.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : employee.status === "inactive"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {employee.status.charAt(0).toUpperCase() +
                employee.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {canEdit && (
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Employee Number
                </p>
                <p className="font-semibold">{employee.employeeNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Salary
                </p>
                <p className="font-semibold">
                  {formatCurrency(employee?.salary ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hire Date
                </p>
                <p className="font-semibold">{formatDate(employee.hireDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Department
                </p>
                <p className="font-semibold">
                  {employee?.department?.name ?? "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>
            {employee.address && (
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Address
                  </p>
                  <p className="font-medium">{employee.address?.country}</p>
                </div>
              </div>
            )}
            {employee.emergencyContact && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Emergency Contact
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Name
                    </p>
                    <p className="font-medium">
                      {employee.emergencyContact.name}
                    </p>
                  </div>
                  {employee.emergencyContact.phone && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="font-medium">
                        {employee.emergencyContact.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.dateOfBirth && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Date of Birth
                </p>
                <p className="font-medium">
                  {formatDate(employee.dateOfBirth)}
                </p>
              </div>
            )}
            {employee.address && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nationality
                </p>
                <p className="font-medium">{employee.nationality}</p>
              </div>
            )}
            {employee.maritalStatus && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Marital Status
                </p>
                <p className="font-medium capitalize">
                  {employee.maritalStatus}
                </p>
              </div>
            )}
            {employee.education && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Education
                </p>
                <p className="font-medium">{employee.education}</p>
              </div>
            )}
            {employee.experience && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Experience
                </p>
                <p className="font-medium">{employee.experience}</p>
              </div>
            )}
          </CardContent>
        </Card>
        {Array.isArray(employee.languages) && employee.languages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Languages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employee.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills & Competencies */}
        {employee.skills && employee.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Skills & Competencies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Employment History */}
      <Card>
        <CardHeader>
          <CardTitle>Employment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {employee.position}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {employee.department?.name ?? "-"} •{" "}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Since {formatDate(employee.hireDate)}
                </p>
                <p className="text-sm font-medium text-green-600">
                  Current Position
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Created</p>
              <p className="font-medium">
                {formatDate(employee?.createdAt ?? "")}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
              <p className="font-medium">
                {formatDate(employee?.updatedAt ?? "")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDetails;
