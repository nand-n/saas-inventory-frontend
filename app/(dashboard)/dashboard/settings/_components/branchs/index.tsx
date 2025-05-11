'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/commons/modalWrapper"
import { useEffect, useRef, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import type { Branch } from "@/types/branchTypes.type"
import axiosInstance from "@/lib/axiosInstance"
import { TableWrapper } from "@/components/ui/commons/tableWrapper"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/commons/toastProvider"
import { handleApiError } from "@/lib/utils"
import { useForm } from "react-hook-form"
import BranchForm from "../forms/BranchForm"
import useTenantStore from "@/store/tenant/tenantStore"

const Branches = () => {
    const [data, setData] = useState<Branch[]>([])
    const [selectedData, setSelectedData] = useState<Branch | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { showToast } = useToast()

    const tenantId = useTenantStore((state) => state.id);
    const form = useForm<Branch>({
        defaultValues: {
            name: '',
            location: '',
            lat: 0,
            lng: 0,
            tenantId: tenantId
        }
    })

    useEffect(() => {
        if (selectedData) {
            form.reset(selectedData)
        } else {
            form.reset()
        }
    }, [selectedData, form])

    const fetchBranches = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get(`/branches/${tenantId}`)
            setData(response.data)
        } catch (error) {
            console.error("Error fetching branches:", error)
            showToast("destructive", "Error!", handleApiError(error))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBranches()
    }, [])

    const handleDelete = async (id: string) => {
        try {
            await axiosInstance.delete(`/branch/${id}`)
            showToast("default", "Success!", "Branch successfully deleted")
            fetchBranches()
        } catch (error) {
            showToast("destructive", "Error!", handleApiError(error))
        }
    }

    const handleSubmit = async (values: Branch) => {
        try {
            if (selectedData) {
                await axiosInstance.put(`/branches/${selectedData.id}`, values)
            } else {
                await axiosInstance.post(`/branches/${tenantId}`, values)
            }
            showToast("default", "Success!", `Branch ${selectedData ? 'updated' : 'created'} successfully`)
            fetchBranches()
            setIsModalOpen(false)
        } catch (error) {
            showToast("destructive", "Error!", handleApiError(error))
        }
    }

    const branchColumns: ColumnDef<Branch>[] = [
        {
            accessorKey: "name",
            header: "Branch Name",
            cell: ({ row }) => (
                <div className="font-medium min-w-[150px]">
                    {row.getValue("name")}
                </div>
            )
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => (
                <div className="text-muted-foreground">
                    {row.getValue("location")}
                </div>
            )
        },
        {
            accessorKey: "tenantId",
            header: "Tenant ID",
            cell: ({ row }) => (
                <div className="text-muted-foreground">
                    {row.getValue("tenantId")}
                </div>
            )
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const branch = row.original
                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedData(branch)
                                setIsModalOpen(true)
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(branch.id)}
                        >
                            Delete
                        </Button>
                    </div>
                )
            },
        },
    ]

    return (
        <Card className="h-full">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Branches</CardTitle>
                <Modal
                    title={selectedData ? "Update Branch" : "Create Branch"}
                    description={selectedData ? "Update branch details" : "Add new branch"}
                    onCancel={() => {
                        setSelectedData(null)
                        setIsModalOpen(false)
                    }}
                    onConfirm={form.handleSubmit(handleSubmit)}
                    modalTrigger={<Button size="sm" onClick={() => setIsModalOpen(true)}>+</Button>}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                >
                 <BranchForm />
                </Modal>
            </CardHeader>

            <CardContent className="pl-2 h-full">
                <TableWrapper<Branch>
                    columns={branchColumns}
                    data={data}
                    loading={loading}
                    title="Branches List"
                />
            </CardContent>
        </Card>
    )
}

export default Branches