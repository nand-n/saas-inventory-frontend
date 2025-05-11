import { useState, useEffect } from 'react'
import { InventoryItem } from '@/types/inventory'
import axios from 'axios'
import axiosInstance from '@/lib/axiosInstance'

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true)
        const tenantId = "990c9cad-257e-4f82-a5c7-9fc49ec77b03"
        // Replace with your actual API endpoint
        const response = await axiosInstance.get(`/inventory/tenant-inventory/${tenantId}`)
        setInventory(response.data)
      } catch (err) {
        setError(err as Error)
        console.error('Failed to fetch inventory:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventory()

    // Optional: Set up real-time updates with WebSocket or polling
    const ws = new WebSocket('wss://your-api/inventory-updates')
    ws.onmessage = (event) => {
      const updatedItem = JSON.parse(event.data)
      setInventory(prev => 
        prev.map(item => item.id === updatedItem.id ? updatedItem : item)
      )
    }

    return () => ws.close()
  }, [])

  // Optional: Add mutation functions
  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const response = await axios.patch(`/api/inventory/${id}`, updates)
      setInventory(prev => 
        prev.map(item => item.id === id ? { ...item, ...response.data } : item)
      )
    } catch (err) {
      console.error('Failed to update item:', err)
      throw err
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`/api/inventory/${id}`)
      setInventory(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Failed to delete item:', err)
      throw err
    }
  }

  return { 
    data: inventory, 
    isLoading, 
    error,
    updateItem,
    deleteItem
  }
}