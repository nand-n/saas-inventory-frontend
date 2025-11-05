'use client'
import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Rfi } from "@/types/rfi.types";
import QuestionField from "./questino-field";

const rfiSchema = z.object({
  title: z.string().min(3, "Title is required").max(200, "Title too long"),
  referenceNumber: z.string().min(3, "Reference number is required").max(100, "Reference number too long"),
  introduction: z.string().max(2000, "Introduction too long").optional(),
  purpose: z.string().max(2000, "Purpose too long").optional(),
  background: z.string().max(2000, "Background too long").optional(),
  scopeOfInformation: z.string().max(2000, "Scope too long").optional(),
  responseFormat: z.string().max(1000, "Response format too long").optional(),
  issueDate: z.string().optional(),
  submissionDeadline: z.string().optional(),
  nextSteps: z.string().max(2000, "Next steps too long").optional(),
  confidentialityNotice: z.string().max(2000, "Confidentiality notice too long").optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]),
  questions: z
    .array(
      z.object({
        question: z.string().min(3, "Question is required").max(500, "Question too long"),
        responseType: z.enum(["TEXT", "LONG_TEXT", "NUMBER", "MULTIPLE_CHOICE", "YES_NO", "DATE", "FILE_UPLOAD", "RATING"]).optional(),
        options: z.array(z.string().min(1).max(200)).optional(),
      }).refine(
        (data) => {
          if (data.responseType === "MULTIPLE_CHOICE") {
            return data.options && data.options.length >= 2;
          }
          return true;
        },
        {
          message: "Multiple choice questions must have at least 2 options",
          path: ["options"],
        }
      )
    )
    .optional(),
});

export type RfiFormData = z.infer<typeof rfiSchema>;

interface RfiFormProps {
  onSubmit: (data: RfiFormData) => Promise<void>;
  onCancel: () => void;
  selectedRfi?: Partial<Rfi> & { id?: string };
}

export default function RfiForm({
  onSubmit,
  onCancel,
  selectedRfi,
}: RfiFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<RfiFormData>({
    resolver: zodResolver(rfiSchema),
    defaultValues: {
      title: "",
      referenceNumber: "",
      introduction: "",
      purpose: "",
      background: "",
      scopeOfInformation: "",
      responseFormat: "",
      issueDate: "",
      submissionDeadline: "",
      nextSteps: "",
      confidentialityNotice: "",
      status: "DRAFT",
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (selectedRfi?.id) {
      reset({
        ...selectedRfi,
        issueDate: selectedRfi.issueDate
          ? selectedRfi.issueDate.slice(0, 10)
          : "",
        submissionDeadline: selectedRfi.submissionDeadline
          ? selectedRfi.submissionDeadline.slice(0, 10)
          : "",
      });
    }
  }, [selectedRfi]);

  const addQuestion = () => {
    append({
      question: "",
      responseType: "TEXT",
      options: [],
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>RFI Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              placeholder="RFI-2025-001"
              {...register("referenceNumber")}
            />
            {errors.referenceNumber && (
              <p className="text-sm text-destructive">{errors.referenceNumber.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="ERP Implementation Inquiry"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input id="issueDate" type="date" {...register("issueDate")} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="submissionDeadline">Submission Deadline</Label>
            <Input
              id="submissionDeadline"
              type="date"
              {...register("submissionDeadline")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>RFI Sections</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="introduction">Introduction</Label>
            <Textarea
              id="introduction"
              placeholder="Introduce the purpose of this RFI..."
              {...register("introduction")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea
              id="purpose"
              placeholder="State the goals and why you're requesting this information..."
              {...register("purpose")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="background">Background</Label>
            <Textarea
              id="background"
              placeholder="Provide background about your company or project..."
              {...register("background")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scopeOfInformation">Scope of Information Requested</Label>
            <Textarea
              id="scopeOfInformation"
              placeholder="Explain what kind of information is needed..."
              {...register("scopeOfInformation")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responseFormat">Response Format</Label>
            <Textarea
              id="responseFormat"
              placeholder="e.g., PDF submission, via portal, etc."
              {...register("responseFormat")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nextSteps">Next Steps</Label>
            <Textarea
              id="nextSteps"
              placeholder="Describe what happens after vendor submissions..."
              {...register("nextSteps")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confidentialityNotice">Confidentiality Notice</Label>
            <Textarea
              id="confidentialityNotice"
              placeholder="State the confidentiality clause if applicable..."
              {...register("confidentialityNotice")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Questions to Suppliers</CardTitle>
            <Button type="button" variant="outline" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No questions added yet.
            </p>
          )}
          {fields.map((field, index) => (
            <QuestionField
              key={field.id}
              index={index}
              control={control}
              register={register}
              remove={remove}
              errors={errors}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save RFI"}
        </Button>
      </div>
    </form>
  );
}
