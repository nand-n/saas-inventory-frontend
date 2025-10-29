"use client";

import RoleGuard from "@/components/commons/RoleGuard";
import SectionHeader from "@/components/commons/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { exportToCSV, formatCurrency, formatDate } from "@/lib/utils";
import { Check, ChevronDown, ChevronRight, Download, Edit, Eye, Filter, Pencil, Plus, Trash, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePayrollStore } from "@/store/hr/usePayrollStore";
import PayrollForm from "./_components/payroll-form";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import { CreatePayrollRunDto, Payroll, PayrollAdjustment, PayrollRun, PayrollRunStatus } from "@/types/payroll.types";
import { UserRole } from "@/types/hr.types";
import PayrollBulkActions from "./_components/payroll-bulk-action";
import PayrollDetails from "./_components/payroll-detail";
import PayrollFilters from "./_components/payroll-filter";
import useTenantStore from "@/store/tenant/tenantStore";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import PayrollAdjustmentForm from "./_components/payroll-adjestment-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayrollRunForm from "./_components/payroll-run-form";
import PayrollRunDetail from "./_components/payroll-run-detail";

export default function PayrollPage() {
  const {
    payrolls,
    filteredPayrolls,
    isLoading,
    filters,
    fetchPayrolls,
    addPayroll,
    updatePayroll,
    deletePayroll,
    bulkDeletePayrolls,
    setFilters,
    clearFilters,
    addAdjustment,
    addPayrollRun,
    adjustments,
    applyFilters,
    calculateStats, 
    fetchAdjustments,
    fetchPayrollRuns, 
    payrollRuns, 
    updatePayrollRun,
    changePayrollRunStatus,
    settleAdjustment, 
    stats,
    selectedRuns ,
    setSelectedRuns

  } = usePayrollStore();

  useEffect(() => {
    fetchPayrolls();
    fetchAdjustments()
    fetchPayrollRuns()
  }, [fetchPayrolls , fetchAdjustments , fetchPayrollRuns]);


    const [activeTab, setActiveTab] = useState("runs");
  
  const { id: tenantid } = useTenantStore();
  const {
    data: employees = [],
    loading: employeesLoading,
    execute: fetchdEmployees,
  } = useAsync(() => axiosInstance.get("employees").then((r) => r.data), true);

  const {
    data: COAccounts = [],
    loading: COAccountsLoading,
    execute: fetchdCOAccounts,
  } = useAsync(
    () => axiosInstance.get("accounting/chart-of-accounts").then((r) => r.data),
    true
  );

  const {
    data: departments = [],
    loading: departmentsLoading,
    execute: fetchDepartments,
  } = useAsync(
    () =>
      axiosInstance.get(`departments/tenant/${tenantid}`).then((r) => r.data),
    false
  );
  useEffect(()=>{
    if(tenantid){
    fetchDepartments()
    }
  } , [tenantid])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);
  const [selectedPayrolls, setSelectedPayrolls] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payroll;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  const sortedPayrolls = useMemo(() => {
    if (!sortConfig) return filteredPayrolls;

    return [...filteredPayrolls].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredPayrolls, sortConfig]);

  const handleSort = (key: keyof Payroll) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    const exportData = payrolls.map((p) => ({
      "Payroll ID": p.id,
      Employee: `${p.employee.firstName} ${p.employee.lastName}`,
      "Pay Period": `${formatDate(p.payPeriodStart)} - ${formatDate(
        p.payPeriodEnd
      )}`,
      "Gross Pay": formatCurrency(p.grossPay),
      // Taxes: formatCurrency(
      //   (p.federalTax || 0) +
      //     (p.stateTax || 0) +
      //     (p.socialSecurityTax || 0) +
      //     (p.medicareTax || 0)
      // ),
      "Net Pay": formatCurrency(p.netPay),
      Status: p.status,
    }));

    exportToCSV(
      exportData,
      `payrolls-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success("Payrolls exported successfully!");
  };

  const handleView = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deletePayroll(id);
    toast.success("Payroll deleted successfully!");
  };

  const handleBulkDelete = async () => {
    if (selectedPayrolls.length === 0) {
      toast.error("Please select payrolls to delete");
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedPayrolls.length} payroll(s)?`
      )
    ) {
      await bulkDeletePayrolls(selectedPayrolls);
      setSelectedPayrolls([]);
      toast.success(
        `${selectedPayrolls.length} payroll(s) deleted successfully!`
      );
    }
  };

  const handleSelectPayroll = (id: string) => {
    setSelectedPayrolls((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayrolls.length === sortedPayrolls.length) {
      setSelectedPayrolls([]);
    } else {
      setSelectedPayrolls(sortedPayrolls.map((p) => p.id));
    }
  };
  const [isAddAdjustmentModalOpen , setIsAddAdjustmentModalOpen] = useState(false)


  const [expanded , setExpanded]  = useState<string | null>(null)
  const handleToggle =(id:string)=>{
    setExpanded(id)
  }




  const payrollColumns: ColumnDef<Payroll>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        onChange={(e) => {
          if (e.target.checked) {
            const allIds = table
              .getFilteredRowModel()
              .rows.map((row) => row.original.id);
            setSelectedPayrolls(allIds);
          } else {
            setSelectedPayrolls([]);
          }
        }}
        checked={
          selectedPayrolls.length ===
            table.getFilteredRowModel().rows.length &&
          table.getFilteredRowModel().rows.length > 0
        }
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={selectedPayrolls.includes(row.original.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedPayrolls([...selectedPayrolls, row.original.id]);
          } else {
            setSelectedPayrolls(
              selectedPayrolls.filter((id) => id !== row.original.id)
            );
          }
        }}
      />
    ),
  },
  {
    accessorKey: "id",
    header: "Payroll ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "employee",
    header: "Employee",
    cell: ({ row }) =>
      `${row.original.employee.firstName} ${row.original.employee.lastName}`,
  },
  {
    accessorKey: "payPeriodStart",
    header: "Pay Period",
    cell: ({ row }) =>
      `${formatDate(row.original.payPeriodStart)} - ${formatDate(
        row.original.payPeriodEnd
      )}`,
  },
  {
    accessorKey: "grossPay",
    header: "Gross Pay",
    cell: ({ row }) => formatCurrency(row.original.grossPay ?? 0),
  },
  {
    accessorKey: "netPay",
    header: "Net Pay",
    cell: ({ row }) => formatCurrency(row.original.netPay ?? 0),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "paid"
            ? "default"
            : row.original.status === "draft"
            ? "secondary"
            : "destructive"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const payroll = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(payroll)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <RoleGuard
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.HR_MANAGER,
              UserRole.ALL,
            ]}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(payroll)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(payroll.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </RoleGuard>
        </div>
      );
    },
  },
  {
    id: "expand",
    header: "",
    cell: ({ row }) => {
      const payroll = row.original;
      const isOpen = expanded === payroll.id;
      return (
        <button
          onClick={() => handleToggle(payroll.id)}
          className="flex items-center justify-center"
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      );
    },
  },
];

 const payrollAdjestmentColumn: ColumnDef<PayrollAdjustment>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.type || "-"}</span>
      ),
    },
    {
      accessorKey: "direction",
      header: "Direction",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.direction === "addition" ? "default" : "secondary"
          }
          className="uppercase"
        >
          {row.original.direction}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.original.amount ?? 0),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => row.original.reason || "-",
    },
    {
      accessorKey: "effectiveDate",
      header: "Effective Date",
      cell: ({ row }) =>
        row.original.effectiveDate
          ? formatDate(row.original.effectiveDate)
          : "-",
    },
    {
      accessorKey: "isRecurring",
      header: "Recurring",
      cell: ({ row }) => (row.original.isRecurring ? "Yes" : "No"),
    },
    {
      accessorKey: "approvalStatus",
      header: "Approval Status",
      cell: ({ row }) => {
        const status = row.original.approvalStatus;
        const variant =
          status === "approved"
            ? "default"
            : status === "pending"
            ? "secondary"
            : "destructive";
        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "approvedBy",
      header: "Approved By",
      cell: ({ row }) => row.original.approvedBy || "-",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <RoleGuard
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.HR_MANAGER,
              UserRole.ALL,
            ]}
          >
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </RoleGuard>
        </div>
      ),
    },
  ];



const renderAdjustmentsTable = (adjustments: PayrollAdjustment[] = [] , employeeId:string , payrollId:string) => {
 

  return (
    <div className="pl-10">
      <TableWrapper<PayrollAdjustment>
        columns={payrollAdjestmentColumn}
        data={adjustments || []}
        loading={false}
        title="Payroll Adjustments"
        rightHeaderContent={
          <RoleGuard
            allowedRoles={[
              UserRole.ADMIN,
              UserRole.SUPER_ADMIN,
              UserRole.HR_MANAGER,
              UserRole.ALL,
            ]}
          >
            <Dialog
              open={isAddAdjustmentModalOpen}
              onOpenChange={setIsAddAdjustmentModalOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Adjustment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Payroll Adjustment</DialogTitle>
                </DialogHeader>
                <PayrollAdjustmentForm
                  employeeId={employeeId}
                  onSubmit={async (data) => {
                    await addAdjustment({...data , payrollId});
                    setIsAddAdjustmentModalOpen(false);
                  }}
                  onCancel={() => setIsAddAdjustmentModalOpen(false)}
                  employees={employees}
                  accounts={COAccounts}
                  
                />
              </DialogContent>
            </Dialog>
          </RoleGuard>
        }
      />
    </div>
  );
};


const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);
const [viewOpen, setViewOpen] = useState(false);
const [editOpen, setEditOpen] = useState(false);


const payrollRunColumns: ColumnDef<PayrollRun>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        onChange={(e) => {
          if (e.target.checked) {
            const allIds = table
              .getFilteredRowModel()
              .rows.map((row) => row.original.id);
            setSelectedRuns(allIds);
          } else {
            setSelectedRuns([]);
          }
        }}
        checked={
          selectedRuns.length === table.getFilteredRowModel().rows.length &&
          table.getFilteredRowModel().rows.length > 0
        }
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={selectedRuns.includes(row.original.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedRuns([...selectedRuns, row.original.id]);
          } else {
            setSelectedRuns(
              selectedRuns.filter((id) => id !== row.original.id)
            );
          }
        }}
      />
    ),
  },
  {
    accessorKey: "id",
    header: "Run ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "name",
    header: "Run Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "periodStart",
    header: "Period",
    cell: ({ row }) =>
      `${formatDate(row.original.periodStart)} - ${formatDate(
        row.original.periodEnd
      )}`,
  },
  {
    accessorKey: "payDate",
    header: "Pay Date",
    cell: ({ row }) => (row.original.payDate ? formatDate(row.original.payDate) : "-"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === PayrollRunStatus.COMPLETED
            ? "default"
            : row.original.status === PayrollRunStatus.DRAFT
            ? "secondary"
            : "destructive"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "totalGrossPay",
    header: "Total Gross",
    cell: ({ row }) => formatCurrency(row.original.totalGrossPay),
  },
  {
    accessorKey: "totalNetPay",
    header: "Total Net",
    cell: ({ row }) => formatCurrency(row.original.totalNetPay),
  },
  {
    accessorKey: "totalDeductions",
    header: "Deductions",
    cell: ({ row }) => formatCurrency(row.original.totalDeductions),
  },
  {
    id: "actions",
    header: "Actions",
  cell: ({ row }) => {
  const run = row.original;

  // const handleApproveRun = (id: string , status) => {
  //   // your approve logic here
  // };

  const handleCancelRun  =(id:string) => {

  }

  const handleEditRun = (run:PayrollRun) => {
  setSelectedRun(run);
  setEditOpen(true);
  };

  const handleDeleteRun = (id: string) => {
    // your delete logic
  };

  const handleViewRun = (run:PayrollRun) => {
    setSelectedRun(run);
  setViewOpen(true);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* 👁 View is always available */}
  <Dialog open={viewOpen} onOpenChange={setViewOpen}>
              <DialogTrigger asChild>
                 <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewRun(run)}
        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
      >
        <Eye className="h-4 w-4" />
      </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle> Payroll run Detial</DialogTitle>
                </DialogHeader>
               {selectedRun && (
      <PayrollRunDetail
        run={selectedRun}
        onBack={() => setViewOpen(false)}
        onApprove={changePayrollRunStatus}
        onCancel={handleCancelRun}
      />
    )}
              </DialogContent>
            </Dialog>

      <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.ALL]}>
        {/* 🟡 Edit only when DRAFT or PROCESSING */}
        {(run.status === PayrollRunStatus.DRAFT || run.status === PayrollRunStatus.PROCESSING) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditRun(run)}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Edit Payroll Run</DialogTitle>
    </DialogHeader>

    {selectedRun && (
      <PayrollRunForm
        accounts={COAccounts}       // ✅ from your create
        employees={employees}       // ✅ from your create
        run={selectedRun}   // ✅ prefill the form
        onSubmit={async (data) => {
          await updatePayrollRun(selectedRun.id, data); // your update API call
          setEditOpen(false);
        }}
        onCancel={() => setEditOpen(false)}
      />
    )}
  </DialogContent>
</Dialog>


        {/* ✅ Approve only when COMPLETED */}
        {run.status === PayrollRunStatus.COMPLETED && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePayrollRunStatus(run.id , {status:PayrollRunStatus.APPROVED})}
            className="text-green-500 hover:text-green-700 hover:bg-green-50"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}

        {/* ❌ Delete only when DRAFT */}
        {run.status === PayrollRunStatus.DRAFT && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteRun(run.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </RoleGuard>
    </div>
  )
}
  },
];


const [isRunModalOpen,setIsRunModalOpen] = useState(false)

const [isAdjustmentModalOpen,setIsAdjustmentModalOpen] = useState(false)

  return (
    

      <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
          <TabsTrigger value="payrolls">Payrolls</TabsTrigger>
          {/* <TabsTrigger value="adjustments">Adjustments</TabsTrigger> */}
        </TabsList>

        {/* ========== Payrolls Tab ========== */}
        <TabsContent value="payrolls" className="space-y-4">
           <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          title="Payroll Management"
          subtitle="Manage payroll processing and payments"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <RoleGuard
            allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.ALL]}
          >
            <Button
              variant="outline"
              onClick={handleExport}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </RoleGuard>
          <RoleGuard
            allowedRoles={[UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.ALL]}
          >
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payroll
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Payroll</DialogTitle>
                </DialogHeader>
                <PayrollForm
                  accounts={COAccounts}
                  employees={employees}
                  onSubmit={async (data) => {
                    await addPayroll(data);
                    // setIsAddModalOpen(false);
                  }}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </RoleGuard>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle>Payroll List</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 min-w-0 sm:max-w-sm">
                <Input
                  placeholder="Search payrolls by employee..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-3"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="flex-1 sm:flex-none"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                {Object.keys(filters).length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="flex-1 sm:flex-none"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
          {isFiltersOpen && (
            <div className="mt-4">
              <PayrollFilters
                departments={departments}
                payrolls={payrolls}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>
          )}
        </CardHeader>

        <CardContent>
          {selectedPayrolls.length > 0 && (
            <div className="mb-4">
              <PayrollBulkActions
                selectedCount={selectedPayrolls.length}
                onBulkDelete={handleBulkDelete}
                canDelete={true}
              />
            </div>
          )}

          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">


              <TableWrapper<Payroll>
                columns={payrollColumns}
                data={sortedPayrolls || []}
                loading={isLoading}
                title="Payroll List"
                rowSubComponent={(payroll) =>
                  expanded === payroll.id ? renderAdjustmentsTable(payroll.adjustments , payroll.employee.id , payroll.id) : null
                }
              />

            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Payroll</DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <PayrollForm
            accounts={COAccounts}
            employees={employees}
              payroll={selectedPayroll}
              onSubmit={async (data) => {
                await updatePayroll(selectedPayroll.id, data);
                setIsEditModalOpen(false);
                setSelectedPayroll(null);
                toast.success("Payroll updated successfully!");
              }}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedPayroll(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payroll Details</DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <PayrollDetails
              payroll={selectedPayroll}
              onEdit={() => {
                setIsDetailsModalOpen(false);
                handleEdit(selectedPayroll);
              }}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedPayroll(null);
              }}
              canEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
        </TabsContent>
        {/* ========== Payroll Runs Tab ========== */}
  <TabsContent value="runs" className="space-y-4">
  <div className="flex justify-between items-center">
    <SectionHeader
      title="Payroll Runs"
      subtitle="Manage payroll runs"
    />
    <Dialog open={isRunModalOpen} onOpenChange={setIsRunModalOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Run
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Payroll Run</DialogTitle>
        </DialogHeader>
        <PayrollRunForm
        accounts={COAccounts}
        employees={employees}
        existingPayrolls={payrolls ?? []}
          onSubmit={async (data) => {
            await addPayrollRun(data as CreatePayrollRunDto);
            setIsRunModalOpen(false);
          }}
          onCancel={() => setIsRunModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  </div>

  {/* Runs List */}
  <div className="rounded-md border overflow-hidden mt-4">
    <div className="overflow-x-auto">
      <TableWrapper<PayrollRun>
        columns={payrollRunColumns}
        data={payrollRuns || []}
        loading={isLoading}
        title="Payroll Runs"
        // rowSubComponent={(run) =>
        //   <RunDetails run={run} /> 
        // }
      />
    </div>
  </div>
</TabsContent>


        {/* ========== Adjustments Tab ========== */}
      <TabsContent value="adjustments" className="space-y-4">
  <SectionHeader
    title="Payroll Adjustments"
    subtitle="Manage payroll adjustments"
  />

  <div className="flex justify-between items-center">
    <h2 className="text-xl font-semibold">Adjustments</h2>
    <Dialog open={isAdjustmentModalOpen} onOpenChange={setIsAdjustmentModalOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Adjustment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Payroll Adjustment</DialogTitle>
        </DialogHeader>
        <PayrollAdjustmentForm
          // payrolls={payrolls} // select which payroll this adjustment belongs to
          onSubmit={async (data) => {
            await addAdjustment(data);
            setIsAdjustmentModalOpen(false);
          }}
          accounts={COAccounts}
          employees={employees}

          onCancel={() => setIsAdjustmentModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  </div>

  {/* Adjustments List */}
  <div className="rounded-md border overflow-hidden mt-4">
    <div className="overflow-x-auto">
      <TableWrapper<PayrollAdjustment>
        columns={payrollAdjestmentColumn}
        data={adjustments || []}
        loading={isLoading}
        title="Payroll Adjustments"
        // rowSubComponent={(adj) =>
        //   <AdjustmentDetails adjustment={adj} onSettle={async () => await settleAdjustment(adj.id)} />
        // }
      />
    </div>
  </div>
</TabsContent>

      </Tabs>

    </div>
  );
}
