'use client'

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/commons/modalWrapper"
import { TableWrapper } from "@/components/ui/commons/tableWrapper"
import { useToast } from "@/components/ui/commons/toastProvider"
import axiosInstance from "@/lib/axiosInstance"
import { handleApiError } from "@/lib/utils"
import { Card } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import OrganizationalTree from "./organizationalStructure"
import useTenantStore from "@/store/tenant/tenantStore"
import { useAsync } from "@/hooks/useAsync"

 const BasicInfo =()=>{

    // const [data, setData] = useState<Tenant>([])
    // const [selectedData, setSelectedData] = useState<IndustryType | null>(null)

    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchIndustryTypes = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get('/industry-type')
            // setData(response.data)
        } catch (error) {
            console.error("Error fetching industry types:", error)
            showToast("destructive", "Error!", handleApiError(error))

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIndustryTypes()
    }, [])

const org = [
    {
        "id": "12cdcd69-fd6d-4e37-8752-ba59309d8f83",
        "title": "CEO",
        "user": {
            "id": "3dc0e005-db2f-4568-a4de-ddc49a53cb14",
            "firstName": "Nahom",
            "lastName": "Debele",
            "email": "contact@nahom.devv"
        },
        "branch": {
            "id": "87e528c0-5d01-4ed7-a159-9e6be77a3558",
            "name": "HQ"
        },
        "children": [
            {
                "id": "6e21bcfb-3360-4538-a44e-fab1def8083b",
                "title": "CTO",
                "user": {
                    "id": "3dc0e005-db2f-4568-a4de-ddc49a53cb14",
                    "firstName": "Nahom",
                    "lastName": "Debele",
                    "email": "contact@nahom.devv"
                },
                "branch": {
                    "id": "87e528c0-5d01-4ed7-a159-9e6be77a3558",
                    "name": "HQ"
                },
                "children": [ {
                    "id": "6e21bcfb-3360-4538-a44e-fab1def8083b",
                    "title": "CTO",
                    "user": {
                        "id": "3dc0e005-db2f-4568-a4de-ddc49a53cb14",
                        "firstName": "Nahom",
                        "lastName": "Debele",
                        "email": "contact@nahom.devv"
                    },
                    "branch": {
                        "id": "87e528c0-5d01-4ed7-a159-9e6be77a3558",
                        "name": "HQ"
                    },
                    "children": []
                },
                {
                    "id": "6e21bcfb-3360-4538-a44e-fab1def8083b",
                    "title": "CTO",
                    "user": {
                        "id": "3dc0e005-db2f-4568-a4de-ddc49a53cb14",
                        "firstName": "Nahom",
                        "lastName": "Debele",
                        "email": "contact@nahom.devv"
                    },
                    "branch": {
                        "id": "87e528c0-5d01-4ed7-a159-9e6be77a3558",
                        "name": "HQ"
                    },
                    "children": []
                },
                {
                    "id": "6e21bcfb-3360-4538-a44e-fab1def8083b",
                    "title": "CTO",
                    "user": {
                        "id": "3dc0e005-db2f-4568-a4de-ddc49a53cb14",
                        "firstName": "Nahom",
                        "lastName": "Debele",
                        "email": "contact@nahom.devv"
                    },
                    "branch": {
                        "id": "87e528c0-5d01-4ed7-a159-9e6be77a3558",
                        "name": "HQ"
                    },
                    "children": []
                },
                {
                    "id": "6e21bcfb-3360-4538-a44e-fab1def8083b",
                    "title": "CTO",
                    "user": {
                        "id": "3dc0e005-db2f-4568-a4de-ddc49a53cb14",
                        "firstName": "Nahom",
                        "lastName": "Debele",
                        "email": "contact@nahom.devv"
                    },
                    "branch": {
                        "id": "87e528c0-5d01-4ed7-a159-9e6be77a3558",
                        "name": "HQ"
                    },
                    "children": []
                },
                {
                    "id": "6e21bcfb-3360-4538-a44e-fab1def8083b",
                    "title": "CTO",
                    "user": {
                        "id": "3dc0e005-db2f-4568-a4de-ddc49a53cb14",
                        "firstName": "Nahom",
                        "lastName": "Debele",
                        "email": "contact@nahom.devv"
                    },
                    "branch": {
                        "id": "87e528c0-5d01-4ed7-a159-9e6be77a3558",
                        "name": "HQ"
                    },
                    "children": []
                },
                {
                    "id": "6e21bcfb-3360-4538-a44e-fab1def8083b",
                    "title": "CTO",
                    "user": {
                        "id": "3dc0e005-db2f-4568-a4de-ddc49a53cb14",
                        "firstName": "Nahom",
                        "lastName": "Debele",
                        "email": "contact@nahom.devv"
                    },
                    "branch": {
                        "id": "87e528c0-5d01-4ed7-a159-9e6be77a3558",
                        "name": "HQ"
                    },
                    "children": []
                },
            ]
            },
            {
                "id": "d3154bf9-247f-4346-aa6c-f2efcd7fcab4",
                "title": "CFO",
                "user": {
                    "id": "3dc0e005-db2f-4568-a4de-ddc49a53cb14",
                    "firstName": "Nahom",
                    "lastName": "Debele",
                    "email": "contact@nahom.devv"
                },
                "branch": {
                    "id": "87e528c0-5d01-4ed7-a159-9e6be77a3558",
                    "name": "HQ"
                },
                "children": []
            }
        ]
    },
    

    
]

const TenantId = useTenantStore((state) => state.id)

// Fetch orgStructure subscription
const { 
  data: orgStructure, 
  loading: orgStructureLoading, 
  error: orgStructureError, 
} = useAsync(
  () => axiosInstance.get(`/configurations/org-structure/${TenantId}`).then((res) => res.data),
  true
)


console.log(orgStructure ,"orgStructure");
    return <>
      <Card className="w-full h-full">
      <CardHeader className="flex justify-between items-center">
                <CardTitle>Basic Info</CardTitle>
                {/* <Modal
                    title={selectedData ? "Update Industry Type" : "Create Industry Type"}
                    description={selectedData ? "Update the existing industry type" : "Create new Industry Type"}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                    modalTrigger={<Button size="sm" onClick={() => setIsModalOpen(true)}>+</Button>}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                >
                    <IndustryTypeForm
                        selectedData={selectedData}
                        ref={formRef}
                        onSuccess={handleSuccess}
                    />
                </Modal> */}
            </CardHeader>
            <CardContent className="pl-2 h-full">
                {/* <Card className="w-full p-2 bg-gray-400">
                   <TableWrapper /> 
                </Card> */}
                <OrganizationalTree data={org ?? []} />
                
            </CardContent>

      </Card>
    </>
} 


export default BasicInfo