"use client";

import React, { useEffect, useState } from "react";
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
import { Plus, Filter, Eye, Edit, Trash2 } from "lucide-react";
import {
  CustomsDocument,
  CustomsDocumentType,
  CustomsDocumentStatus,
} from "@/types/shipment.types";
import { useCustomsDocumentsStore } from "@/store/customs-documents/useCustomsDocumentsStore";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import CustomsDocumentModal from "./_components/customs-document-modal";
import CustomsDocumentBulkActions from "./_components/customs-document-bulk-actions";
import CustomsDocumentDetail from "./_components/customs-document-detail";
import CustomsDocumentFilters from "./_components/customs-document-filters";

export default function CustomsDocumentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<CustomsDocument | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    customsDocuments,
    filteredDocuments,
    isLoading,
    filters,
    stats,
    fetchCustomsDocuments,
    setFilters,
    clearFilters,
    applyFilters,
    deleteCustomsDocument,
    bulkDeleteDocuments,
  } = useCustomsDocumentsStore();

  const { toast } = useToast();

  useEffect(() => {
    fetchCustomsDocuments();
  }, [fetchCustomsDocuments]);

  const handleCreateDocument = () => {
    setSelectedDocument(null);
    setIsModalOpen(true);
  };

  const handleEditDocument = (document: CustomsDocument) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleViewDocument = (document: CustomsDocument) => {
    setSelectedDocument(document);
    setIsDetailOpen(true);
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteCustomsDocument(id);
      toast({
        title: "Document Deleted",
        description: "Customs document has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete customs document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDocuments.length === 0) return;

    try {
      await bulkDeleteDocuments(selectedDocuments);
      setSelectedDocuments([]);
      toast({
        title: "Documents Deleted",
        description: `${selectedDocuments.length} customs documents have been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Bulk Delete Failed",
        description: "Failed to delete selected documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: CustomsDocumentStatus) => {
    switch (status) {
      case CustomsDocumentStatus.DRAFT:
        return <Badge variant="secondary">Draft</Badge>;
      case CustomsDocumentStatus.PENDING_APPROVAL:
        return (
          <Badge variant="default" className="bg-yellow-500">
            Pending Approval
          </Badge>
        );
      case CustomsDocumentStatus.UNDER_REVIEW:
        return (
          <Badge variant="default" className="bg-blue-500">
            Under Review
          </Badge>
        );
      case CustomsDocumentStatus.APPROVED:
        return (
          <Badge variant="default" className="bg-green-500">
            Approved
          </Badge>
        );
      case CustomsDocumentStatus.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      case CustomsDocumentStatus.SUBMITTED:
        return (
          <Badge variant="default" className="bg-purple-500">
            Submitted
          </Badge>
        );
      case CustomsDocumentStatus.ACCEPTED:
        return (
          <Badge variant="default" className="bg-green-600">
            Accepted
          </Badge>
        );
      case CustomsDocumentStatus.EXPIRED:
        return <Badge variant="secondary">Expired</Badge>;
      case CustomsDocumentStatus.CANCELLED:
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: CustomsDocumentType) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Customs Documents
          </h1>
          <p className="text-muted-foreground">
            Manage all customs documents and their approval workflows
          </p>
        </div>
        <Button onClick={handleCreateDocument}>
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingApproval}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.expiringSoon}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      {isFilterOpen && (
        <CustomsDocumentFilters
          filters={filters}
          onFiltersChange={setFilters}
          onApplyFilters={applyFilters}
        />
      )}

      {/* Bulk Actions */}
      {selectedDocuments.length > 0 && (
        <CustomsDocumentBulkActions
          selectedCount={selectedDocuments.length}
          onDelete={handleBulkDelete}
          onClearSelection={() => setSelectedDocuments([])}
        />
      )}

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customs Documents</span>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4 mr-2" /> Filters
                </Button>
                {Object.keys(filters).length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading documents...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedDocuments.length === filteredDocuments.length &&
                        filteredDocuments.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocuments(
                            filteredDocuments.map((doc) => doc.id!)
                          );
                        } else {
                          setSelectedDocuments([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Document Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Issuing Authority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(document.id!)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDocuments([
                              ...selectedDocuments,
                              document.id!,
                            ]);
                          } else {
                            setSelectedDocuments(
                              selectedDocuments.filter(
                                (id) => id !== document.id
                              )
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {document.documentNumber}
                    </TableCell>
                    <TableCell>{getTypeLabel(document.type)}</TableCell>
                    <TableCell>{getStatusBadge(document.status)}</TableCell>
                    <TableCell>{formatDate(document.issuedDate)}</TableCell>
                    <TableCell>
                      {document.expiryDate
                        ? formatDate(document.expiryDate)
                        : "N/A"}
                    </TableCell>
                    <TableCell>{document.issuingAuthority}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDocument(document)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(document.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CustomsDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        document={selectedDocument}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchCustomsDocuments();
        }}
      />

      <CustomsDocumentDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        document={selectedDocument}
        onStatusChange={() => {
          fetchCustomsDocuments();
        }}
      />
    </div>
  );
}
