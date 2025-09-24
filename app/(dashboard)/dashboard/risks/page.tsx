"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRiskStore } from "@/store/risks/useRiskStore";
import {
  Risk,
  RiskFilters,
  RiskSeverity,
  RiskStatus,
  CreateRiskRequest,
  UpdateRiskRequest,
} from "@/types/risk.types";
import RiskModal from "./_components/modals/risk-modal";
import RiskFiltersComponent from "./_components/risk-filters";
import RiskDetail from "./_components/risk-detail";
import RiskBulkActions from "./_components/risk-bulk-actions";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";

const RisksPage = () => {
  const { toast } = useToast();
  const riskStore = useRiskStore();

  // Define table columns
  const columns: ColumnDef<Risk>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.title}</p>
          {row.original.description && (
            <p className="text-sm text-gray-600 truncate max-w-xs">
              {row.original.description}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.severity === RiskSeverity.CRITICAL
              ? "bg-red-100 text-red-800"
              : row.original.severity === RiskSeverity.HIGH
              ? "bg-orange-100 text-orange-800"
              : row.original.severity === RiskSeverity.MEDIUM
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }
        >
          {row.original.severity.charAt(0).toUpperCase() +
            row.original.severity.slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === RiskStatus.OPEN
              ? "bg-blue-100 text-blue-800"
              : row.original.status === RiskStatus.IN_PROGRESS
              ? "bg-yellow-100 text-yellow-800"
              : row.original.status === RiskStatus.MITIGATED
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {row.original.status.replace("_", " ").charAt(0).toUpperCase() +
            row.original.status.replace("_", " ").slice(1)}
        </Badge>
      ),
    },
    {
      accessorKey: "riskScore",
      header: "Risk Score",
      cell: ({ row }) => (
        <span className="font-medium">
          {(row.original.likelihood * row.original.impact * 100).toFixed(1)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {dayjs(row.original.createdAt).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewingRisk(row.original)}
            className="text-blue-600 hover:text-blue-700"
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingRisk(row.original);
              setIsModalOpen(true);
            }}
            className="text-green-600 hover:text-green-700"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteRisk(row.original)}
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisks, setSelectedRisks] = useState<Risk[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [viewingRisk, setViewingRisk] = useState<Risk | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<RiskFilters>({});

  // Fetch risks on component mount
  useEffect(() => {
    riskStore.fetchRisks(filters);
  }, [filters]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value || undefined }));
  };

  // Handle filters
  const handleFiltersChange = (newFilters: RiskFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  // Handle risk creation/editing
  const handleSubmitRisk = async (
    data: CreateRiskRequest | UpdateRiskRequest
  ) => {
    try {
      if (editingRisk) {
        await riskStore.updateRisk(editingRisk.id, data as UpdateRiskRequest);
      } else {
        await riskStore.createRisk(data as CreateRiskRequest);
      }
      setIsModalOpen(false);
      setEditingRisk(null);
    } catch (error) {
      throw error;
    }
  };

  // Handle risk deletion
  const handleDeleteRisk = async (risk: Risk) => {
    if (window.confirm(`Are you sure you want to delete "${risk.title}"?`)) {
      try {
        await riskStore.deleteRisk(risk.id);
        toast({
          title: "Success",
          description: "Risk deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete risk",
          variant: "destructive",
        });
      }
    }
  };

  // Handle bulk actions
  const handleBulkStatusUpdate = async (status: RiskStatus) => {
    try {
      const updatePromises = selectedRisks.map((risk) =>
        riskStore.updateRisk(risk.id, { status })
      );
      await Promise.all(updatePromises);
      setSelectedRisks([]);
    } catch (error) {
      throw error;
    }
  };

  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedRisks.length} selected risks?`
      )
    ) {
      try {
        const deletePromises = selectedRisks.map((risk) =>
          riskStore.deleteRisk(risk.id)
        );
        await Promise.all(deletePromises);
        setSelectedRisks([]);
      } catch (error) {
        throw error;
      }
    }
  };

  // Handle selection from table
  const handleTableSelectionChange = (selectedRows: Risk[]) => {
    setSelectedRisks(selectedRows);
  };

  // Calculate filtered risks
  const filteredRisks = riskStore.risks.filter((risk) => {
    if (
      searchTerm &&
      !risk.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Calculate statistics
  const totalRisks = riskStore.risks.length;
  const openRisks = riskStore.risks.filter(
    (r) => r.status === RiskStatus.OPEN
  ).length;
  const criticalRisks = riskStore.risks.filter(
    (r) => r.severity === RiskSeverity.CRITICAL
  ).length;
  const mitigatedRisks = riskStore.risks.filter(
    (r) => r.status === RiskStatus.MITIGATED
  ).length;

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Management</h1>
          <p className="text-gray-600">Monitor and manage business risks</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Risk
        </Button>
      </div>

      {/* Statistics Cards */}Mahlet
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Risks</p>
                <p className="text-2xl font-bold text-gray-900">{totalRisks}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Risks</p>
                <p className="text-2xl font-bold text-blue-600">{openRisks}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Critical Risks
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {criticalRisks}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mitigated</p>
                <p className="text-2xl font-bold text-green-600">
                  {mitigatedRisks}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search risks..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <FunnelIcon className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <RiskFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
        />
      )}

      {/* Bulk Actions */}
      {selectedRisks.length > 0 && (
        <RiskBulkActions
          selectedRisks={selectedRisks}
          onBulkStatusUpdate={handleBulkStatusUpdate}
          onBulkDelete={handleBulkDelete}
          onClearSelection={() => setSelectedRisks([])}
        />
      )}

      {/* Risks Table */}
      <TableWrapper
        data={filteredRisks}
        columns={columns}
        title="Risks"
        loading={riskStore.loading}
        showPagination={true}
        showLocalSearch={true}
        filtersSlot={
          showFilters && (
            <RiskFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={clearFilters}
            />
          )
        }
        bulkActionsSlot={
          selectedRisks.length > 0 && (
            <RiskBulkActions
              selectedRisks={selectedRisks}
              onBulkStatusUpdate={handleBulkStatusUpdate}
              onBulkDelete={handleBulkDelete}
              onClearSelection={() => setSelectedRisks([])}
            />
          )
        }
        rightHeaderContent={
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </Button>
        }
      />

      {/* Risk Modal */}
      <RiskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRisk(null);
        }}
        risk={editingRisk}
        onSubmit={handleSubmitRisk}
        loading={riskStore.loading}
      />

      {/* Risk Detail Modal */}
      {viewingRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Risk Details</h2>
                <Button variant="outline" onClick={() => setViewingRisk(null)}>
                  Close
                </Button>
              </div>
              <RiskDetail
                risk={viewingRisk}
                onEdit={(risk) => {
                  setViewingRisk(null);
                  setEditingRisk(risk);
                  setIsModalOpen(true);
                }}
                onDelete={handleDeleteRisk}
                onView={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RisksPage;
