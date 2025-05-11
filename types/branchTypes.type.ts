import { BaseEntity } from "./common.type"

export interface Branch extends BaseEntity {
    name: string
    location: string
    lat: number
    lng: number
    type: 'warehouse' | 'office' | 'retail' // Add other possible types
    tenantId: string
    isActive: boolean
}