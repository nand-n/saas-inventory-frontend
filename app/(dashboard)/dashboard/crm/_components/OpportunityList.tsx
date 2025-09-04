"use client";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Selector } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Search, Filter, DollarSign } from "lucide-react";
import { useOpportunityStore } from "@/store/crm/useOpportunityStore";
import { useCRMCustomerStore } from "@/store/crm/useCRMCustomerStore";
import { Opportunity, OpportunityStatus } from "@/types/crm.types";
import dayjs from "dayjs";

interface OpportunityListProps {
  onEdit: (opportunity: Opportunity) => void;
}

export default function OpportunityList({ onEdit }: OpportunityListProps) {
  const { opportunities, loading, deleteOpportunity } = useOpportunityStore();
  const { customers } = useCRMCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const matchesSearch =
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.customer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || opportunity.status === statusFilter;
      const matchesCustomer =
        customerFilter === "all" || opportunity.customer.id === customerFilter;

      return matchesSearch && matchesStatus && matchesCustomer;
    });
  }, [opportunities, searchTerm, statusFilter, customerFilter]);

  const handleDelete = async (opportunity: Opportunity) => {
    if (confirm(`Are you sure you want to delete this opportunity?`)) {
      try {
        await deleteOpportunity(opportunity.id);
      } catch (error) {
        console.error("Failed to delete opportunity:", error);
      }
    }
  };

  const getStatusColor = (status: OpportunityStatus) => {
    switch (status) {
      case OpportunityStatus.NEW:
        return "bg-blue-100 text-blue-800";
      case OpportunityStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800";
      case OpportunityStatus.WON:
        return "bg-green-100 text-green-800";
      case OpportunityStatus.LOST:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: OpportunityStatus) => {
    switch (status) {
      case OpportunityStatus.NEW:
        return "New";
      case OpportunityStatus.IN_PROGRESS:
        return "In Progress";
      case OpportunityStatus.WON:
        return "Won";
      case OpportunityStatus.LOST:
        return "Lost";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading opportunities...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunities ({filteredOpportunities.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-48">
            <Selector
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: "all", label: "All Statuses" },
                { value: OpportunityStatus.NEW, label: "New" },
                { value: OpportunityStatus.IN_PROGRESS, label: "In Progress" },
                { value: OpportunityStatus.WON, label: "Won" },
                { value: OpportunityStatus.LOST, label: "Lost" },
              ]}
              placeholder="Filter by status"
            />
          </div>
          <div className="w-48">
            <Selector
              value={customerFilter}
              onValueChange={setCustomerFilter}
              options={[
                { value: "all", label: "All Customers" },
                ...customers.map((customer) => ({
                  value: customer.id,
                  label: customer.name,
                })),
              ]}
              placeholder="Filter by customer"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estimated Value</TableHead>
                <TableHead>Expected Closing</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No opportunities found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOpportunities.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">
                      {opportunity.customer.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {opportunity.title}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(opportunity.status)}>
                        {getStatusLabel(opportunity.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {opportunity.estimatedValue ? (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {opportunity.estimatedValue.toLocaleString()}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {opportunity.expectedClosingDate
                        ? dayjs(opportunity.expectedClosingDate).format(
                            "MMM DD, YYYY"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {dayjs(opportunity.createdAt).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(opportunity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(opportunity)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
