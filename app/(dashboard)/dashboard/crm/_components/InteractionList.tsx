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
import { Edit, Trash2, Search, Filter } from "lucide-react";
import { useInteractionStore } from "@/store/crm/useInteractionStore";
import { useCRMCustomerStore } from "@/store/crm/useCRMCustomerStore";
import { Interaction, InteractionType } from "@/types/crm.types";
import dayjs from "dayjs";

interface InteractionListProps {
  onEdit: (interaction: Interaction) => void;
}

export default function InteractionList({ onEdit }: InteractionListProps) {
  const { interactions, loading, deleteInteraction } = useInteractionStore();
  const { customers } = useCRMCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");

  const filteredInteractions = useMemo(() => {
    return interactions.filter((interaction) => {
      const matchesSearch =
        interaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        interaction.customer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "all" || interaction.type === typeFilter;
      const matchesCustomer =
        customerFilter === "all" || interaction.customer.id === customerFilter;

      return matchesSearch && matchesType && matchesCustomer;
    });
  }, [interactions, searchTerm, typeFilter, customerFilter]);

  const handleDelete = async (interaction: Interaction) => {
    if (confirm(`Are you sure you want to delete this interaction?`)) {
      try {
        await deleteInteraction(interaction.id);
      } catch (error) {
        console.error("Failed to delete interaction:", error);
      }
    }
  };

  const getInteractionTypeColor = (type: InteractionType) => {
    switch (type) {
      case InteractionType.CALL:
        return "bg-blue-100 text-blue-800";
      case InteractionType.EMAIL:
        return "bg-green-100 text-green-800";
      case InteractionType.MEETING:
        return "bg-purple-100 text-purple-800";
      case InteractionType.NOTE:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInteractionTypeLabel = (type: InteractionType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading interactions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactions ({filteredInteractions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search interactions..."
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
                { value: InteractionType.CALL, label: "Call" },
                { value: InteractionType.EMAIL, label: "Email" },
                { value: InteractionType.MEETING, label: "Meeting" },
                { value: InteractionType.NOTE, label: "Note" },
              ]}
              placeholder="Filter by type"
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
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInteractions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No interactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInteractions.map((interaction) => (
                  <TableRow key={interaction.id}>
                    <TableCell className="font-medium">
                      {interaction.customer.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getInteractionTypeColor(interaction.type)}
                      >
                        {getInteractionTypeLabel(interaction.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {interaction.description}
                    </TableCell>
                    <TableCell>
                      {dayjs(interaction.createdAt).format(
                        "MMM DD, YYYY HH:mm"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(interaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(interaction)}
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
