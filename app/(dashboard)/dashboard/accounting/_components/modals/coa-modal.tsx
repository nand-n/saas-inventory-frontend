"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/commons/modalWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import { Progress } from "@/components/ui/progress";

type ChartOfAccount = {
  id?: string;
  name: string;
  code: string;
  description?: string;
  categoryId: string;
};

type Category = { id: string; name: string };

type CoaModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: Partial<ChartOfAccount>;
  setFormData: (data: Partial<ChartOfAccount>) => void;
  onSave: (entries: ChartOfAccount | ChartOfAccount[]) => Promise<void>;
  categories: Category[];
  isBulk: boolean;
  setIsBulk: (isBulk: boolean) => void;
};

export default function CoaModal({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  onSave,
  categories = [],
  isBulk,
  setIsBulk,
}: CoaModalProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<ChartOfAccount[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentProcessing, setCurrentProcessing] = useState(0);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const ACCEPT = [".csv", ".xls", ".xlsx", ".xlsm"].join(",");

  // Sync local uploadMode state from isBulk prop
  const uploadMode = isBulk;

  // Parse Excel/CSV file
  const parseFile = async (file: File) => {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<any>(sheet, { header: 0 });

    const rows = raw.map((r) => ({
      name: (r["Name"] || r["name"] || "").trim(),
      code: (r["Code"] || r["code"] || "").trim(),
      description: (r["Description"] || r["description"] || "").trim(),
      categoryId: formData.categoryId || "",
    }));

    setPreviewRows(rows);
    setIsBulk(true);
  };

  useEffect(() => {
    if (uploadMode && previewRows.length) {
      setPreviewRows((rows) =>
        rows.map((r) => ({
          ...r,
          categoryId: formData.categoryId || "",
        }))
      );
    }
  }, [formData.categoryId]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setUploadedFile(f);
      parseFile(f);
    }
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setUploadedFile(f);
      parseFile(f);
    }
  };

  const resetAll = () => {
    setUploadedFile(null);
    setPreviewRows([]);
    setIsBulk(false);
    setFormData({ name: "", code: "", description: "", categoryId: "" });
    setProgress(0);
    setCurrentProcessing(0);
    setProcessingError(null);
    setIsProcessing(false);
  };

  const handleConfirm = async () => {
    setProcessingError(null);
    setIsProcessing(true);
    setProgress(0);
    setCurrentProcessing(0);

    try {
      if (uploadMode) {
        // Validate all rows
        const invalidRows = previewRows.filter(
          (row) =>
            !row.name || !row.code || !(row.categoryId || formData.categoryId)
        );

        if (invalidRows.length > 0) {
          throw new Error(
            `Some rows are missing required fields: ${invalidRows.length} invalid rows`
          );
        }

        const rowsToUpload = previewRows.map((row) => ({
          ...row,
          categoryId: row.categoryId || formData.categoryId || "",
        }));

        await onSave(rowsToUpload);
        setProgress(100);
      } else {
        const payload: ChartOfAccount = {
          name: formData.name!,
          code: formData.code!,
          description: formData.description || "",
          categoryId: formData.categoryId!,
        };

        if (!payload.name || !payload.code || !payload.categoryId) {
          throw new Error("Form is missing required fields");
        }

        await onSave(payload);
        setProgress(100);
      }

      resetAll();
    } catch (error) {
      setProcessingError((error as Error).message);
    } finally {
      setIsProcessing(false);
      setIsBulk(false);
    }
  };

  return (
    <Modal
      title={
        uploadMode ? "Bulk Upload COA" : formData.id ? "Edit COA" : "Add COA"
      }
      description="Fill in or upload chart of accounts"
      open={isOpen}
      onOpenChange={(o) => {
        if (!o) resetAll();
        setIsOpen(o);
      }}
      onCancel={() => {
        resetAll();
        setIsOpen(false);
      }}
      onConfirm={handleConfirm}
    >
      <div className="space-y-4 py-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={uploadMode}
            onChange={(e) => {
              setIsBulk(e.target.checked);
              setUploadedFile(null);
              setPreviewRows([]);
            }}
            className="h-4 w-4"
            disabled={isProcessing}
          />
          <span className="text-sm">Bulk Upload from File</span>
        </label>

        {uploadMode && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-400 p-4 rounded-md text-center cursor-pointer"
          >
            <p className="text-sm mb-2">
              {uploadedFile
                ? `File: ${uploadedFile.name}`
                : "Drag & drop CSV/Excel here, or click to select"}
            </p>
            <input
              id="coa-upload"
              type="file"
              accept={ACCEPT}
              onChange={handleSelectFile}
              className="hidden"
              disabled={isProcessing}
            />
            <label
              htmlFor="coa-upload"
              className={`inline-block text-xs px-3 py-1 rounded cursor-pointer ${
                uploadedFile
                  ? "bg-gray-200 text-gray-700"
                  : "bg-primary text-white"
              }`}
            >
              {uploadedFile ? "Change File" : "Select File"}
            </label>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Category</label>
          <Select
            value={formData.categoryId || ""}
            onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
            disabled={isProcessing}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!uploadMode && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <Input
                placeholder="Account Name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Code</label>
              <Input
                placeholder="Account Code"
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <Input
                placeholder="Description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isProcessing}
              />
            </div>
          </div>
        )}

        {uploadMode && previewRows.length > 0 && (
          <div className="space-y-4">
            <div className="max-h-48 overflow-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((r, i) => (
                    <tr
                      key={i}
                      className={`border-t ${
                        currentProcessing === i + 1 ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.code}</td>
                      <td className="p-2">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading... {progress}%</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </div>
        )}

        {processingError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded text-sm">
            Error: {processingError}
          </div>
        )}

        {isProcessing && !uploadMode && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Saving account information...
          </div>
        )}
      </div>
    </Modal>
  );
}
