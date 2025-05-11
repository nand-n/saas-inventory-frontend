'use client'

import { forwardRef, useImperativeHandle, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from "@/lib/axiosInstance"
import type { IndustryType } from "@/types/industryType.type"
import { useToast } from '@/components/ui/commons/toastProvider'

interface IndustryTypeFormProps {
  selectedData?: IndustryType | null
  onSuccess: () => void
}

export type IndustryTypeFormHandle = {
  submitForm: () => void
}

const IndustryTypeForm = forwardRef<IndustryTypeFormHandle, IndustryTypeFormProps>(
  ({ selectedData, onSuccess }, ref) => {
    const { register, handleSubmit, reset } = useForm<IndustryType>({
      defaultValues: {
        name: '',
        description: ''
      }
    })
        const { showToast } = useToast();
    

    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)()
    }))

    useEffect(() => {
      if (selectedData) {
        reset(selectedData)
      } else {
        reset({ name: '', description: '' })
      }
    }, [selectedData, reset])

    const onSubmit = async (data: IndustryType) => {
      try {
        if (selectedData?.id) {
          await axiosInstance.put(`/industry-type/${selectedData.id}`, data)
                      showToast("default", "Success!", "Update completed successfully.")
          
          
        } else {
          await axiosInstance.post('/industry-type', data)
          showToast("default", "Success!", "Create completed successfully.")

        }
        onSuccess()
      } catch (error) {
        console.error('Submission error:', error)
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            {...register('name', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full p-2 border rounded"
          />
        </div>
      </form>
    )
  }
)

IndustryTypeForm.displayName = 'IndustryTypeForm'

export default IndustryTypeForm