"use client";

import React, { useState, useEffect } from "react";
import { Control, Controller, UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Trash2 } from "lucide-react";
import { RfiFormData } from "./rfi-form";

interface QuestionFieldProps {
  index: number;
  control: Control<RfiFormData>;
  register: UseFormRegister<RfiFormData>;
  remove: (index: number) => void;
  errors: FieldErrors<RfiFormData>;
}

export default function QuestionField({
  index,
  control,
  register,
  remove,
  errors,
}: QuestionFieldProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  const addOption = () => {
    if (newOption.trim()) {
      setOptions((prev) => [...prev, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeOption = (optionIndex: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== optionIndex));
  };

  return (
    <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
      {/* Question Input */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
          <Input
            id={`question-${index}`}
            placeholder="Enter supplier question..."
            {...register(`questions.${index}.question`)}
          />
          {errors.questions?.[index]?.question && (
            <p className="text-sm text-destructive">
              {errors.questions[index]?.question?.message}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => remove(index)}
          className="mt-7"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Response Type Selector */}
      <div className="space-y-2">
        <Label htmlFor={`responseType-${index}`}>Response Type</Label>
        <Controller
          control={control}
          name={`questions.${index}.responseType`}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                if (value !== "MULTIPLE_CHOICE") setOptions([]);
              }}
            >
              <SelectTrigger id={`responseType-${index}`}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Short Text</SelectItem>
                <SelectItem value="LONG_TEXT">Long Text (Paragraph)</SelectItem>
                <SelectItem value="NUMBER">Number</SelectItem>
                <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                <SelectItem value="YES_NO">Yes/No</SelectItem>
                <SelectItem value="DATE">Date</SelectItem>
                <SelectItem value="FILE_UPLOAD">File Upload</SelectItem>
                <SelectItem value="RATING">Rating (1-5)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Multiple Choice Options */}
      <Controller
        control={control}
        name={`questions.${index}.responseType`}
        render={({ field }) => {
          if (field.value !== "MULTIPLE_CHOICE") return <></>;

          return (
            <div className="space-y-3 p-4 bg-background rounded-md border border-primary/20">
              <Label className="text-sm font-semibold">Options</Label>

              {options.length > 0 && (
                <div className="space-y-2">
                  {options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex items-center gap-2 p-2 bg-muted rounded-md"
                    >
                      <span className="flex-1 text-sm">{option}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(optIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Enter an option..."
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <Controller
                control={control}
                name={`questions.${index}.options`}
                render={({ field: { onChange: onRHFOptionsChange } }) => {
              useEffect(() => {
                onRHFOptionsChange(options);
              }, [options]); 
              return <></>;
            }}
              />

              {errors.questions?.[index]?.options && (
                <p className="text-sm text-destructive">
                  {errors.questions[index]?.options?.message}
                </p>
              )}

              {options.length < 2 && (
                <p className="text-xs text-muted-foreground">
                  Add at least 2 options for multiple choice questions
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
