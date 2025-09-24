"use client";

import RoleGuard from "@/components/commons/RoleGuard";
import SectionHeader from "@/components/commons/SectionHeader";
import { UserRole } from "@/types/hr.types";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import DepartmentForm from "./_components/DepartmentForm";
import DepartmentFilters from "./_components/DepartmentFilters";
import DepartmentDetail from "./_components/DepartmentDetail";
import DepartmentBulkActions from "./_components/DepartmentBulkActions";
import { Department, DepartmentFormData } from "@/types/department.types";
import { Branch } from "@/types/branchTypes.type";
import { User } from "@/types/user.types";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import useUserStore from "@/store/users/user.store";

function DepartmentsPage() {
//   const { tenantId: TenantId } = useUserStore();

//  const {
//     data: branches = [],
//     loading: isbranchesLoading,
//     execute: fetchbranches,
//   } = useAsync(
//     () => axiosInstance.get(`/branches/${TenantId}`).then((res) => res.data),
//     false
//   );

//    const {
//     data: departments = [],
//     loading: isDepartmentsLoading,
//     execute: fetchDepartments,
//   } = useAsync(
//     // Corrected endpoint from /branches/ to /departments/ (adjust if necessary)
//     () => axiosInstance.get(`/departments/${TenantId}`).then((res) => res.data),
//     false
//   );

//    const {
//     data: users = [],
//     loading: isUsersLoading,
//     execute: fetchUsers,
//   } = useAsync(
//     () =>
//       axiosInstance.get(`/users/tenant/${TenantId}`).then((res) => res.data),
//     false
//   );
//   // const [departments, setDepartments] = useState<any[]>(departments);
//   const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [selectedDepartment, setSelectedDepartment] =
//     useState<Department | null>(null);

//  useEffect(() => {
//     if (TenantId) {
//       fetchbranches();
//       fetchUsers();
//       fetchDepartments(); 
//     }
//   }, [TenantId]);
//   const [filters, setFilters] = useState({
//     search: "",
//     isActive: undefined,
//     branchId: "",
//     managerId: "",
//     parentDepartmentId: "",
//   } as any);
//   const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
//   const { toast } = useToast();

//   // Stats calculation
//   const stats = {
//     total: departments?.length ?? 0,
//     active: departments?.filter((d: any) => d.isActive).length ?? 0,
//     inactive: departments?.filter((d: any) => !d.isActive).length ?? 0,
//     totalBudget: departments?.reduce(
//       (sum: any, d: any) => sum + (d.budget || 0),
//       0
//     ),
//     averageBudget:
//       departments?.length > 0
//         ? departments?.reduce((sum: any, d: any) => sum + (d.budget || 0), 0) /
//           departments?.length
//         : 0,
//   };

//   const handleAddDepartment = async (data: DepartmentFormData) => {
//     setIsLoading(true);
//     try {
//       // // Mock API call - replace with actual API
//       // const newDepartment: Department = {
//       //   id: Date.now().toString(),
//       //   ...data,
//       //   createdAt: new Date().toISOString(),
//       //   updatedAt: new Date().toISOString(),
//       //   deletedAt: null,
//       //   createdByUser: "1",
//       //   updatedBy: "1",
//       // };

//       // setDepartments((prev) => [...prev, newDepartment]);
//       // setFilteredDepartments((prev) => [...prev, newDepartment]);
//       setIsAddModalOpen(false);
//       toast({
//         title: "Success",
//         description: "Department added successfully",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to add department",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEditDepartment = async (data: DepartmentFormData) => {
//     if (!selectedDepartment) return;

//     setIsLoading(true);
//     try {
//       // Mock API call - replace with actual API
//       const updatedDepartment = {
//         ...selectedDepartment,
//         ...data,
//         updatedAt: new Date().toISOString(),
//       };
//       // setDepartments((prev) =>
//       //   prev.map((d) =>
//       //     d.id === selectedDepartment.id ? updatedDepartment : d
//       //   )
//       // );
//       setFilteredDepartments((prev) =>
//         prev.map((d) =>
//           d.id === selectedDepartment.id ? updatedDepartment : d
//         )
//       );
//       setIsEditModalOpen(false);
//       setSelectedDepartment(null);
//       toast({
//         title: "Success",
//         description: "Department updated successfully",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update department",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteDepartment = async (id: string) => {
//     try {
//       // Mock API call - replace with actual API
//       // setDepartments((prev) => prev.filter((d) => d.id !== id));
//       setFilteredDepartments((prev) => prev.filter((d) => d.id !== id));
//       toast({
//         title: "Success",
//         description: "Department deleted successfully",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete department",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleBulkDelete = async (ids: string[]) => {
//     try {
//       // Mock API call - replace with actual API
//       // setDepartments((prev) => prev.filter((d) => !ids.includes(d.id)));
//       setFilteredDepartments((prev) => prev.filter((d) => !ids.includes(d.id)));
//       setSelectedDepartments([]);
//       toast({
//         title: "Success",
//         description: `${ids?.length} departments deleted successfully`,
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete departments",
//         variant: "destructive",
//       });
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...(departments || [])];

//     if (filters.search) {
//       filtered = filtered.filter(
//         (dept) =>
//           dept.name.toLowerCase().includes(filters.search.toLowerCase()) ||
//           dept.code.toLowerCase().includes(filters.search.toLowerCase())
//       );
//     }

//     if (filters.isActive !== undefined) {
//       filtered = filtered.filter((dept) => dept.isActive === filters.isActive);
//     }

//     if (filters.branchId) {
//       filtered = filtered.filter((dept) => dept.branchId === filters.branchId);
//     }

//     if (filters.managerId) {
//       filtered = filtered.filter(
//         (dept) => dept.managerId === filters.managerId
//       );
//     }

//     if (filters.parentDepartmentId) {
//       filtered = filtered.filter(
//         (dept) => dept.parentDepartmentId === filters.parentDepartmentId
//       );
//     }

//     setFilteredDepartments(filtered);
//   };

//   useEffect(() => {
//     applyFilters();
//   }, [filters, departments]);

//   const getManagerName = (managerId: string) => {
//     const user = users.find((u: any) => u.id === managerId);
//     return user ? `${user.firstName} ${user.lastName}` : "Unknown";
//   };

//   const getBranchName = (branchId: string) => {
//     const branch = branches.find((b: Branch) => b.id === branchId);
//     return branch ? branch.name : "Unknown";
//   };

  return (
    // <div className="space-y-6">
    //   {/* Header */}
    //   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    //     <SectionHeader
    //       title="Department Management"
    //       subtitle="Manage your organization's departments and structure"
    //     />

    //     <div className="flex flex-col sm:flex-row gap-3">
    //       <RoleGuard
    //         allowedRoles={[
    //           UserRole.ADMIN,
    //           UserRole.SUPER_ADMIN,
    //           UserRole.HR_MANAGER,
    //           UserRole.ALL,
    //         ]}
    //       >
    //         <Button
    //           onClick={() => setIsAddModalOpen(true)}
    //           className="w-full sm:w-auto"
    //         >
    //           <Plus className="h-4 w-4 mr-2" />
    //           Add Department
    //         </Button>
    //       </RoleGuard>
    //     </div>
    //   </div>

    //   {/* Stats Cards */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">
    //           Total Departments
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">{stats.total}</div>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Active</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold text-green-600">
    //           {stats.active}
    //         </div>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Inactive</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold text-red-600">
    //           {stats.inactive}
    //         </div>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">
    //           ${stats?.totalBudget?.toLocaleString()}
    //         </div>
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    //         <CardTitle className="text-sm font-medium">Avg Budget</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="text-2xl font-bold">
    //           ${Math.round(stats.averageBudget).toLocaleString()}
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   {/* Filters */}
    //   <DepartmentFilters
    //     filters={filters}
    //     onFiltersChange={setFilters}
    //     onClearFilters={() =>
    //       setFilters({
    //         search: "",
    //         isActive: undefined,
    //         branchId: "",
    //         managerId: "",
    //         parentDepartmentId: "",
    //       })
    //     }
    //     branches={branches}
    //     users={users}
    //     departments={departments}
    //   />

    //   {/* Bulk Actions */}
    //   {selectedDepartments.length > 0 && (
    //     <DepartmentBulkActions
    //       selectedDepartments={selectedDepartments}
    //       onBulkAction={(action) => {
    //         if (action.action === "delete") {
    //           handleBulkDelete(action.departmentIds);
    //         }
    //         // Handle other actions as needed
    //       }}
    //       branches={branches}
    //       users={users}
    //       departments={departments}
    //     />
    //   )}

    //   {/* Departments Table */}
    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Departments</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       {isLoading ? (
    //         <div className="space-y-3">
    //           {[...Array(5)].map((_, i) => (
    //             <div key={i} className="flex items-center space-x-4">
    //               <Skeleton className="h-12 w-full" />
    //             </div>
    //           ))}
    //         </div>
    //       ) : (
    //         <Table>
    //           <TableHeader>
    //             <TableRow>
    //               <TableHead className="w-12">
    //                 <input
    //                   type="checkbox"
    //                   onChange={(e) => {
    //                     if (e.target.checked) {
    //                       setSelectedDepartments(
    //                         filteredDepartments.map((d) => d.id)
    //                       );
    //                     } else {
    //                       setSelectedDepartments([]);
    //                     }
    //                   }}
    //                   checked={
    //                     selectedDepartments.length ===
    //                       filteredDepartments.length &&
    //                     filteredDepartments.length > 0
    //                   }
    //                 />
    //               </TableHead>
    //               <TableHead>Name</TableHead>
    //               <TableHead>Code</TableHead>
    //               <TableHead>Manager</TableHead>
    //               <TableHead>Branch</TableHead>
    //               <TableHead>Budget</TableHead>
    //               <TableHead>Status</TableHead>
    //               <TableHead className="w-32">Actions</TableHead>
    //             </TableRow>
    //           </TableHeader>
    //           <TableBody>
    //             {filteredDepartments.map((department) => (
    //               <TableRow key={department.id}>
    //                 <TableCell>
    //                   <input
    //                     type="checkbox"
    //                     checked={selectedDepartments.includes(department.id)}
    //                     onChange={(e) => {
    //                       if (e.target.checked) {
    //                         setSelectedDepartments((prev) => [
    //                           ...prev,
    //                           department.id,
    //                         ]);
    //                       } else {
    //                         setSelectedDepartments((prev) =>
    //                           prev.filter((id) => id !== department.id)
    //                         );
    //                       }
    //                     }}
    //                   />
    //                 </TableCell>
    //                 <TableCell className="font-medium">
    //                   {department.name}
    //                 </TableCell>
    //                 <TableCell>{department.code}</TableCell>
    //                 <TableCell>
    //                   {getManagerName(department.managerId)}
    //                 </TableCell>
    //                 <TableCell>{getBranchName(department.branchId)}</TableCell>
    //                 <TableCell>
    //                   ${department.budget?.toLocaleString() || "0"}
    //                 </TableCell>
    //                 <TableCell>
    //                   <Badge
    //                     variant={department.isActive ? "default" : "secondary"}
    //                   >
    //                     {department.isActive ? "Active" : "Inactive"}
    //                   </Badge>
    //                 </TableCell>
    //                 <TableCell>
    //                   <div className="flex items-center space-x-2">
    //                     <Button
    //                       variant="ghost"
    //                       size="sm"
    //                       onClick={() => {
    //                         setSelectedDepartment(department);
    //                         setIsDetailModalOpen(true);
    //                       }}
    //                     >
    //                       <Eye className="h-4 w-4" />
    //                     </Button>
    //                     <RoleGuard
    //                       allowedRoles={[
    //                         UserRole.ADMIN,
    //                         UserRole.SUPER_ADMIN,
    //                         UserRole.HR_MANAGER,
    //                         UserRole.ALL,
    //                       ]}
    //                     >
    //                       <Button
    //                         variant="ghost"
    //                         size="sm"
    //                         onClick={() => {
    //                           setSelectedDepartment(department);
    //                           setIsEditModalOpen(true);
    //                         }}
    //                       >
    //                         <Edit className="h-4 w-4" />
    //                       </Button>
    //                       <Button
    //                         variant="ghost"
    //                         size="sm"
    //                         onClick={() =>
    //                           handleDeleteDepartment(department.id)
    //                         }
    //                       >
    //                         <Trash2 className="h-4 w-4" />
    //                       </Button>
    //                     </RoleGuard>
    //                   </div>
    //                 </TableCell>
    //               </TableRow>
    //             ))}
    //           </TableBody>
    //         </Table>
    //       )}
    //     </CardContent>
    //   </Card>

    //   {/* Add Department Modal */}
    //   <DepartmentForm
    //     open={isAddModalOpen}
    //     onOpenChange={setIsAddModalOpen}
    //     department={null}
    //     branches={branches}
    //     users={users}
    //     departments={departments}
    //     onSubmit={handleAddDepartment}
    //     isLoading={isLoading}
    //   />

    //   {/* Edit Department Modal */}
    //   <DepartmentForm
    //     open={isEditModalOpen}
    //     onOpenChange={setIsEditModalOpen}
    //     department={selectedDepartment}
    //     branches={branches}
    //     users={users}
    //     departments={departments}
    //     onSubmit={handleEditDepartment}
    //     isLoading={isLoading}
    //   />

    //   {/* Department Detail Modal */}
    //   {selectedDepartment && (
    //     <DepartmentDetail
    //       open={isDetailModalOpen}
    //       onOpenChange={setIsDetailModalOpen}
    //       department={selectedDepartment}
    //       onEdit={() => {
    //         setSelectedDepartment(selectedDepartment);
    //         setIsEditModalOpen(true);
    //       }}
    //       // branches={branches}
    //       // users={users}
    //       // departments={departments}
    //     />
    //   )}
    // </div>
    <></>
  );
}

export default DepartmentsPage;
