"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCustomsDocumentsStore } from "@/store/customs-documents/useCustomsDocumentsStore";
import { useToast } from "@/hooks/use-toast";
import {
  CustomsDocument,
  CustomsDocumentType,
  CustomsDocumentStatus,
  CreateCustomsDocumentForm,
} from "@/types/shipment.types";

interface CustomsDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: CustomsDocument | null;
  onSuccess: () => void;
}

export default function CustomsDocumentModal({
  isOpen,
  onClose,
  document,
  onSuccess,
}: CustomsDocumentModalProps) {
  const [formData, setFormData] = useState<CreateCustomsDocumentForm>({
    documentNumber: "",
    type: CustomsDocumentType.COMMERCIAL_INVOICE,
    status: CustomsDocumentStatus.DRAFT,
    issuedDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    issuingAuthority: "",
    issuingCountry: "",
    description: "",
    declaredValue: 0,
    currency: "USD",
    notes: "",
    requiresApproval: true,
    shipmentId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { createCustomsDocument, updateCustomsDocument } =
    useCustomsDocumentsStore();
  const { toast } = useToast();

  const isEditMode = !!document;

  useEffect(() => {
    if (document) {
      setFormData({
        documentNumber: document.documentNumber,
        type: document.type,
        status: document.status,
        issuedDate: document.issuedDate.split("T")[0],
        expiryDate: document.expiryDate
          ? document.expiryDate.split("T")[0]
          : "",
        issuingAuthority: document.issuingAuthority,
        issuingCountry: document.issuingCountry,
        description: document.description || "",
        declaredValue: document.declaredValue
          ? Number(document.declaredValue)
          : 0,
        currency: document.currency || "USD",
        notes: document.notes || "",
        requiresApproval: document.requiresApproval,
        shipmentId: document.shipmentId,
      });
    } else {
      // Reset form for new document
      setFormData({
        documentNumber: "",
        type: CustomsDocumentType.COMMERCIAL_INVOICE,
        status: CustomsDocumentStatus.DRAFT,
        issuedDate: new Date().toISOString().split("T")[0],
        expiryDate: "",
        issuingAuthority: "",
        issuingCountry: "",
        description: "",
        declaredValue: 0,
        currency: "USD",
        notes: "",
        requiresApproval: true,
        shipmentId: "",
      });
    }
    setErrors({});
  }, [document, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = "Document number is required";
    }

    if (!formData?.issuingAuthority?.trim()) {
      newErrors.issuingAuthority = "Issuing authority is required";
    }

    if (!formData?.issuingCountry?.trim()) {
      newErrors.issuingCountry = "Issuing country is required";
    }

    if (!formData.issuedDate) {
      newErrors.issuedDate = "Issued date is required";
    }

    if (
      formData.expiryDate &&
      new Date(formData.expiryDate) <= new Date(formData.issuedDate)
    ) {
      newErrors.expiryDate = "Expiry date must be after issued date";
    }

    if (formData.declaredValue && formData.declaredValue < 0) {
      newErrors.declaredValue = "Declared value cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && document?.id) {
        await updateCustomsDocument(document.id, formData);
        toast({
          title: "Document Updated",
          description: "Customs document has been updated successfully.",
        });
      } else {
        await createCustomsDocument(formData);
        toast({
          title: "Document Created",
          description: "Customs document has been created successfully.",
        });
      }
      onSuccess();
    } catch (error) {
      toast({
        title: isEditMode ? "Update Failed" : "Creation Failed",
        description: `Failed to ${
          isEditMode ? "update" : "create"
        } customs document. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateCustomsDocumentForm,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? "Edit Customs Document"
              : "Create New Customs Document"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Number */}
            <div className="space-y-2">
              <Label htmlFor="documentNumber">Document Number *</Label>
              <Input
                id="documentNumber"
                value={formData.documentNumber}
                onChange={(e) =>
                  handleInputChange("documentNumber", e.target.value)
                }
                placeholder="Enter document number"
                className={errors.documentNumber ? "border-red-500" : ""}
              />
              {errors.documentNumber && (
                <p className="text-sm text-red-500">{errors.documentNumber}</p>
              )}
            </div>

            {/* Document Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Document Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CustomsDocumentType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CustomsDocumentStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issued Date */}
            <div className="space-y-2">
              <Label htmlFor="issuedDate">Issued Date *</Label>
              <Input
                id="issuedDate"
                type="date"
                value={formData.issuedDate}
                onChange={(e) =>
                  handleInputChange("issuedDate", e.target.value)
                }
                className={errors.issuedDate ? "border-red-500" : ""}
              />
              {errors.issuedDate && (
                <p className="text-sm text-red-500">{errors.issuedDate}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
                className={errors.expiryDate ? "border-red-500" : ""}
              />
              {errors.expiryDate && (
                <p className="text-sm text-red-500">{errors.expiryDate}</p>
              )}
            </div>

            {/* Issuing Authority */}
            <div className="space-y-2">
              <Label htmlFor="issuingAuthority">Issuing Authority *</Label>
              <Input
                id="issuingAuthority"
                value={formData.issuingAuthority}
                onChange={(e) =>
                  handleInputChange("issuingAuthority", e.target.value)
                }
                placeholder="Enter issuing authority"
                className={errors.issuingAuthority ? "border-red-500" : ""}
              />
              {errors.issuingAuthority && (
                <p className="text-sm text-red-500">
                  {errors.issuingAuthority}
                </p>
              )}
            </div>

            {/* Issuing Country */}
            <div className="space-y-2">
              <Label htmlFor="issuingCountry">Issuing Country *</Label>
              <Input
                id="issuingCountry"
                value={formData.issuingCountry}
                onChange={(e) =>
                  handleInputChange("issuingCountry", e.target.value)
                }
                placeholder="Enter issuing country"
                className={errors.issuingCountry ? "border-red-500" : ""}
              />
              {errors.issuingCountry && (
                <p className="text-sm text-red-500">{errors.issuingCountry}</p>
              )}
            </div>

            {/* Declared Value */}
            <div className="space-y-2">
              <Label htmlFor="declaredValue">Declared Value</Label>
              <Input
                id="declaredValue"
                type="number"
                step="0.01"
                value={formData.declaredValue}
                onChange={(e) =>
                  handleInputChange(
                    "declaredValue",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
                className={errors.declaredValue ? "border-red-500" : ""}
              />
              {errors.declaredValue && (
                <p className="text-sm text-red-500">{errors.declaredValue}</p>
              )}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter document description"
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Enter additional notes"
              rows={3}
            />
          </div>

          {/* Requires Approval */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requiresApproval"
              checked={formData.requiresApproval}
              onCheckedChange={(checked) =>
                handleInputChange("requiresApproval", checked)
              }
            />
            <Label htmlFor="requiresApproval">Requires Approval</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Document"
                : "Create Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
