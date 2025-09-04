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
import { Edit, Trash2, Eye, Search, Filter } from "lucide-react";
import { useCRMCustomerStore } from "@/store/crm/useCRMCustomerStore";
import { CRMCustomer, CustomerType } from "@/types/crm.types";
import dayjs from "dayjs";

interface CustomerListProps {
  onEdit: (customer: CRMCustomer) => void;
}

export default function CustomerList({ onEdit }: CustomerListProps) {
  const { customers, loading, deleteCustomer } = useCRMCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || customer.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [customers, searchTerm, typeFilter]);

  const handleDelete = async (customer: CRMCustomer) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await deleteCustomer(customer.id);
      } catch (error) {
        console.error("Failed to delete customer:", error);
      }
    }
  };

  const getCustomerTypeColor = (type: CustomerType) => {
    switch (type) {
      case CustomerType.IMPORTER:
        return "bg-blue-100 text-blue-800";
      case CustomerType.EXPORTER:
        return "bg-green-100 text-green-800";
      case CustomerType.RETAILER:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCustomerTypeLabel = (type: CustomerType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading customers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-48">
            <Selector
              value={typeFilter}
              onValueChange={setTypeFilter}
              options={[
                { value: "all", label: "All Types" },
                { value: CustomerType.IMPORTER, label: "Importer" },
                { value: CustomerType.EXPORTER, label: "Exporter" },
                { value: CustomerType.RETAILER, label: "Retailer" },
              ]}
              placeholder="Filter by type"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.company || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getCustomerTypeColor(customer.type)}>
                        {getCustomerTypeLabel(customer.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell>
                      {dayjs(customer.createdAt).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(customer)}
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
