'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Modal from "@/components/ui/commons/modalWrapper"
import IndustryTypeForm, { IndustryTypeFormHandle } from "../forms/IndustryTypeForm"
import { useEffect, useRef, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import type { IndustryType } from "@/types/industryType.type"
import axiosInstance from "@/lib/axiosInstance"
import { TableWrapper } from "@/components/ui/commons/tableWrapper"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/commons/toastProvider"
import { handleApiError } from "@/lib/utils"

const IndustryType = () => {
    const [data, setData] = useState<IndustryType[]>([])
    const [selectedData, setSelectedData] = useState<IndustryType | null>(null)

    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchIndustryTypes = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get('/industry-type')
            setData(response.data)
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

    const handleDelete=async(id: string) => {
        setLoading(false)
        try {
            const res = await axiosInstance.delete(`/industry-type/${id}`)
            showToast("default", "Success!", `${res?.data?.name ?? ''} Successfully deleted`)
            fetchIndustryTypes()

        } catch (error) {
            showToast("destructive", "Error!", handleApiError(error))
            
        }finally{
            setLoading(false)
        }
    }


    const handleSuccess = () => {
        setSelectedData(null)
        setIsModalOpen(false)
        fetchIndustryTypes()
    }
    const formRef = useRef<IndustryTypeFormHandle>(null)
    
    const industryTypeColumns: ColumnDef<IndustryType>[] = [
        {
            accessorKey: "name",
            header: "Industry Name",
            cell: ({ row }) => (
                <div className="font-medium min-w-[150px]">
                    {row.getValue("name")}
                </div>
            ),
            filterFn: "includesString",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="text-muted-foreground line-clamp-2">
                    {row.getValue("description")}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const industry = row.original
                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {setSelectedData(industry);
                                setIsModalOpen(true)
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(industry?.id ?? '')}
                        >
                            Delete
                        </Button>
                    </div>
                )
            },
        },
    ]
    const handleCancel = () => {
        setSelectedData(null)
        setIsModalOpen(false)
    }

    const handleConfirm = () => {
        formRef.current?.submitForm()
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Industry Type</CardTitle>
                <Modal
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
                </Modal>
        </CardHeader>

            <CardContent className="pl-2 h-full">
                <TableWrapper<IndustryType>
                    columns={industryTypeColumns}
                    data={data}
                    loading={loading}
                    title="Industry Types"
                />
            </CardContent>
        </Card>
    )
}

export default IndustryType