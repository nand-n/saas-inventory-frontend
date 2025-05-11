'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAsync } from "@/hooks/useAsync"
import axiosInstance from "@/lib/axiosInstance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ColumnDef } from "@tanstack/react-table"
import { TableWrapper } from "@/components/ui/commons/tableWrapper"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/commons/toastProvider"
import { handleApiError } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, XIcon } from "lucide-react"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState } from "react"
import Modal from "@/components/ui/commons/modalWrapper"
import useTenantStore from "@/store/tenant/tenantStore"

type BillingHistory = {
  id: string
  date: string
  amount: number
  status: string
  description: string
}

// const ActivePlan = () => {
//   const { data:plans, error, loading, execute } = useAsync(
//     () => axiosInstance.get("/plans").then((res) => res.data),
//     true
//   )

//   const TenantId = "07369856-145d-4f4d-bd2a-a33e6007d37e"

//   const { data:activeSubscription, error:activeSubscriptionError, loading:activeSubscriptionLoading, execute:activeSubscriptionExcute } = useAsync(
//     () => axiosInstance.get(`/subscription-plans/tenant/${TenantId}`).then((res) => res.data),
//     true
//   )

//   //Todo add 
  
//   const { showToast } = useToast()

//   const handleSubscription = async (planId: string) => {
//     try {
//       await axiosInstance.post("/subscriptions", { planId })
//       showToast("default", "Success!", "Subscription updated successfully")
//       execute()
//     } catch (error) {
//       showToast("destructive", "Error!", handleApiError(error))
//     }
//   }

//   const groupFeaturesBySection = (features: Plan['features']) => {
//     return features.reduce((acc, feature) => {
//       if (!acc[feature.section]) {
//         acc[feature.section] = []
//       }
//       acc[feature.section].push(feature)
//       return acc
//     }, {} as Record<string, typeof features>)
//   }

//   if (error) return <div className="text-red-500">Error loading plan: {error.message}</div>
//   if (loading) return <div>Loading plan details...</div>

//   return (
//     <Card className="max-w-4xl mx-auto">
//       <CardHeader className="border-b">
//         <div className="flex justify-between items-center">
//           <div>
//             <CardTitle className="text-2xl">{activeSubscription?.plan?.plan_name}</CardTitle>
//             <p className="text-muted-foreground mt-2">{activeSubscription?.description}</p>
//           </div>
//           <div className="text-right">
//             <div className="text-3xl font-bold">
//               {activeSubscription?.currency} {activeSubscription?.current_price}
//               <span className="text-base font-normal text-muted-foreground ml-1">
//                 / {data?.recuring}
//               </span>
//             </div>
//             <Badge variant="outline" className="mt-2">
//               {data?.days_left} days remaining
//             </Badge>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="pt-6">
//         <div className="mb-8">
//           <h3 className="text-lg font-semibold mb-4">Plan Highlights</h3>
//           <div className="grid grid-cols-2 gap-4">
//             {data?.highlights?.map((highlight: { disabled: any; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
//               <div key={index} className="flex items-center space-x-2">
//                 {highlight.disabled ? (
//                   <XIcon className="w-4 h-4 text-red-500" />
//                 ) : (
//                   <CheckIcon className="w-4 h-4 text-green-500" />
//                 )}
//                 <span className={highlight.disabled ? "text-muted-foreground" : ""}>
//                   {highlight.description}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold mb-4">Full Feature Breakdown</h3>
//           {Object.entries(groupFeaturesBySection(data?.features || [])).map(([section, features]) => (
//             <div key={section} className="mb-6">
//               <h4 className="font-medium mb-3 text-muted-foreground">{section}</h4>
//               <div className="grid grid-cols-2 gap-4">
//                 {features.map((feature, index) => (
//                   <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded">
//                     <span>{feature.name}</span>
//                     {typeof feature.value === 'boolean' ? (
//                       feature.value ? (
//                         <CheckIcon className="w-4 h-4 text-green-500" />
//                       ) : (
//                         <XIcon className="w-4 h-4 text-red-500" />
//                       )
//                     ) : (
//                       <span className="font-medium">{feature.value}</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-8 flex justify-end gap-4">
//           <Button variant="outline">Manage Subscription</Button>
//           <Button onClick={() => handleSubscription(data?.id)}>
//             Upgrade Plan
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }



type Plan = {
  id: string
  plan_name: string
  description: string
  currency: string
  current_price: number
  isFree: boolean
  duration: number
  days_left: number
  recuring: string
  highlights: {
    disabled: boolean
    description: string
  }[]
  features: {
    name: string
    value: string | boolean
    section: string
  }[]
}

type SubscriptionPlan = {
  id: string
  plan: Plan
  start_date: string
  end_date: string
  is_active: boolean
  paymentMethod: {
    payment_method: string
  }
}

const ActivePlan = () => {
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const TenantId = useTenantStore((state) => state.id)

  // Fetch active subscription
  const { 
    data: activeSubscription, 
    loading: activeSubscriptionLoading, 
    error: activeSubscriptionError, 
    execute: activeSubscriptionExecute 
  } = useAsync(
    () => axiosInstance.get(`/subscription-plans/tenant/${TenantId}`).then((res) => res.data),
    true
  )

  // Fetch all available plans
  const { data: plans, loading, error } = useAsync<Plan[] ,Plan[]>(
    () => axiosInstance.get("/plans").then((res) => res.data),
    true
  )

    // Fetch all payment methods
    const { data: paymentMethods, loading:paymentMethodLodiang, error:paymentMethodError } = useAsync<Plan[] ,Plan[]>(
      () => axiosInstance.get("/payment-methods").then((res) => res.data),
      true
    )

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const handleUpgrade = async () => {
    if (!selectedPlan) return
    
    try {
      await axiosInstance.post("/subscription-plans", {
        user_id: "8bef1f99-d0d9-47f8-ae8e-a2c850b46a1e",
        tenant_id: TenantId,
        start_date: new Date().toISOString(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + selectedPlan.duration)).toISOString(),
        is_active: true,
        plan_id: selectedPlan.id,
        payment_method_id: "9a144a2f-0d32-4821-b212-026a780614b0"
      })

      showToast("default", "Success!", "Subscription upgraded successfully")
      activeSubscriptionExecute()
      setIsModalOpen(false)
      setSelectedPlan(null)
    } catch (error) {
      showToast("destructive", "Error!", handleApiError(error))
    }
  }

  const groupFeaturesBySection = (features: Plan['features']) => {
    return features?.reduce((acc, feature) => {
      if (!acc[feature.section]) acc[feature.section] = []
      acc[feature.section].push(feature)
      return acc
    }, {} as Record<string, typeof features>)
  }

  if (loading || activeSubscriptionLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Error loading plans: {error.message}</div>
  if (activeSubscriptionError) return <div className="text-red-500">Error loading subscription: {activeSubscriptionError.message}</div>

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{activeSubscription?.plan.plan_name}</CardTitle>
              <p className="text-muted-foreground mt-2">{activeSubscription?.plan.description}</p>
              <Badge variant="outline" className="mt-2">
                Payment Method: {activeSubscription?.paymentMethod.payment_method}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {activeSubscription?.plan.currency} {activeSubscription?.plan.current_price}
                <span className="text-base font-normal text-muted-foreground ml-1">
                  / {activeSubscription?.plan.recuring}
                </span>
              </div>
              <Badge variant="outline" className="mt-2">
                {calculateDaysLeft(activeSubscription?.end_date)} days remaining
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Plan Highlights</h3>
            <div className="grid grid-cols-2 gap-4">
              {activeSubscription?.plan.highlights?.map((highlight: { disabled: boolean; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, index: Key | null | undefined) => (
                <div key={index} className="flex items-center space-x-2">
                  {highlight.disabled ? (
                    <XIcon className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  )}
                  <span className={highlight.disabled ? "text-muted-foreground" : ""}>
                    {highlight.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Full Feature Breakdown</h3>
            {Object.entries(groupFeaturesBySection(activeSubscription?.plan.features || [])).map(([section, features]) => (
              <div key={section} className="mb-6">
                <h4 className="font-medium mb-3 text-muted-foreground">{section}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span>{feature.name}</span>
                      {typeof feature.value === 'boolean' ? (
                        feature.value ? (
                          <CheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <XIcon className="w-4 h-4 text-red-500" />
                        )
                      ) : (
                        <span className="font-medium">{feature.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline">Manage Subscription</Button>
            <Button onClick={() => setIsModalOpen(true)}>
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        title="Upgrade Subscription"
        description="Select a new plan to upgrade your subscription"
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCancel={() => setSelectedPlan(null)}
        onConfirm={handleUpgrade}
        modalTrigger={<div />} // Empty trigger since we control via button
      >
        <div className="grid gap-4 py-4">
          {plans?.filter(plan => plan.id !== activeSubscription?.plan.id).map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer ${selectedPlan?.id === plan.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedPlan(plan)}
            >
              <CardHeader>
                <CardTitle>{plan.plan_name}</CardTitle>
                <div className="text-2xl font-bold">
                  {plan.currency} {plan.current_price}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    / {plan.recuring}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {plan.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {highlight.disabled ? (
                        <XIcon className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckIcon className="w-4 h-4 text-green-500" />
                      )}
                      <span>{highlight.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Modal>
    </>
  )
}

const Billing = () => {
  const { data, error, loading, execute } = useAsync(
    () => axiosInstance.get("/billing/history").then((res) => res.data),
    true
  )

  const billingColumns: ColumnDef<BillingHistory>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString(),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    // {
    //   accessorKey: "amount",
    //   header: "Amount",
    //   cell: ({ row }) => `$${row.getValue("amount").toFixed(2)}`,
    // },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded ${row.getValue("status") === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {row.getValue("status")}
        </span>
      ),
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent>
        <TableWrapper<BillingHistory>
          columns={billingColumns}
          data={data || []}
          loading={loading}
          title="Payment History"
        />
      </CardContent>
    </Card>
  )
}

const PlansAndBilling = () => {
  return (
    <Tabs defaultValue="activeplan" className="max-w-full mx-auto">
      <TabsList className="flex justify-start space-x-1 border-b overflow-x-auto scrollbar-hide">
        <TabsTrigger value="activeplan">Plan</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="activeplan">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Active Plan</h2>
          <p className="text-muted-foreground">Manage your active subscription and plan details.</p>
        </div>
        <ActivePlan />
      </TabsContent>

      <TabsContent value="billing">
        <Billing />
      </TabsContent>
    </Tabs>
  )
}

export default PlansAndBilling