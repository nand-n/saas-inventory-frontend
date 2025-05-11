"use client";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FormWrapper from "./_components/formWrapper";
import BranchForm from "./_components/forms/BranchForm";
import UsersForm from "./_components/forms/UsersForm";
import RolesForm from "./_components/forms/RolesForm";
import PermissionsForm from "./_components/forms/PermissionsForm";
import IndustryType from "./_components/IndustryType";
import Configurations from "./_components/configurations";
import BasicInfo from "./basicInfo";
import PlansAndBilling from "./plnansAndBilling";
import Branches from "./_components/branchs";
import InventorySettings from "./inventory";


const SettingsPage = () => {
  return (
    <FormWrapper>
      <Tabs defaultValue="industry" className=" max-w-full mx-auto">
        <TabsList className="flex justify-start space-x-1 border-b overflow-x-auto scrollbar-hide" >
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="plans&billing">Plans & Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="configurations">Configurations</TabsTrigger>
        <TabsTrigger value="industry">Industry Type</TabsTrigger>
        <TabsTrigger value="branch">Branch</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="inventorySettings">Inventory Settings</TabsTrigger>


        </TabsList>

        <TabsContent value="basic">
        <BasicInfo />
        </TabsContent>

        <TabsContent value="configurations">
          <Configurations />
        </TabsContent>

        <TabsContent value="industry">
        <IndustryType />
        </TabsContent>
        <TabsContent value="branch">
          <Branches />
        </TabsContent>
        <TabsContent value="plans&billing">
          <PlansAndBilling />
        </TabsContent>
        <TabsContent value="users">
          <UsersForm />
        </TabsContent>
        <TabsContent value="roles">
          <RolesForm />
        </TabsContent>
        <TabsContent value="permissions">
          <PermissionsForm />
        </TabsContent>
             <TabsContent value="inventorySettings">
        <InventorySettings />
        </TabsContent>
      </Tabs>
    </FormWrapper>
  );
};

export default SettingsPage;
