import React, { useState } from "react";
import { useForm, FormProvider, useFieldArray, useFormContext, Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// -----------------------------------------------------
// 1. SCHEMA & TYPES
// -----------------------------------------------------
const planningFormSchema = z.object({
  name: z.string().min(1, "Name is required"),

  // SUPPLY
  forecastMonthlyDemand: z.coerce.number().optional(),
  forecastHorizonMonths: z.coerce.number().optional(),
  currentOnHand: z.coerce.number().optional(),
  leadTimeWeeks: z.coerce.number().optional(),
  desiredServiceLevel: z.coerce.number().optional(),
  shelfLifeMonths: z.coerce.number().optional(),
  minRemainingShelfLifeMonths: z.coerce.number().optional(),
  moq: z.coerce.number().optional(),
  packagingMultiple: z.coerce.number().optional(),
  safetyFactor: z.coerce.number().optional(),

  // RESOURCE
  resources: z.object({
    manpower: z.coerce.number().optional(),
    equipment: z.array(z.string()),
    budget: z.coerce.number().optional(),
    departmentsInvolved: z.array(z.string()),
  }),

  // TIME
  timeline: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    milestones: z.array(
      z.object({
        name: z.string(),
        targetDate: z.string(),
        status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]).optional(),
      })
    ),
  }),

  // CAPACITY
  capacity: z.object({
    productionLines: z.coerce.number().optional(),
    maxOutputPerDay: z.coerce.number().optional(),
    currentUtilization: z.coerce.number().optional(),
    bottlenecks: z.array(z.string()),
  }),
});

type PlanningFormData = z.infer<typeof planningFormSchema>;

interface PlanningFormProps {
  onSubmit: (data: PlanningFormData) => Promise<void>;
  onCancel: () => void;
}

// -----------------------------------------------------
// 2. STEP COMPONENTS
// -----------------------------------------------------

function StepBasicInfo() {
  const { register } = useFormContext<PlanningFormData>();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Basic Information</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Planning Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Planning Name"
          className="border p-2 rounded-md w-full"
        />
      </div>
    </div>
  );
}

function StepSupply() {
  const { register } = useFormContext<PlanningFormData>();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Supply Configuration</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input min={1} {...register("forecastMonthlyDemand")} label="Forecast Monthly Demand" type="number" className="border p-2 rounded-md" />
        <Input min={1} {...register("forecastHorizonMonths")} label="Forecast Horizon (Months)" type="number" className="border p-2 rounded-md" />
        <Input min={1} {...register("currentOnHand")} label="Current On Hand" type="number" className="border p-2 rounded-md" />
        <Input min={1} {...register("leadTimeWeeks")} label="Lead Time (Weeks)" type="number" className="border p-2 rounded-md" />
        <Input min={1} {...register("desiredServiceLevel")} label="Desired Service Level (%)" type="number" className="border p-2 rounded-md" />
        <Input min={1} {...register("shelfLifeMonths")} label="Shelf Life (Months)" type="number" className="border p-2 rounded-md" />
        <Input min={1} {...register("minRemainingShelfLifeMonths")} label="Min Remaining Shelf Life (Months)" type="number" className="border p-2 rounded-md" />
        <Input min={1} {...register("moq")} label="MOQ" type="number" className="border p-2 rounded-md" />
        <Input min={1} {...register("packagingMultiple")} label="Packaging Multiple" type="number" className="border p-2 rounded-md" />
        <Input min={1} {...register("safetyFactor")} label="Safety Factor" type="number" className="border p-2 rounded-md" />
      </div>
    </div>
  );
}

function StepResources() {
  const { register, control } = useFormContext<PlanningFormData>();

  const equipmentField = useFieldArray({
    name: "resources.equipment",
    control: control as any,
  });

  const departmentsField = useFieldArray({
    name: "resources.departmentsInvolved",
    control: control as any,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Resource Planning</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register("resources.manpower")}
          placeholder="Manpower"
          type="number"
          className="border p-2 rounded-md"
        />
        <Input
          {...register("resources.budget")}
          placeholder="Budget"
          type="number"
          className="border p-2 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Equipment</h3>

        {equipmentField.fields.length === 0 && (
          <p className="text-sm text-muted-foreground">No equipment added yet.</p>
        )}

        {equipmentField.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...register(`resources.equipment.${index}`)}
              placeholder={`Equipment #${index + 1}`}
              className="border p-2 rounded-md flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => equipmentField.remove(index)}
              className="px-3"
            >
              –
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={() => equipmentField.append("")}
          className="mt-1"
        >
          + Add Equipment
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Departments Involved</h3>

        {departmentsField.fields.length === 0 && (
          <p className="text-sm text-muted-foreground">No departments added yet.</p>
        )}

        {departmentsField.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              {...register(`resources.departmentsInvolved.${index}`)}
              placeholder={`Department #${index + 1}`}
              className="border p-2 rounded-md flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => departmentsField.remove(index)}
              className="px-3"
            >
              –
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={() => departmentsField.append("")}
          className="mt-1"
        >
          + Add Department
        </Button>
      </div>
    </div>
  );
}

function StepTimeline() {
  const { register, control } = useFormContext<PlanningFormData>();
  const milestonesField = useFieldArray({ 
    name: "timeline.milestones", 
    control: control as any,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Timeline Setup</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            {...register("timeline.startDate")}
            placeholder="Start Date"
            type="date"
            className="border p-2 rounded-md"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            {...register("timeline.endDate")}
            placeholder="End Date"
            type="date"
            className="border p-2 rounded-md"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Milestones</h3>
        {milestonesField.fields.map((field, idx) => (
          <div key={field.id} className="flex items-center justify-start gap-2">
            <div className="grid grid-cols-2 gap-2 items-center flex-1">
              <div className="space-y-2">
                <Label htmlFor={`milestone-name-${idx}`}>Name</Label>
                <Input
                  id={`milestone-name-${idx}`}
                  {...register(`timeline.milestones.${idx}.name`)}
                  placeholder={`Milestone #${idx + 1} Name`}
                  className="border p-2 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`milestone-date-${idx}`}>Target Date</Label>
                <Input
                  id={`milestone-date-${idx}`}
                  {...register(`timeline.milestones.${idx}.targetDate`)}
                  type="date"
                  placeholder="Target Date"
                  className="border p-2 rounded-md"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => milestonesField.remove(idx)}
              className="mt-6"
            >
              –
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() => milestonesField.append({ name: "", targetDate: "" })}
        >
          + Add Milestone
        </Button>
      </div>
    </div>
  );
}

function StepCapacity() {
  const { register, control } = useFormContext<PlanningFormData>();
  const bottlenecksField = useFieldArray({
    name: "capacity.bottlenecks",
    control: control as any,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Capacity Planning</h2>
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register("capacity.productionLines")}
          placeholder="Production Lines"
          type="number"
          className="border p-2 rounded-md"
        />
        <Input
          {...register("capacity.maxOutputPerDay")}
          placeholder="Max Output/Day"
          type="number"
          className="border p-2 rounded-md"
        />
        <Input
          {...register("capacity.currentUtilization")}
          placeholder="Current Utilization (%)"
          type="number"
          className="border p-2 rounded-md"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Bottlenecks</h3>
        {bottlenecksField.fields.length === 0 && (
          <p className="text-sm text-muted-foreground">No bottlenecks added yet.</p>
        )}
        {bottlenecksField.fields.map((field, idx) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Input
              {...register(`capacity.bottlenecks.${idx}`)}
              placeholder={`Bottleneck #${idx + 1}`}
              className="border p-2 rounded-md flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => bottlenecksField.remove(idx)}
            >
              –
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() => bottlenecksField.append("")}
        >
          + Add Bottleneck
        </Button>
      </div>
    </div>
  );
}

function StepReview() {
  const { getValues } = useFormContext<PlanningFormData>();
  const data = getValues();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Review & Submit</h2>
      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

// -----------------------------------------------------
// 3. MAIN COMPONENT
// -----------------------------------------------------

export default function PlanningForm({ onSubmit, onCancel }: PlanningFormProps) {
  const methods = useForm<PlanningFormData>({
    resolver: zodResolver(planningFormSchema),
    defaultValues: {
      resources: {
        equipment: [],
        departmentsInvolved: [],
      },
      timeline: {
        milestones: [],
      },
      capacity: {
        bottlenecks: [],
      },
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, name: "Basic", component: StepBasicInfo },
    { id: 2, name: "Supply", component: StepSupply },
    { id: 3, name: "Resources", component: StepResources },
    { id: 4, name: "Timeline", component: StepTimeline },
    { id: 5, name: "Capacity", component: StepCapacity },
    { id: 6, name: "Review", component: StepReview },
  ];

  const CurrentComponent = steps[currentStep - 1].component;

  const nextStep = async () => {
    const valid = await methods.trigger();
    if (valid && currentStep < steps.length) {
      setCurrentStep((s) => s + 1);
    }
  };
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleFinalSubmit = methods.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFinalSubmit} className="w-full space-y-6 px-2">
        {/* Progress */}
        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-full border-2",
                      currentStep > step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : currentStep === step.id
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-xs mt-2">{step.name}</p>
                </div>
                {idx < steps.length - 1 && <div className="h-0.5 w-full bg-muted mx-2" />}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            <CurrentComponent />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onCancel : prevStep}
            type="button"
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>
          {currentStep < steps.length ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
