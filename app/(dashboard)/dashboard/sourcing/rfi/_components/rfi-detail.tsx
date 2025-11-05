'use client';

import React from "react";
import { Rfi } from "@/types/rfi.types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface RfiDetailProps {
  rfi: Rfi;
}

export default function RfiDetail({ rfi }: RfiDetailProps) {
  return (
    <Card className="shadow-lg rounded-xl border border-muted/20">
      <CardContent className="space-y-6 p-6">

        {/* Header */}
        <div className="border-b border-muted/30 pb-4">
          <h2 className="text-2xl font-bold">{rfi.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Reference: {rfi.referenceNumber} | Status: <span className="font-medium">{rfi.status}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Created by: {rfi.createdBy?.name || "Unknown"}
          </p>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          {rfi.issueDate && (
            <div>
              <Label className="text-muted-foreground">Issue Date</Label>
              <p>{new Date(rfi.issueDate).toLocaleDateString()}</p>
            </div>
          )}
          {rfi.submissionDeadline && (
            <div>
              <Label className="text-muted-foreground">Submission Deadline</Label>
              <p>{new Date(rfi.submissionDeadline).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Sections */}
        {[
          { title: "Introduction", content: rfi.introduction },
          { title: "Purpose", content: rfi.purpose },
          { title: "Background", content: rfi.background },
          { title: "Scope of Information", content: rfi.scopeOfInformation },
          { title: "Response Format", content: rfi.responseFormat },
          { title: "Next Steps", content: rfi.nextSteps },
          { title: "Confidentiality Notice", content: rfi.confidentialityNotice },
          { title: "Remarks", content: rfi.remarks },
        ].map(
          (section, idx) =>
            section.content && (
              <div key={idx}>
                <Label className="text-muted-foreground">{section.title}</Label>
                <p className="text-sm">{section.content}</p>
              </div>
            )
        )}

        {/* Attachments */}
        {(rfi?.attachments?.length ?? 0) > 0 && (
          <div>
            <Label className="text-muted-foreground">Attachments</Label>
            <ul className="list-disc pl-5 space-y-1">
              {rfi?.attachments?.map((att, i) => (
                <li key={i}>
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {att.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Questions */}
        {rfi.questions.length > 0 && (
          <div>
            <Label className="text-muted-foreground">Questions</Label>
            <ul className="list-decimal pl-5 space-y-3">
              {rfi.questions.map((q, idx) => (
                <li key={idx}>
                  <p className="font-medium">{q.question}</p>
                  {q.responseType === "MULTIPLE_CHOICE" && q?.options && q?.options?.length > 0 && (
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  )}
                  {q.responseType !== "MULTIPLE_CHOICE" && (
                    <p className="text-sm text-muted-foreground">{q.responseType}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground border-t border-muted/30 pt-4">
          <div>
            <Label>Created At</Label>
            <p>{new Date(rfi.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <Label>Last Updated</Label>
            <p>{new Date(rfi.updatedAt).toLocaleString()}</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
