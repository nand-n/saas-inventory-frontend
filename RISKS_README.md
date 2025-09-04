# Risk Management System

This document describes the Risk Management functionality implemented in the SaaS Inventory Frontend application.

## Overview

The Risk Management system allows users to identify, assess, and manage business risks across different areas of the organization. It provides a comprehensive interface for tracking risk severity, likelihood, impact, and mitigation strategies.

## Features

### Core Functionality

- **Risk Creation**: Create new risks with title, description, severity, likelihood, and impact
- **Risk Assessment**: Automatic calculation of risk scores based on likelihood × impact
- **Risk Tracking**: Monitor risk status from open to mitigated/closed
- **Risk Categorization**: Classify risks by severity (Low, Medium, High, Critical)
- **Status Management**: Track risk lifecycle (Open, In Progress, Mitigated, Closed)

### Advanced Features

- **Bulk Operations**: Update status or delete multiple risks simultaneously
- **Advanced Filtering**: Filter risks by severity, status, branch, shipment, and date range
- **Search Functionality**: Quick search across risk titles and descriptions
- **Risk Analytics**: Dashboard with key metrics and statistics
- **Responsive Design**: Mobile-friendly interface for field use

## Technical Implementation

### File Structure

```
app/(dashboard)/dashboard/risks/
├── page.tsx                    # Main risks page
├── _components/
│   ├── modals/
│   │   └── risk-modal.tsx     # Create/edit risk modal
│   ├── risk-filters.tsx       # Advanced filtering component
│   ├── risk-detail.tsx        # Risk detail view component
│   └── risk-bulk-actions.tsx  # Bulk operations component
```

### Data Models

- **Risk Entity**: Core risk data structure
- **RiskSeverity**: Enum for risk severity levels
- **RiskStatus**: Enum for risk lifecycle status
- **RiskFilters**: Interface for filtering and search

### State Management

- **useRiskStore**: Zustand store for risk data and operations
- **Real-time Updates**: Automatic refresh of risk data
- **Optimistic Updates**: Immediate UI feedback for better UX

## API Endpoints

The system expects the following backend endpoints:

- `GET /risks` - Fetch all risks with optional filters
- `GET /risks/:id` - Fetch specific risk by ID
- `POST /risks` - Create new risk
- `PUT /risks/:id` - Update existing risk
- `DELETE /risks/:id` - Delete risk

## Usage

### Creating a Risk

1. Navigate to the Risks page
2. Click "Add Risk" button
3. Fill in risk details:
   - Title (required)
   - Description
   - Severity level
   - Likelihood (0-1 scale)
   - Impact (0-1 scale)
   - Branch ID (optional)
   - Shipment ID (optional)
   - Mitigation plan
4. Click "Create Risk"

### Managing Risks

- **View**: Click the eye icon to see full risk details
- **Edit**: Click the pencil icon to modify risk information
- **Delete**: Click the trash icon to remove risks
- **Bulk Actions**: Select multiple risks for batch operations

### Filtering and Search

- Use the search bar for quick text search
- Click "Filters" to access advanced filtering options
- Filter by severity, status, branch, shipment, and date range
- Clear all filters with the "Clear All" button

## Risk Scoring

Risk scores are automatically calculated using the formula:

```
Risk Score = Likelihood × Impact × 100
```

### Risk Levels

- **0-24**: Low Risk
- **25-49**: Medium Risk
- **50-74**: High Risk
- **75-100**: Critical Risk

## Integration Points

- **Branch Management**: Link risks to specific business locations
- **Shipment Tracking**: Associate risks with logistics operations
- **User Management**: Track risk ownership and responsibility
- **Audit Trail**: Maintain history of risk changes

## Security Considerations

- Role-based access control for risk management
- Audit logging for all risk modifications
- Data validation and sanitization
- Secure API communication

## Future Enhancements

- Risk trend analysis and reporting
- Automated risk alerts and notifications
- Integration with external risk databases
- Advanced risk modeling and simulation
- Mobile app for field risk assessment

## Dependencies

- React 19
- Next.js 15
- Zustand for state management
- Tailwind CSS for styling
- Heroicons for icons
- Day.js for date formatting

