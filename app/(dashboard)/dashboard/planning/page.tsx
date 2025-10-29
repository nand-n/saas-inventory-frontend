"use client";

import { useState, useEffect } from "react";
import { PlanningList } from "./_components/planning-list";
import { usePlanningStore } from "@/store/planning/usePlanningStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Planning } from "@/types/planning.type";
import { PlanningDetail } from "./_components/planning-detail";
import PlanningForm from "./_components/planning-form";

const PlanningPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlanning , setSelectedPlanning] = useState<Planning|null>(null) 
  const { plannings, isLoading, fetchPlannings, addPlanning ,approvePlanning , applyFilters , calculateStats , clearFilters , deletePlanning , filteredPlannings , filters , requestApproval , updatePlanning } = usePlanningStore();
  useEffect(() => {
    fetchPlannings();
  }, []);

  const handleAddPlanning = async (data: any) => {
    await addPlanning(data);
    setIsAddModalOpen(false);
  };
  const handleView =(planing:Planning) =>{
setSelectedPlanning(planing)
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Supply Planning</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Planning
              </Button>
            </DialogTrigger>
            <DialogContent className="w-fit rounded-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Planning</DialogTitle>
              </DialogHeader>
              <PlanningForm
                onSubmit={handleAddPlanning}
                onCancel={() => setIsAddModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

         <Dialog open={!!selectedPlanning} onOpenChange={(open) => !open && setSelectedPlanning(null)}>
       

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader />
          {selectedPlanning && (
            <PlanningDetail
              planning={selectedPlanning}
              isLoading={isLoading}
              onApprove={async (status) => {
                if (!selectedPlanning) return;
                try {
                  await approvePlanning(selectedPlanning.id, {
                    status,
                    approvedBy: selectedPlanning.approvedBy ?? "System",
                    approvalRemarks: selectedPlanning.approvalRemarks ?? "",
                  });
                  // toast({
                  //   title: "Success",
                  //   description: `Planning ${status.toLowerCase()} successfully.`,
                  // });
                  fetchPlannings();
                  setSelectedPlanning(null);
                } catch (error) {
                  // toast({
                  //   title: "Error",
                  //   description: "Failed to update planning status.",
                  //   variant: "destructive",
                  // });
                }
              }}
              onRequest={()=> requestApproval(selectedPlanning.id)}
              onReject={async (status) => {
                if (!selectedPlanning) return;
                try {
                  await approvePlanning(selectedPlanning.id, {
                    status,
                    approvedBy: selectedPlanning.approvedBy ?? "System",
                    approvalRemarks: selectedPlanning.approvalRemarks ?? "",
                  });
                  // toast({
                  //   title: "Rejected",
                  //   description: "Planning rejected successfully.",
                  // });
                  fetchPlannings();
                  setSelectedPlanning(null);
                } catch (error) {
                  // toast({
                  //   title: "Error",
                  //   description: "Failed to reject planning.",
                  //   variant: "destructive",
                  // });
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      

        <PlanningList plannings={plannings} isLoading={isLoading}  onView={handleView}/>
      </div>
    </div>
  );
};

export default PlanningPage;
