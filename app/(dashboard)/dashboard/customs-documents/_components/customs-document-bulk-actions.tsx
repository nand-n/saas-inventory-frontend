"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Download, Eye, CheckCircle, XCircle } from "lucide-react";

interface CustomsDocumentBulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
}

export default function CustomsDocumentBulkActions({
  selectedCount,
  onDelete,
  onClearSelection,
}: CustomsDocumentBulkActionsProps) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCount} document{selectedCount !== 1 ? 's' : ''} selected
            </Badge>
            <span className="text-sm text-blue-700">
              Select actions to perform on {selectedCount} document{selectedCount !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Selected
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Selected
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Selected
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-blue-700 hover:bg-blue-100"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
