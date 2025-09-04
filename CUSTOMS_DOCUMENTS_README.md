# Customs Documents Management System

## Overview

The Customs Documents Management System is a comprehensive solution for managing all customs-related documents independently from shipments. This system provides a complete workflow for document creation, approval, and management with advanced filtering and bulk operations.

## Features

### 🏠 Main Page (`/dashboard/customs-documents`)

- **Dashboard Overview**: Statistics cards showing total documents, pending approvals, approved documents, and expiring soon
- **Document Management**: Create, edit, view, and delete customs documents
- **Advanced Filtering**: Search by document number, type, status, authority, country, and date ranges
- **Bulk Operations**: Select multiple documents for bulk actions (delete, approve, reject, export)
- **Responsive Table**: Sortable table with all document information

### 📝 Document Creation & Editing

- **Comprehensive Forms**: All required fields for customs documents
- **Validation**: Form validation with error handling
- **Document Types**: Support for all customs document types (Commercial Invoice, Packing List, Bill of Lading, etc.)
- **Status Management**: Full workflow status management

### 🔍 Document Details & Approval

- **Detailed View**: Complete document information display
- **Approval Workflow**: Review, approve, reject, and submit for approval
- **Timeline Tracking**: Visual timeline of approval workflow
- **User Tracking**: Track who reviewed, approved, or rejected documents

### 🎯 Advanced Features

- **Smart Filtering**: Multiple filter combinations for efficient document search
- **Sorting Options**: Sort by any field in ascending or descending order
- **Bulk Actions**: Perform operations on multiple documents simultaneously
- **Export Capabilities**: Export selected documents (ready for implementation)

## File Structure

```
app/(dashboard)/dashboard/customs-documents/
├── page.tsx                           # Main page component
└── _components/
    ├── customs-document-modal.tsx     # Create/Edit modal
    ├── customs-document-detail.tsx    # Document detail view
    ├── customs-document-filter.tsx    # Advanced filtering
    └── customs-document-bulk-actions.tsx # Bulk operations

store/customs-documents/
└── useCustomsDocumentsStore.ts        # State management store
```

## Components

### 1. Main Page (`page.tsx`)

- **Statistics Dashboard**: Real-time counts and metrics
- **Search & Filters**: Quick search and basic filtering
- **Documents Table**: Main data display with actions
- **Bulk Selection**: Checkbox selection for multiple documents

### 2. Document Modal (`customs-document-modal.tsx`)

- **Form Management**: Complete form for document creation/editing
- **Validation**: Client-side validation with error display
- **Field Types**: Text, select, date, number, and checkbox inputs
- **Responsive Design**: Mobile-friendly form layout

### 3. Document Detail (`customs-document-detail.tsx`)

- **Information Display**: Organized sections for all document data
- **Approval Actions**: Context-aware action buttons
- **Workflow Timeline**: Visual representation of approval process
- **User Information**: Display of user actions and timestamps

### 4. Advanced Filter (`customs-document-filter.tsx`)

- **Multiple Filter Types**: Text, select, date, and boolean filters
- **Filter Categories**: Organized by logical groups
- **Sorting Options**: Field and direction selection
- **Filter Management**: Save, reset, and clear filter options

### 5. Bulk Actions (`customs-document-bulk-actions.tsx`)

- **Action Buttons**: View, approve, reject, export, and delete
- **Selection Count**: Display of selected document count
- **Contextual Actions**: Actions appropriate for selected documents

## Store Management

### `useCustomsDocumentsStore`

- **Data Fetching**: API calls for CRUD operations
- **State Management**: Local state for documents, filters, and stats
- **Filtering Logic**: Advanced filtering and sorting implementation
- **Statistics Calculation**: Real-time calculation of document metrics

### Key Methods

- `fetchCustomsDocuments()`: Load all documents
- `createCustomsDocument()`: Create new document
- `updateCustomsDocument()`: Update existing document
- `deleteCustomsDocument()`: Delete single document
- `bulkDeleteDocuments()`: Delete multiple documents
- `approveCustomsDocument()`: Approve document
- `rejectCustomsDocument()`: Reject document
- `reviewCustomsDocument()`: Mark for review
- `submitForApproval()`: Submit for approval workflow

## API Endpoints

The system expects the following API endpoints:

```
GET    /customs-documents              # List all documents
GET    /customs-documents/:id          # Get single document
POST   /customs-documents              # Create new document
PUT    /customs-documents/:id          # Update document
DELETE /customs-documents/:id          # Delete document
POST   /customs-documents/bulk-delete  # Bulk delete
POST   /customs-documents/:id/approve  # Approve document
POST   /customs-documents/:id/reject   # Reject document
POST   /customs-documents/:id/review   # Review document
POST   /customs-documents/:id/submit   # Submit for approval
```

## Document Types

Supported customs document types:

- Commercial Invoice
- Packing List
- Bill of Lading
- Certificate of Origin
- Export License
- Import License
- Customs Declaration
- Insurance Certificate
- Inspection Certificate
- Health Certificate
- Phytosanitary Certificate
- FDA Certificate
- Dangerous Goods Declaration

## Status Workflow

Document status progression:

1. **Draft** → Initial creation
2. **Submitted** → Submitted for approval
3. **Pending Approval** → Waiting for review
4. **Under Review** → Being reviewed
5. **Approved** → Final approval
6. **Rejected** → Rejected with reason
7. **Expired** → Past expiry date
8. **Cancelled** → Manually cancelled

## Usage Examples

### Creating a New Document

1. Navigate to `/dashboard/customs-documents`
2. Click "New Document" button
3. Fill in required fields (document number, type, dates, authority)
4. Add optional information (description, notes, declared value)
5. Set approval requirements
6. Submit the form

### Approving a Document

1. View document details
2. Click "Review" button if status is "Pending Approval"
3. Add review notes
4. Click "Mark for Review"
5. Click "Approve" button when ready
6. Add optional approval notes
7. Confirm approval

### Filtering Documents

1. Use quick filters in the main page
2. Click "Advanced" for detailed filtering
3. Set multiple filter criteria
4. Choose sorting options
5. Apply filters to see results

## Future Enhancements

- **Document Templates**: Pre-defined templates for common document types
- **File Attachments**: Support for document file uploads
- **Email Notifications**: Automated notifications for status changes
- **Document Expiry Alerts**: Proactive alerts for expiring documents
- **Audit Trail**: Complete history of all document changes
- **Integration**: Connect with external customs systems
- **Reporting**: Advanced analytics and reporting features

## Technical Notes

- Built with Next.js 14 and React 18
- Uses Zustand for state management
- Implements responsive design with Tailwind CSS
- Follows TypeScript best practices
- Uses shadcn/ui components for consistent UI
- Implements proper error handling and loading states
- Follows accessibility guidelines

## Getting Started

1. Ensure all dependencies are installed
2. Set up the required API endpoints
3. Configure the authentication system
4. Add the route to your navigation
5. Test the document creation workflow
6. Verify approval processes work correctly

The system is designed to be modular and can be easily extended with additional features as needed.


