"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash,
  Truck,
  Ship,
  Train,
  Globe,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAsync } from "@/hooks/useAsync";
import axiosInstance from "@/lib/axiosInstance";
import { TableWrapper } from "@/components/ui/commons/tableWrapper";
import { ColumnDef } from "@tanstack/react-table";
import RoleGuard from "@/components/commons/RoleGuard";
import { UserRole } from "@/types/hr.types";
import { Selector } from "@/components/ui/select";
import {
  LogisticsPartner,
  LogisticsPartnerFormData,
} from "@/types/logistics.type";
import LogisticsPartnerForm from "../../inventory/_components/forms/logistics-partners-form";

const partnerTypes = [
  { value: "carrier", label: "Shipping Carrier", icon: Truck },
  { value: "freight_forwarder", label: "Freight Forwarder", icon: Ship },
  { value: "customs_broker", label: "Customs Broker", icon: Globe },
  { value: "warehouse", label: "Warehouse", icon: MapPin },
  { value: "logistics_provider", label: "Logistics Provider", icon: Train },
];

export default function LogisticsPartnersPage() {
  const [partners, setPartners] = useState<LogisticsPartner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] =
    useState<LogisticsPartner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: fetchedPartners = [],
    loading: fetchLoading,
    execute: fetchPartners,
  } = useAsync(
    () => axiosInstance.get("logistics-partners").then((r) => r.data),
    false
  );

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    setPartners(fetchedPartners);
  }, [fetchedPartners]);

  const filteredPartners =
    partners?.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.contactPerson
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        partner.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || partner.type === selectedType;
      return matchesSearch && matchesType;
    }) ?? [];

  const handleAddPartner = async (data: LogisticsPartnerFormData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("logistics-partners", data);
      setPartners([...partners, response.data]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding partner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPartner = async (data: LogisticsPartnerFormData) => {
    if (!selectedPartner) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(
        `logistics-partners/${selectedPartner.id}`,
        data
      );
      setPartners(
        partners.map((p) => (p.id === selectedPartner.id ? response.data : p))
      );
      setIsEditModalOpen(false);
      setSelectedPartner(null);
    } catch (error) {
      console.error("Error updating partner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    try {
      await axiosInstance.delete(`logistics-partners/${id}`);
      setPartners(partners.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = partnerTypes.find((t) => t.value === type);
    if (typeConfig) {
      const Icon = typeConfig.icon;
      return <Icon className="h-4 w-4" />;
    }
    return <Globe className="h-4 w-4" />;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = partnerTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.label : type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const columns: ColumnDef<LogisticsPartner>[] = [
    {
      accessorKey: "name",
      header: "Partner Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(row.original.type)}
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">{getTypeLabel(row.original.type)}</Badge>
      ),
    },
    {
      accessorKey: "contactPerson",
      header: "Contact Person",
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.phone}
        </span>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < row.original.rating ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({row.original.rating})
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedPartner(row.original);
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePartner(row.original.id)}
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Logistics Partners</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage shipping carriers, freight forwarders, and logistics service
            providers
          </p>
        </div>
        <RoleGuard
          allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ALL]}
        >
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Logistics Partner</DialogTitle>
              </DialogHeader>
              <LogisticsPartnerForm
                onSubmit={handleAddPartner}
                onCancel={() => setIsAddModalOpen(false)}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </RoleGuard>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search partners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                {partnerTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <TableWrapper<LogisticsPartner>
        columns={columns}
        data={filteredPartners}
        loading={fetchLoading}
        title="Logistics Partners"
      />

      {/* Edit Modal */}
      {selectedPartner && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Logistics Partner</DialogTitle>
            </DialogHeader>
            <LogisticsPartnerForm
              partner={selectedPartner}
              onSubmit={handleEditPartner}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedPartner(null);
              }}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
