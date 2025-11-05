'use client';

import React, { useEffect, useState } from "react";
import { Button} from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, PlusCircle, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { CreateRfiDto, Rfi, RfiStatus } from "@/types/rfi.types";
import { useRfiStore } from "@/store/rfi/useRfiStore";
import { toast } from "sonner";
import StatsCard from "./_components/stat-card";
import RfiForm from "./_components/rfi-form";
import RfiCard from "./_components/rfi-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import RfiDetail from "./_components/rfi-detail";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import useTenantStore from "@/store/tenant/tenantStore";

export default function RFI_PAGE() {
  const { 
    filteredRfis, 
    fetchRfis, 
    deleteRfi, 
    addRfi, 
    updateRfi, 
    stats,
    applyFilters,
    setFilters, 
    isLoading,
    filters,
    clearFilters
  } = useRfiStore();
  
  const [selectedRfi, setSelectedRfi] = useState<Rfi | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showDetail, setShowDetail] = useState(false);


  useEffect(() => {
    fetchRfis();
  }, [fetchRfis]);

  // --- Handlers ---
  const handleCreate = () => {
    setSelectedRfi(null);
    setShowForm(true);
  };

  const handleEdit = (rfiId: string) => {
    const rfi = filteredRfis.find((r) => r.id === rfiId);
    if (rfi) {
      setSelectedRfi(rfi);
      setShowForm(true);
    }
  };

  const { name : tenantName} = useTenantStore();


  const handleSubmit = async (data: CreateRfiDto) => {
    try {
      if (selectedRfi?.id) {
        await updateRfi(selectedRfi.id, data);
        toast.success("RFI updated successfully");
      } else {
        await addRfi(data);
        toast.success("RFI created successfully");
      }
      setShowForm(false);
      setSelectedRfi(null);
    } catch (error) {
      toast.error("Failed to save RFI");
    }
  };
 const handleDownloadPDF = (rfi: Rfi) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Layout constants (preserve your original margins / sizes but centralize)
  const margin = 10;
  const footerHeight = 18; // keeps room for the footer
  const headerHeight = 12;
  let yPos = margin + headerHeight;

  const primaryColor = "#004080";
  const secondaryColor = "#000000";
  const fontFamily = "helvetica";
  const companyName = tenantName; 
  const logoUrl = undefined; // optional: '/path/to/logo.png'

  // Helpers ========
  const sanitizedTitle = (title = "") =>
    title.replace(/[\/\\?%*:|"<>]/g, "_").replace(/\s+/g, "_").slice(0, 120);

  const ensureSpace = (requiredHeight: number) => {
    // If not enough room, add page and re-render header
    if (yPos + requiredHeight > pageHeight - margin - footerHeight) {
      doc.addPage();
      renderHeader(doc.getNumberOfPages());
      yPos = margin + headerHeight;
    }
  };

  // Render header on the current page (call whenever we add a page)
  const renderHeader = (pageNumber: number) => {
    // Top-left company name
    doc.setFont(fontFamily, "bold");
    doc.setFontSize(10);
    doc.setTextColor(primaryColor);
    doc.text(companyName, margin, margin + 4);

    // Optional logo (safe)
    if (logoUrl) {
      try {
        // try to render a logo - if it's not available or invalid, ignore
        doc.addImage(logoUrl as any, "PNG", pageWidth - margin - 30, margin - 2, 28, 10);
      } catch (e) {
        /* ignore image errors */
      }
    }

    // Page marker (we will replace with final page count after creation)
    doc.setFont(fontFamily, "normal");
    doc.setFontSize(8);
    doc.setTextColor("#333333");
    doc.text(`Page ${pageNumber}`, pageWidth - margin - 20, margin + 4);

    // Divider
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + headerHeight - 2, pageWidth - margin, margin + headerHeight - 2);
  };

  // Footer painter for a specific page number
  const renderFooterOnPage = (pageNum: number) => {
    doc.setPage(pageNum);
    doc.setFont(fontFamily, "normal");
    doc.setFontSize(8);
    doc.setTextColor("#333333");

    // Footer box line
    doc.setLineWidth(0.5);
    doc.rect(margin, pageHeight - margin - footerHeight + 6, pageWidth - margin * 2, footerHeight - 8);

    // Left
    doc.text(
      "DISTRIBUTION: original file via FEAD   PL   ET   A/E   PC#   via the Contracting Officer",
      margin + 2,
      pageHeight - margin - 4,
      { maxWidth: pageWidth - margin * 2 - 4 }
    );

    // Right - month & year
    const monthYear = new Date().toLocaleString("default", { month: "long", year: "numeric" });
    doc.text(`Request For Information Form - ${monthYear}`, pageWidth - margin - 80, pageHeight - margin - 4);
  };

  // (1) Start first page header
  renderHeader(1);
  yPos = margin + headerHeight + 2;

  // === BEGIN: your original content, preserved and enhanced ===

  // RFI Header Title
  ensureSpace(12);
  doc.setFont(fontFamily, "bold");
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor);
  doc.text("REQUEST FOR INFORMATION (RFI)", margin, yPos);
  yPos += 6;

  // Blue box for RFI Number (kept exactly)
  ensureSpace(18);
  doc.setFillColor(primaryColor);
  doc.rect(pageWidth - margin - 60, yPos - 10, 50, 15, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(10);
  doc.text("RFI Number", pageWidth - margin - 55, yPos - 3);
  doc.setTextColor(secondaryColor);
  doc.setFontSize(12);

  // keep original replacement logic
  const safeRef = rfi.referenceNumber ? rfi.referenceNumber.replace("RFI-", "") : "N/A";
  doc.text(`RFI-${safeRef}`, pageWidth - margin - 55, yPos + 7);
  yPos += 12;

  // Draw border for contract details (kept)
  ensureSpace(46);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 40);

  // Contract details in table-like structure (kept)
  doc.setFont(fontFamily, "bold");
  doc.setFontSize(11);
  doc.setTextColor(secondaryColor);
  doc.text("Contract Number:", margin + 5, yPos);
  doc.text("Contract Title:", margin + 70, yPos);
  doc.text("Prime Contractor:", margin + 5, yPos + 10);
  doc.text("Subcontractor / Supplier:", margin + 5, yPos + 20);
  doc.text("Subject of RFI:", margin + 5, yPos + 30);

  doc.setFont(fontFamily, "normal");
  doc.text(rfi.referenceNumber || "N/A", margin + 35, yPos);
  doc.text(rfi.title || "N/A", margin + 95, yPos);
  doc.text(rfi.createdBy?.name || "N/A", margin + 35, yPos + 10);
  doc.text("N/A", margin + 45, yPos + 20);

  // Vertical lines for contract section
  doc.line(margin + 65, yPos - 5, margin + 65, yPos + 35);
  yPos += 40;

  // Subject details row (kept)
  ensureSpace(18);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 10);
  doc.text("Drawings:", margin + 5, yPos);
  doc.text("Details:", margin + 50, yPos);
  doc.text("Specification:", margin + 90, yPos);
  doc.text("CPM Activity #:", margin + 140, yPos);
  doc.line(margin + 45, yPos - 5, margin + 45, yPos + 5);
  doc.line(margin + 85, yPos - 5, margin + 85, yPos + 5);
  doc.line(margin + 135, yPos - 5, margin + 135, yPos + 5);
  yPos += 12;

  // Information Requested section (kept; with dynamic wrap)
  doc.setFont(fontFamily, "bold");
  doc.setFontSize(11);
  doc.text("Information Requested:", margin + 5, yPos);
  yPos += 8;

  const infoBoxHeight = 35;
  ensureSpace(infoBoxHeight + 6);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, infoBoxHeight);

  const infoContent = [
    rfi.introduction || "",
    rfi.purpose || "",
    rfi.background || "",
    rfi.scopeOfInformation || "",
    rfi.responseFormat || "",
    rfi.confidentialityNotice || "",
    rfi.remarks || "",
  ]
    .filter(Boolean)
    .join("\n\n");

  doc.setFont(fontFamily, "normal");
  const infoLines = doc.splitTextToSize(infoContent || "N/A", pageWidth - margin * 2 - 10);
  // splitTextToSize returns array; render and update yPos appropriately
  let currentLineY = yPos + 3;
  infoLines.forEach((ln: string | string[]) => {
    ensureSpace(6);
    doc.text(ln, margin + 5, currentLineY);
    currentLineY += 5;
  });
  yPos = currentLineY + 2;

  // Dates and signature row (kept)
  ensureSpace(18);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 10);
  doc.setFont(fontFamily, "bold");
  doc.text("Date Response Required By:", margin + 5, yPos);
  doc.text("Date RFI Submitted:", margin + 70, yPos);
  doc.text("Signature:", margin + 120, yPos);
  doc.setFont(fontFamily, "normal");
  doc.text(rfi.submissionDeadline || "N/A", margin + 50, yPos);
  doc.text(rfi.issueDate || (rfi.createdAt ? new Date(rfi.createdAt).toLocaleDateString() : "N/A"), margin + 95, yPos);
  doc.text(rfi.createdBy?.name || "", margin + 135, yPos);
  doc.line(margin + 65, yPos - 5, margin + 65, yPos + 5);
  doc.line(margin + 115, yPos - 5, margin + 115, yPos + 5);
  yPos += 16;

  // Contractor Recommendation section (kept)
  doc.setFont(fontFamily, "bold");
  doc.text("Contractor Recommendation:", margin + 5, yPos);
  yPos += 8;
  ensureSpace(40);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 30); // blank area
  const recLines = doc.splitTextToSize(rfi.remarks || "N/A", pageWidth - margin * 2 - 10);
  let recY = yPos + 3;
  doc.setFont(fontFamily, "normal");
  recLines.forEach((ln: string | string[]) => {
    ensureSpace(6);
    doc.text(ln, margin + 5, recY);
    recY += 5;
  });
  yPos = recY + 4;

  // Cost Effect and Time Impact (kept)
  ensureSpace(28);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 20);
  doc.setFont(fontFamily, "bold");
  doc.text("Cost Effect:", margin + 5, yPos);
  doc.text("Increase: [] Decrease: [] None: [X] Estimated Amount: N/A", margin + 30, yPos);
  yPos += 10;
  doc.setFont(fontFamily, "bold");
  doc.text("Time Impact:", margin + 5, yPos);
  doc.text("Increase: [] Decrease: [] None: [X] Estimated Calendar Days: N/A", margin + 30, yPos);
  yPos += 16;

  // From, To, Reply Date, Signature (kept)
  ensureSpace(18);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 10);
  doc.setFont(fontFamily, "bold");
  doc.text("From:", margin + 5, yPos);
  doc.text("Reply Date:", margin + 70, yPos);
  doc.text("Signature:", margin + 120, yPos);
  doc.setFont(fontFamily, "normal");
  doc.text("N/A", margin + 20, yPos);
  doc.text(rfi.updatedAt ? new Date(rfi.updatedAt).toLocaleDateString() : "N/A", margin + 85, yPos);
  doc.text("N/A", margin + 135, yPos);
  doc.line(margin + 65, yPos - 5, margin + 65, yPos + 5);
  doc.line(margin + 115, yPos - 5, margin + 115, yPos + 5);
  yPos += 12;

  // To: (kept)
  ensureSpace(20);
  doc.setFont(fontFamily, "bold");
  doc.text("To:", margin + 5, yPos);
  yPos += 8;
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 10);
  doc.setFont(fontFamily, "normal");
  doc.text(rfi.createdBy?.name || "N/A", margin + 20, yPos);
  yPos += 14;

  // Reply section (kept)
  ensureSpace(32);
  doc.setFont(fontFamily, "bold");
  doc.text("Reply:", margin + 5, yPos);
  yPos += 8;
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 20);
  const replyContent = rfi.nextSteps || "N/A";
  const replyLines = doc.splitTextToSize(replyContent, pageWidth - margin * 2 - 10);
  let replyY = yPos + 3;
  doc.setFont(fontFamily, "normal");
  replyLines.forEach((ln: string | string[]) => {
    ensureSpace(6);
    doc.text(ln, margin + 5, replyY);
    replyY += 5;
  });
  yPos = replyY + 6;

  // Reply checkboxes (kept)
  ensureSpace(50);
  doc.text(
    "a. [] This response is for clarification only and results in no cost or time change to the contract.",
    margin + 5,
    yPos
  );
  yPos += 8;
  doc.text(
    "b. [] This response requires a modification to the contract. A formal request for proposal will follow under separate correspondence. No work is authorized until the modification is signed by the Contracting Officer. The assigned Proposed Change (PC) is ______.",
    margin + 5,
    yPos,
    { maxWidth: pageWidth - margin * 2 - 10 }
  );
  yPos += 18;

  // Note (kept)
  doc.setFontSize(9);
  const note =
    "The RFI process is intended to provide an efficient mechanism for responding to contractor’s requests for information ONLY. This system DOES NOT authorize the contractor to proceed with work. To do so, the contractor proceeds at his own risk. If the contractor considers the RFI response a change, written notice to the Contracting Officer is required within 20 calendar days of the reply date.";
  const noteLines = doc.splitTextToSize(note, pageWidth - margin * 2);
  ensureSpace(noteLines.length * 6 + 6);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, noteLines.length * 7 + 6);
  let noteY = yPos + 4;
  noteLines.forEach((ln: string | string[]) => {
    ensureSpace(6);
    doc.text(ln, margin + 5, noteY);
    noteY += 5;
  });
  yPos = noteY + 8;

  // Finalize first part footer (we'll add footers at the end for all pages)
  // Attachments and Questions (kept, using autoTable for attachments)
  if ((rfi.attachments?.length ?? 0) || (rfi.questions?.length ?? 0)) {
    // ensure room
    ensureSpace(20);
    if (rfi.attachments?.length) {
      doc.setFont(fontFamily, "bold");
      doc.setFontSize(13);
      doc.text("Attachments", margin, yPos);
      yPos += 8;

      autoTable(doc, {
        startY: yPos,
        head: [["Name", "URL"]],
        body: (rfi.attachments || []).map((att) => [att.name, att.url]),
        theme: "striped",
        margin: { left: margin, right: margin },
        styles: { font: fontFamily, textColor: secondaryColor, fontSize: 10 },
        headStyles: { fillColor: primaryColor, textColor: "#FFFFFF" },
      });
      // update yPos to below the table
      yPos = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : yPos + 8;
    }

    if (rfi.questions?.length) {
      doc.setFont(fontFamily, "bold");
      doc.setFontSize(13);
      doc.text("Questions", margin, yPos);
      yPos += 8;

      rfi.questions.forEach((q, idx) => {
        ensureSpace(20);
        // Make sure question lines don't overflow
        doc.setFont(fontFamily, "bold");
        doc.setFontSize(11);
        const qText = `${idx + 1}. ${q.question}`;
        const qLines = doc.splitTextToSize(qText, pageWidth - margin * 2);
        qLines.forEach((l: string | string[]) => {
          ensureSpace(6);
          doc.text(l, margin, yPos);
          yPos += 5;
        });

        // Response area depending on type (kept your original switch)
        doc.setFont(fontFamily, "normal");
        doc.setFontSize(11);
        switch (q.responseType) {
          case "TEXT":
          case "LONG_TEXT":
            ensureSpace(8);
            doc.text("Response:", margin + 10, yPos);
            yPos += 5;
            doc.line(margin + 10, yPos, pageWidth - margin, yPos);
            yPos += q.responseType === "LONG_TEXT" ? 40 : 15;
            doc.line(margin + 10, yPos, pageWidth - margin, yPos);
            yPos += 4;
            break;
          case "NUMBER":
            ensureSpace(18);
            doc.text("Response: __________", margin + 10, yPos);
            yPos += 16;
            break;
          case "YES_NO":
            ensureSpace(18);
            doc.text("[ ] Yes    [ ] No", margin + 10, yPos);
            yPos += 16;
            break;
          case "MULTIPLE_CHOICE":
            if (q.options?.length) {
              q.options.forEach((opt) => {
                ensureSpace(12);
                doc.text(`[ ] ${opt}`, margin + 10, yPos);
                yPos += 10;
              });
            } else {
              ensureSpace(18);
              doc.text("Response: __________", margin + 10, yPos);
              yPos += 16;
            }
            break;
          case "DATE":
            ensureSpace(18);
            doc.text("Response: ____ / ____ / ______", margin + 10, yPos);
            yPos += 16;
            break;
          case "FILE_UPLOAD":
            ensureSpace(18);
            doc.text("Attach file here or provide reference:", margin + 10, yPos);
            yPos += 16;
            break;
          case "RATING":
            ensureSpace(18);
            doc.text("Rate: [1] [2] [3] [4] [5]", margin + 10, yPos);
            yPos += 16;
            break;
          default:
            ensureSpace(18);
            doc.text("Response: __________", margin + 10, yPos);
            yPos += 16;
        }
      });
    }
  }

  // Page 2: Instructions (kept all content intact)
  doc.addPage();
  renderHeader(doc.getNumberOfPages());
  yPos = margin + headerHeight + 4;

  doc.setFont(fontFamily, "bold");
  doc.setFontSize(12);
  doc.text("INSTRUCTIONS FOR COMPLETING REQUEST FOR INFORMATION FORM", margin, yPos);
  yPos += 12;

  autoTable(doc, {
    startY: yPos,
    theme: "grid",
    columnStyles: { 0: { cellWidth: (pageWidth - margin * 2) / 2 }, 1: { cellWidth: (pageWidth - margin * 2) / 2 } },
    styles: { font: fontFamily, fontSize: 9, textColor: secondaryColor, overflow: "linebreak" },
    headStyles: { fillColor: primaryColor, textColor: "#FFFFFF" },
    head: [["FOR THE CONTRACTOR", "FOR GOVERNMENT PERSONNEL"]],
    body: [
      ["Item 1. Enter three-digit RFI number.", "Item 9. Name of government official responding to RFI."],
      ["Item 2. Self-explanatory.", "Item 10. Name of contractor point of contact."],
      ["Item 3. Self-explanatory.", "Item 11. Enter date of RFI response."],
      ["Item 4. Self-explanatory.", "Item 12. Signature of official responding to RFI."],
      [
        "Item 5. Self-explanatory.",
        "Item 13. Provide a reply considering cost, schedule, safety, quality, client request, other risks, etc. At no time will the RFI response authorize the contractor to start work. Only the Contracting Officer may authorize additional or changed work.",
      ],
      [
        "Item 6. Self-explanatory.\na. Specify any drawing numbers related to the RFI (if applicable)\nb. Specify any detail numbers related to the RFI (if applicable)\nc. Specify the specification number related to the RFI (if applicable)\nd. Specify Critical Path Method (CPM)/Schedule Activity # (if applicable).",
        "a. Indicate in the check box if the response is for clarification only.\nb. Indicate in the check box if the response requires a modification to be issued to the contract. If applicable, include the assigned Proposed Change (PC) number.",
      ],
      [
        "Item 7. Provide a narrative detailing the requested information or requested design change.\na. Specify date response is requested.\nb. Enter date RFI submitted.\nc. Signature of preparer of RFI.",
        "",
      ],
      [
        "Item 8. If possible, provide a recommended solution to the problem and state if the proposed solution may be considered a change to the contract.\na. Indicate in the check box the cost effect. If applicable, provide estimated amount.\nb. Indicate in the check box the time impact. If applicable, provide estimated calendar days.",
        "",
      ],
    ],
  });

  // Add consistent footers to all pages and final page numbering
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    renderFooterOnPage(p);
  }

  // Optional: update page number text to "Page X of Y" on each header
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont(fontFamily, "normal");
    doc.setFontSize(8);
    doc.setTextColor("#333333");
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - 30, margin + 4);
  }

  // Save the PDF (sanitize title)
  const filename = `${rfi.referenceNumber || "RFI"}_${sanitizedTitle(rfi.title || "untitled")}.pdf`;
  doc.save(filename);
};
const handleCancel = () => {
    setShowForm(false);
    setSelectedRfi(null);
  };

  const handlePublish = async (id: string) => {
    try {
      await updateRfi(id, { status: RfiStatus.PUBLISHED });
      toast.success("RFI published successfully");
    } catch (error) {
      toast.error("Failed to publish RFI");
    }
  };

  const handleClose = async (id: string) => {
    try {
      await updateRfi(id, { status: RfiStatus.CLOSED });
      toast.success("RFI closed successfully");
    } catch (error) {
      toast.error("Failed to close RFI");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRfi(id);
      toast.success("RFI deleted successfully");
    } catch (error) {
      toast.error("Failed to delete RFI");
    }
  };

  // --- Filtering ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setFilters({ ...filters, search: e.target.value });
  };

  const handleClearFilters = () => {
    setSearchText("");
    clearFilters();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">RFI Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your Request for Information documents and supplier responses
            </p>
          </div>
          <Button onClick={handleCreate} size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Create New RFI
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard title="Total RFIs" value={stats.total} icon={FileText} colorClass="text-primary" />
          <StatsCard title="Draft" value={stats.draft} icon={Clock} colorClass="text-muted-foreground" />
          <StatsCard title="Published" value={stats.published} icon={CheckCircle} colorClass="text-accent" />
          <StatsCard title="Closed" value={stats.closed} icon={XCircle} colorClass="text-success" />
        </div>

        {/* Search / Filter */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search RFIs..."
            value={searchText}
            onChange={handleSearchChange}
            className="flex-1"
          />
          <Button variant="outline" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle>{selectedRfi ? "Edit RFI" : "Create New RFI"}</DialogTitle>
            <DialogDescription>
              {selectedRfi
                ? "Update the RFI details below."
                : "Fill out the form to create a new RFI."}
            </DialogDescription>

            <RfiForm
              onSubmit={async (data) => {
                await handleSubmit({ ...data, status: data.status as RfiStatus });
              }}
              onCancel={handleCancel}
              selectedRfi={selectedRfi || undefined}
            />

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* RFI Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your RFIs</h2>
          {filteredRfis.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No RFIs yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first Request for Information
                </p>
                <Button onClick={handleCreate} variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First RFI
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRfis.map((rfi) => (
                <RfiCard
                  key={rfi.id}
                  rfi={rfi}
                  onEdit={() => handleEdit(rfi.id)}
                  onDelete={() => handleDelete(rfi.id)}
                  onPublish={() => handlePublish(rfi.id)}
                  onClose={() => handleClose(rfi.id)}
                  onClick={() => {setSelectedRfi(rfi); setShowDetail(true)}} 
                />
              ))}

     <Dialog open={showDetail} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mt-3">
              <DialogTitle className="flex justify-between items-center">
              <div className="">RFI Details</div> 
             <Button 
                variant="outline" 
                onClick={() => selectedRfi && handleDownloadPDF(selectedRfi)}
                className="gap-2 "
              >
                <FileText className="h-4 w-4" />
                Download PDF
              </Button>
              </DialogTitle>
              <DialogDescription>
                Detailed view of the selected Request for Information
              </DialogDescription>

              
            </DialogHeader>


            {selectedRfi && <RfiDetail rfi={selectedRfi} />}

            <DialogFooter className="mt-4 sm:justify-between">
             
              <Button variant="outline" onClick={() => setShowDetail(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
