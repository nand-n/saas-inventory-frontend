# CRM System Frontend

A comprehensive Customer Relationship Management (CRM) system built with Next.js, TypeScript, and Zustand for state management.

## Features

### 🏢 Customer Management

- **Customer Types**: Importer, Exporter, Retailer
- **Customer Information**: Name, email, phone, company
- **CRUD Operations**: Create, read, update, delete customers
- **Search & Filtering**: Search by name, email, company, and filter by type

### 💬 Interaction Tracking

- **Interaction Types**: Call, Email, Meeting, Note
- **Customer Association**: Link interactions to specific customers
- **Description Tracking**: Detailed notes for each interaction
- **Timestamps**: Automatic creation and update timestamps

### 🎯 Sales Opportunities

- **Opportunity Status**: New, In Progress, Won, Lost
- **Value Tracking**: Estimated deal value
- **Closing Dates**: Expected closing date management
- **Customer Linking**: Associate opportunities with customers

## Architecture

### State Management

- **Zustand Stores**: Separate stores for customers, interactions, and opportunities
- **Real-time Updates**: Automatic state synchronization across components
- **Error Handling**: Comprehensive error handling with user feedback

### Component Structure

```
crm/
├── page.tsx                 # Main CRM dashboard
├── layout.tsx              # CRM layout wrapper
└── _components/
    ├── CustomerList.tsx    # Customer listing with filters
    ├── CustomerModal.tsx   # Customer create/edit form
    ├── InteractionList.tsx # Interaction listing with filters
    ├── InteractionModal.tsx # Interaction create/edit form
    ├── OpportunityList.tsx # Opportunity listing with filters
    └── OpportunityModal.tsx # Opportunity create/edit form
```

### Data Flow

1. **API Integration**: RESTful API calls using axios
2. **State Updates**: Zustand stores manage local state
3. **Real-time Sync**: Automatic data refresh and updates
4. **Form Validation**: Zod schema validation for all forms

## API Endpoints

### Customers

- `GET /crm/customers` - Fetch all customers
- `GET /crm/customers/:id` - Fetch specific customer
- `POST /crm/customers` - Create new customer
- `PATCH /crm/customers/:id` - Update customer
- `DELETE /crm/customers/:id` - Delete customer

### Interactions

- `GET /crm/interactions` - Fetch all interactions
- `GET /crm/interactions?customerId=:id` - Fetch interactions by customer
- `POST /crm/interactions` - Create new interaction
- `PATCH /crm/interactions/:id` - Update interaction
- `DELETE /crm/interactions/:id` - Delete interaction

### Opportunities

- `GET /crm/opportunities` - Fetch all opportunities
- `GET /crm/opportunities?customerId=:id` - Fetch opportunities by customer
- `POST /crm/opportunities` - Create new opportunity
- `PATCH /crm/opportunities/:id` - Update opportunity
- `DELETE /crm/opportunities/:id` - Delete opportunity

## Usage

### Adding a New Customer

1. Navigate to CRM Dashboard
2. Click "Add Customer" button
3. Fill in customer details (name, email, type required)
4. Submit form

### Recording an Interaction

1. Go to Interactions tab
2. Click "Add Interaction" button
3. Select customer, interaction type, and add description
4. Save interaction

### Creating an Opportunity

1. Navigate to Opportunities tab
2. Click "Add Opportunity" button
3. Select customer, add title, estimated value, and closing date
4. Set initial status (defaults to "New")

## Features

### Dashboard Overview

- **Statistics Cards**: Total customers, interactions, opportunities, and value
- **Win Rate Calculation**: Automatic calculation of won opportunities
- **Real-time Updates**: Live data refresh and synchronization

### Advanced Filtering

- **Search Functionality**: Global search across all fields
- **Type Filtering**: Filter by customer type, interaction type, or opportunity status
- **Customer Filtering**: Filter interactions and opportunities by specific customers

### Responsive Design

- **Mobile-First**: Optimized for all device sizes
- **Modern UI**: Clean, intuitive interface using shadcn/ui components
- **Accessibility**: ARIA labels and keyboard navigation support

## Dependencies

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **shadcn/ui**: Modern UI component library
- **Lucide React**: Icon library
- **dayjs**: Date manipulation and formatting

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Access CRM Dashboard**
   Navigate to `/dashboard/crm` in your browser

## Customization

### Adding New Customer Types

1. Update `CustomerType` enum in `types/crm.types.ts`
2. Add corresponding options in `CustomerModal.tsx`
3. Update filtering logic in `CustomerList.tsx`

### Adding New Interaction Types

1. Update `InteractionType` enum in `types/crm.types.ts`
2. Add corresponding options in `InteractionModal.tsx`
3. Update filtering logic in `InteractionList.tsx`

### Adding New Opportunity Statuses

1. Update `OpportunityStatus` enum in `types/crm.types.ts`
2. Add corresponding options in `OpportunityModal.tsx`
3. Update filtering logic in `OpportunityList.tsx`

## Contributing

1. Follow the existing code structure and patterns
2. Ensure all forms have proper validation
3. Add error handling for all API calls
4. Maintain responsive design principles
5. Update documentation for any new features

## License

This project is part of the SaaS Inventory Management System.

