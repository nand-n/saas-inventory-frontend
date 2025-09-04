# Customs Document Approval Workflow

This document describes the approval workflow system implemented for Customs Documents in the SaaS Inventory Frontend application.

## Overview

The approval workflow allows customs documents to go through a structured review and approval process, ensuring proper oversight and compliance before documents are finalized.

## Workflow States

### 1. Draft (`DRAFT`)

- Initial state when a customs document is created
- Document can be edited and modified
- No approval actions available

### 2. Pending Approval (`PENDING_APPROVAL`)

- Document has been submitted for review
- Available actions:
  - **Review**: Mark document for detailed review
  - **Reject**: Reject document with reason

### 3. Under Review (`UNDER_REVIEW`)

- Document is being reviewed by an approver
- Available actions:
  - **Approve**: Approve the document
  - **Reject**: Reject document with reason

### 4. Approved (`APPROVED`)

- Document has been approved
- No further actions available
- Document is considered valid and compliant

### 5. Rejected (`REJECTED`)

- Document has been rejected
- No further actions available
- Document must be corrected and resubmitted

### 6. Other States

- **Submitted** (`SUBMITTED`): Document submitted to authorities
- **Accepted** (`ACCEPTED`): Document accepted by authorities
- **Expired** (`EXPIRED`): Document has expired
- **Cancelled** (`CANCELLED`): Document has been cancelled

## Implementation Details

### Components

#### 1. CustomsDocumentApproval Component

- **Location**: `app/(dashboard)/dashboard/shipment/_components/customs-document-approval.tsx`
- **Purpose**: Handles all approval workflow actions
- **Features**:
  - Status display with color-coded badges
  - Action buttons based on current status
  - Review, approve, and reject dialogs
  - Notes and reason input fields

#### 2. Updated CustomsDocumentDetails Component

- **Location**: `app/(dashboard)/dashboard/shipment/_components/customs-document-detail.tsx`
- **Changes**: Integrated approval workflow component
- **Features**: Shows approval information and workflow actions

#### 3. Updated CustomsDocumentForm Component

- **Location**: `app/(dashboard)/dashboard/shipment/_components/customs-document-form.tsx`
- **Changes**: Added new approval-related fields
- **Features**: Default status set to DRAFT for new documents

### Store Methods

The `useShipmentsStore` has been extended with approval workflow methods:

```typescript
// Approve a customs document
approveCustomsDocument: (
  documentId: string,
  approvedBy: string,
  reviewNotes?: string
) => Promise<void>;

// Reject a customs document
rejectCustomsDocument: (
  documentId: string,
  rejectedBy: string,
  rejectionReason: string
) => Promise<void>;

// Review a customs document
reviewCustomsDocument: (
  documentId: string,
  reviewedBy: string,
  reviewNotes?: string
) => Promise<void>;

// Submit document for approval
submitForApproval: (documentId: string) => Promise<void>;
```

### Data Model Updates

#### CustomsDocument Interface

Added new fields to track approval workflow:

```typescript
export interface CustomsDocument {
  // ... existing fields ...

  // Approval workflow fields
  rejectedBy?: string | null;
  rejectedDate?: string | null;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedDate?: string | null;
  reviewNotes?: string | null;
}
```

#### CustomsDocumentStatus Enum

Extended with new workflow states:

```typescript
export enum CustomsDocumentStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  UNDER_REVIEW = "under_review", // New
  APPROVED = "approved",
  SUBMITTED = "submitted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  EXPIRED = "expired",
  CANCELLED = "cancelled", // New
}
```

## Usage

### 1. Creating a New Document

- Document starts in `DRAFT` status
- User can edit and modify as needed
- Click "Submit for Approval" to begin workflow

### 2. Review Process

- Document moves to `PENDING_APPROVAL` status
- Approver can:
  - Review with notes
  - Reject with reason
  - Mark for detailed review

### 3. Approval Process

- Document moves to `UNDER_REVIEW` status
- Final approver can:
  - Approve the document
  - Reject with reason

### 4. Final States

- **Approved**: Document is valid and compliant
- **Rejected**: Document must be corrected and resubmitted

## API Endpoints

The workflow expects the following API endpoints:

- `PATCH /customs-documents/{id}/approve` - Approve document
- `PATCH /customs-documents/{id}/reject` - Reject document
- `PATCH /customs-documents/{id}/review` - Mark for review
- `PATCH /customs-documents/{id}/submit` - Submit for approval

## Security and Permissions

- Only authenticated users can perform approval actions
- Current user ID is tracked for audit purposes
- All actions are logged with timestamps
- Status changes trigger appropriate notifications

## Future Enhancements

1. **Email Notifications**: Send notifications when documents change status
2. **Approval Chains**: Support for multiple approval levels
3. **Document Templates**: Pre-defined document templates
4. **Audit Trail**: Comprehensive logging of all workflow actions
5. **Bulk Operations**: Approve/reject multiple documents at once
6. **Workflow Rules**: Configurable approval rules based on document type/value

## Testing

To test the approval workflow:

1. Create a new customs document (status: DRAFT)
2. Submit for approval (status: PENDING_APPROVAL)
3. Review the document (status: UNDER_REVIEW)
4. Approve or reject the document
5. Verify status changes and audit information

## Troubleshooting

### Common Issues

1. **Status not updating**: Check if the API endpoints are properly configured
2. **Actions not available**: Verify document status and user permissions
3. **Form validation errors**: Ensure all required fields are filled

### Debug Information

- Check browser console for API errors
- Verify store state updates
- Confirm user authentication status
- Review API response data structure
