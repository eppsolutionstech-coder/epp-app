# EPP (Employee Purchase Program) - Business Requirements Document

## 1. Executive Summary

The Employee Purchase Program (EPP) is a B2B2C e-commerce platform owned by **Uzaro** that enables various customer types to purchase products at discounted prices through strategic vendor partnerships. The platform supports multiple payment options including installment plans managed by partnered financial institutions.

---

## 2. Business Model

### 2.1 Core Value Proposition

- **Uzaro** establishes direct partnerships with vendors/suppliers/manufacturers
- Partners offer products at **discounted wholesale prices** to Uzaro
- Uzaro applies a **small markup** (still lower than SRP/retail price) and sells to customers
- Customers benefit from below-market pricing through the EPP program

### 2.2 Revenue Streams

| Revenue Source | Description |
|----------------|-------------|
| Product Markup | Small margin added to vendor wholesale price |
| Platform Fees | Commission from vendor sales |
| Financing Partnerships | Revenue share with financers on installment interest |

---

## 3. User Roles & Customer Types

### 3.1 Customer Types

| Customer Type | Description | Pricing Tier | Payment Options |
|---------------|-------------|--------------|-----------------|
| **Employee** | Corporate employees enrolled in EPP | Employee Price (Lowest) | Full Payment, Installment (Salary Deduction) |
| **Wholesaler** | Bulk buyers / Resellers | Wholesale Price | Full Payment, Installment |
| **Retailer** | Small business owners | Retail Price | Full Payment, Installment |
| **Regular User** | General consumers | Standard Price | Full Payment, Installment |

### 3.2 Platform Roles

| Role | Description | Primary Functions |
|------|-------------|-------------------|
| **Customer** | End users purchasing products | Browse, purchase, track orders, manage loans |
| **Vendor** | Suppliers/partners providing products | Manage products, fulfill orders, track sales |
| **Admin** | Uzaro platform administrators | Manage users, vendors, organizations, approvals |
| **Financer** | Financial institutions | Manage loan applications, payments, interest rates |

---

## 4. Pricing Structure

### 4.1 Pricing Tiers

```
Vendor Cost Price
    ↓
Uzaro Acquisition Price (Discounted via partnership)
    ↓
├── Employee Price (Lowest markup)
├── Wholesaler Price (Bulk discount applied)
├── Retailer Price (Standard markup)
└── Regular User Price (Highest markup, still < SRP)
    ↓
Market SRP (Reference - always higher than EPP prices)
```

### 4.2 Pricing Rules

1. **All EPP prices must be lower than market SRP**
2. **Employee pricing** receives the highest discount (company subsidy)
3. **Wholesaler pricing** applies volume-based discounts for bulk purchases
4. **Retailer pricing** standard EPP markup
5. **Regular user pricing** lowest discount tier but still competitive

---

## 5. Core Features

### 5.1 Employee Features

| Feature | Description |
|---------|-------------|
| Product Catalog | Browse products with category/vendor/price filters |
| Shopping Cart | Add, remove, update quantities |
| Checkout | Multi-step checkout with installment options |
| Salary Deduction | Automatic payroll deduction for installment payments |
| Credit Limit | Maximum purchase limit based on salary/eligibility |
| Order Tracking | View order status and history |
| Loan Management | Track active loans and payment schedules |
| Profile Management | Personal info, payment methods, preferences |

### 5.2 Wholesaler Features

| Feature | Description |
|---------|-------------|
| Bulk Ordering | Order large quantities with volume discounts |
| Minimum Order Quantity | MOQ requirements for wholesale pricing |
| Bulk Pricing Calculator | Calculate total cost for bulk orders |
| Recurring Orders | Set up scheduled repeat orders |
| Invoice Management | Business invoicing and payment terms |

### 5.3 Retailer Features

| Feature | Description |
|---------|-------------|
| Standard Ordering | Regular order flow with EPP pricing |
| Business Account | Company profile and tax information |
| Order History | Track all business purchases |
| Payment Options | Multiple payment methods available |

### 5.4 Vendor Features

| Feature | Description |
|---------|-------------|
| Product Management | Create, update, manage product listings |
| Inventory Tracking | Stock levels, low stock alerts |
| Pricing Configuration | Set cost price, recommended selling price |
| Category Management | Organize products into categories |
| Order Fulfillment | Process and ship orders |
| Performance Analytics | Sales metrics, revenue tracking |
| Profile Management | Business info, bank details |

### 5.5 Admin Features

| Feature | Description |
|---------|-------------|
| Organization Management | Onboard and manage client companies |
| Employee Management | User eligibility, credit limits |
| Vendor Management | Onboard, approve, manage vendors |
| Product Approval | Review and approve vendor products |
| Order Management | Oversight and intervention capabilities |
| Approval Workflows | Configure multi-level approval chains |
| Reports & Analytics | Platform-wide metrics and insights |
| Settings | System configuration and parameters |

### 5.6 Financer Features

| Feature | Description |
|---------|-------------|
| Application Review | Review loan/installment applications |
| Loan Approval | Approve/reject based on risk assessment |
| Interest Rate Management | Set interest rates per installment term |
| Payment Tracking | Monitor scheduled payments |
| Collection Management | Handle overdue and default cases |
| Customer Portfolio | View customer loan history and risk profile |
| Financial Reports | Loan portfolio analytics |

---

## 6. Payment System

### 6.1 Payment Types

| Type | Description | Applicable To |
|------|-------------|---------------|
| **Full Payment** | Complete payment at checkout | All customers |
| **Installment** | Split payment over months | All customers |
| **Points** | Loyalty points redemption | Enrolled customers |
| **Mixed** | Combination of above | All customers |

### 6.2 Payment Methods

| Method | Description | Applicable To |
|--------|-------------|---------------|
| **Payroll Deduction** | Auto-deduct from salary | Employees only |
| **Cash** | Cash on delivery | All customers |
| **Credit Card** | Card payment | All customers |
| **Debit Card** | Card payment | All customers |
| **Bank Transfer** | Direct bank transfer | All customers |

### 6.3 Installment Plans

| Term | Duration | Interest Rate | Notes |
|------|----------|---------------|-------|
| 3 months | 3 months | Set by Financer | Short-term |
| 6 months | 6 months | Set by Financer | Popular option |
| 12 months | 12 months | Set by Financer | Standard |
| 18 months | 18 months | Set by Financer | Extended |
| 24 months | 24 months | Set by Financer | Long-term |

### 6.4 Salary Deduction Flow (Employees)

```
1. Employee selects installment payment
2. System checks credit limit eligibility
3. Order requires organization approval (if configured)
4. Upon approval, loan is created
5. Financer approves loan application
6. Monthly deduction scheduled from payroll
7. HR/Payroll system receives deduction instructions
8. Deductions processed each pay period
9. Loan marked complete after final payment
```

---

## 7. Order Workflow

### 7.1 Order Status Flow

```
PENDING_APPROVAL
    ↓ (Approval required)
APPROVED
    ↓ (Vendor accepts)
PROCESSING
    ↓ (Vendor ships)
SHIPPED
    ↓ (Customer receives)
DELIVERED
    ↓ (Optional)
COMPLETED

Alternative flows:
- REJECTED (approval denied)
- CANCELLED (customer/admin cancels)
- RETURNED (customer returns product)
```

### 7.2 Approval Workflow

1. **Organization-level Approval**: Required for employees based on org settings
2. **Credit Limit Check**: Automatic validation against available credit
3. **Financer Approval**: Required for installment payments
4. **Admin Override**: Manual intervention capability

---

## 8. Organization Management

### 8.1 Multi-tenant Support

- Each organization (company) can be onboarded separately
- Custom branding (logo, colors) per organization
- Organization-specific settings and policies
- Dedicated employee pools per organization

### 8.2 Organization Configuration

| Setting | Description |
|---------|-------------|
| Credit Limits | Default and max credit limits for employees |
| Approval Workflows | Multi-level approval chains |
| Product Catalog | Curated product selection for organization |
| Payment Options | Enabled payment methods |
| Deduction Schedule | Payroll deduction timing |

---

## 9. Vendor Partnership

### 9.1 Vendor Onboarding

1. Vendor application submission
2. Admin review and verification
3. Contract and pricing negotiation
4. Account activation
5. Product catalog setup
6. Go-live

### 9.2 Vendor Obligations

- Provide products at agreed partnership prices
- Maintain inventory levels
- Fulfill orders within SLA
- Handle returns and warranties
- Provide product information and images

### 9.3 Vendor Benefits

- Access to corporate employee market
- Guaranteed sales volume
- Reduced marketing costs
- Streamlined payment processing

---

## 10. Financer Partnership

### 10.1 Financer Role

- **Pay on behalf** of customers for installment purchases
- Set and manage **interest rates** per term
- Assume **credit risk** for approved loans
- Handle **collections** for overdue payments

### 10.2 Financer Revenue Model

```
Loan Amount: ₱10,000
Interest Rate: 1.5% per month
Term: 12 months

Monthly Interest: ₱150
Total Interest Revenue: ₱1,800
Monthly Payment: ₱983.33 (principal + interest)
```

### 10.3 Risk Management

| Factor | Description |
|--------|-------------|
| Credit Scoring | Assess customer creditworthiness |
| Employment Verification | Confirm active employment status |
| Salary Validation | Verify salary for deduction capacity |
| Loan-to-Income Ratio | Cap installment vs. monthly salary |
| Default Handling | Collections process for non-payment |

---

## 11. Technical Requirements

### 11.1 Platform Architecture

- **Frontend**: React-based SPA with role-based interfaces
- **Backend**: RESTful API services
- **Database**: Relational database for transactional data
- **Authentication**: Role-based access control (RBAC)
- **Integration**: Payroll systems, payment gateways, financer APIs

### 11.2 Integration Points

| System | Integration Type | Purpose |
|--------|------------------|---------|
| Payroll Systems | API/File | Salary deduction processing |
| Payment Gateway | API | Card and bank payments |
| Financer Systems | API | Loan processing and management |
| Shipping Providers | API | Order tracking |
| SMS/Email Gateway | API | Notifications |

---

## 12. Security & Compliance

### 12.1 Data Protection

- Personal data encryption at rest and in transit
- PCI-DSS compliance for payment processing
- GDPR/Data Privacy compliance
- Regular security audits

### 12.2 Access Control

- Role-based permissions
- Multi-factor authentication (optional)
- Session management
- Audit logging

---

## 13. Reporting Requirements

### 13.1 Admin Reports

- Sales performance by vendor/category/period
- Employee participation rates
- Order fulfillment metrics
- Platform revenue analysis

### 13.2 Vendor Reports

- Product performance
- Order fulfillment rates
- Revenue and commission tracking
- Inventory turnover

### 13.3 Financer Reports

- Loan portfolio summary
- Approval/rejection rates
- Payment collection rates
- Default and delinquency metrics
- Interest revenue analysis

---

## 14. Success Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| Employee Participation | >50% | Active users vs. eligible employees |
| Order Fulfillment Rate | >95% | Orders delivered on time |
| Loan Approval Rate | >80% | Approved vs. total applications |
| Payment Collection Rate | >98% | On-time payments |
| Customer Satisfaction | >4.5/5 | User ratings and feedback |
| Vendor Retention | >90% | Active vendors year-over-year |

---

## 15. Future Enhancements

| Phase | Feature | Description |
|-------|---------|-------------|
| Phase 2 | Mobile App | Native iOS/Android applications |
| Phase 2 | Loyalty Program | Points earning and redemption |
| Phase 3 | AI Recommendations | Personalized product suggestions |
| Phase 3 | Advanced Analytics | Predictive insights and forecasting |
| Phase 4 | Marketplace Expansion | Open marketplace for additional vendors |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-30 | - | Initial document |

---

*This document serves as the foundational business requirements for the EPP platform. Technical specifications and detailed user stories should be derived from these requirements.*