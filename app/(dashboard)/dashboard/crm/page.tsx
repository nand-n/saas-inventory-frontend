"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  MessageSquare,
  Target,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useCRMCustomerStore } from "@/store/crm/useCRMCustomerStore";
import { useInteractionStore } from "@/store/crm/useInteractionStore";
import { useOpportunityStore } from "@/store/crm/useOpportunityStore";
import { CRMCustomer, Interaction, Opportunity } from "@/types/crm.types";
import CustomerList from "./_components/CustomerList";
import InteractionList from "./_components/InteractionList";
import OpportunityList from "./_components/OpportunityList";
import CustomerModal from "./_components/CustomerModal";
import InteractionModal from "./_components/InteractionModal";
import OpportunityModal from "./_components/OpportunityModal";
import { formatCurrency } from "@/lib/utils";

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState("customers");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CRMCustomer | null>(
    null
  );
  const [selectedInteraction, setSelectedInteraction] =
    useState<Interaction | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  const {
    customers,
    fetchCustomers,
    loading: customersLoading,
  } = useCRMCustomerStore();
  const {
    interactions,
    fetchInteractions,
    loading: interactionsLoading,
  } = useInteractionStore();
  const {
    opportunities,
    fetchOpportunities,
    loading: opportunitiesLoading,
  } = useOpportunityStore();

  useEffect(() => {
    fetchCustomers();
    fetchInteractions();
    fetchOpportunities();
  }, [fetchCustomers, fetchInteractions, fetchOpportunities]);

  const totalCustomers = customers.length;
  const totalInteractions = interactions.length;
  const totalOpportunities = opportunities.length;
  const totalValue = opportunities.reduce(
    (sum, opp) => sum + (opp.estimatedValue || 0),
    0
  );
  const wonOpportunities = opportunities.filter(
    (opp) => opp.status === "won"
  ).length;
  const winRate =
    totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

  const handleEditCustomer = (customer: CRMCustomer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleEditInteraction = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setShowInteractionModal(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowOpportunityModal(true);
  };

  const handleCloseModals = () => {
    setShowCustomerModal(false);
    setShowInteractionModal(false);
    setShowOpportunityModal(false);
    setSelectedCustomer(null);
    setSelectedInteraction(null);
    setSelectedOpportunity(null);
  };

  const handleRefresh = () => {
    fetchCustomers();
    fetchInteractions();
    fetchOpportunities();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships, interactions, and opportunities
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            Refresh
          </Button>
          <Button onClick={() => setShowCustomerModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {customersLoading ? "Loading..." : "Active customers"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Interactions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInteractions}</div>
            <p className="text-xs text-muted-foreground">
              {interactionsLoading ? "Loading..." : "Customer interactions"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Opportunities
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              {opportunitiesLoading ? "Loading..." : "Active opportunities"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Win rate: {winRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Customer Management</h2>
            <Button onClick={() => setShowCustomerModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
          <CustomerList onEdit={handleEditCustomer} />
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Interaction History</h2>
            <Button onClick={() => setShowInteractionModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Interaction
            </Button>
          </div>
          <InteractionList onEdit={handleEditInteraction} />
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sales Opportunities</h2>
            <Button onClick={() => setShowOpportunityModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Opportunity
            </Button>
          </div>
          <OpportunityList onEdit={handleEditOpportunity} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CustomerModal
        open={showCustomerModal}
        onClose={handleCloseModals}
        customer={selectedCustomer}
        onSuccess={handleRefresh}
      />

      <InteractionModal
        open={showInteractionModal}
        onClose={handleCloseModals}
        interaction={selectedInteraction}
        onSuccess={handleRefresh}
      />

      <OpportunityModal
        open={showOpportunityModal}
        onClose={handleCloseModals}
        opportunity={selectedOpportunity}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
