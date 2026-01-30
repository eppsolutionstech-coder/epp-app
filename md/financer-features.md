# Financer Module - Features & Specifications

## 1. Overview

The **Financer** role in the EPP platform is responsible for managing loan financing, payment collections, and customer credit risk. Financers pay on behalf of customers who opt for installment payments and earn revenue through interest charges.

**Base Route:** `/financer`

---

## 2. Core Responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Installment Configuration** | Define available installment terms (3, 6, 12, 18, 24 months) |
| **Interest Rate Management** | Set interest rates per installment term and customer type |
| **Loan Application Review** | Approve or reject customer loan applications |
| **Active Loan Monitoring** | Track all disbursed loans and repayment progress |
| **Payment Collection** | Monitor and manage payment schedules |
| **Customer Risk Assessment** | Evaluate creditworthiness and manage blacklists |
| **Financial Reporting** | Generate portfolio and collection reports |

---

## 3. Modules & Navigation

| Module | Route | Icon | Description |
|--------|-------|------|-------------|
| Dashboard | `/financer` | LayoutDashboard | Executive overview and KPIs |
| Applications | `/financer/applications` | FileText | Loan application review |
| Active Loans | `/financer/loans` | Wallet | Monitor disbursed loans |
| Payments | `/financer/payments` | CreditCard | Payment tracking & collections |
| Customers | `/financer/customers` | Users | Customer management |
| Reports | `/financer/reports` | PieChart | Analytics & reporting |
| Settings | `/financer/profile` | Settings | Account configuration |

---

## 4. Installment Configuration

### 4.1 Available Loan Terms

Financers can configure the following installment periods:

| Term | Duration | Use Case |
|------|----------|----------|
| 3 months | Short-term | Small purchases, low-risk customers |
| 6 months | Short-term | Popular for mid-range products |
| 12 months | Standard | Most common term |
| 18 months | Extended | Higher-value purchases |
| 24 months | Long-term | Premium products, high credit customers |

### 4.2 Monthly Payment Calculation

```
Monthly Payment = (Principal + Total Interest) / Number of Months

Where:
- Principal = Loan Amount
- Total Interest = Principal × (Annual Interest Rate / 12) × Number of Months
```

**Example:**
```
Loan Amount: ₱10,000
Interest Rate: 12% annually (1% monthly)
Term: 12 months

Total Interest = ₱10,000 × 0.01 × 12 = ₱1,200
Total Amount = ₱10,000 + ₱1,200 = ₱11,200
Monthly Payment = ₱11,200 / 12 = ₱933.33
```

---

## 5. Interest Rate Management

### 5.1 Interest Rates by Customer Type

Different customer types have different risk profiles, affecting their interest rates:

| Customer Type | Default Rate | Risk Level | Rationale |
|---------------|--------------|------------|-----------|
| **Employee** | 12% annually | Low | Stable income, salary deduction |
| **Wholesaler** | 10% annually | Lowest | Established business, bulk orders |
| **Retailer** | 15% annually | Medium | Business income variability |
| **Regular User** | 18% annually | High | No guaranteed income source |

### 5.2 Interest Rate Factors

Financers may adjust rates based on:

| Factor | Impact |
|--------|--------|
| Credit Score | Higher score = lower rate |
| Loan Amount | Larger loans may qualify for better rates |
| Loan Term | Longer terms may have higher rates |
| Payment History | Good history = rate reduction eligibility |
| Employment Status | Verified employment = preferential rates |

### 5.3 Interest Rate Settings (Future Enhancement)

```typescript
// Proposed interest rate configuration structure
interface InterestRateConfig {
  customerType: "employee" | "retailer" | "wholesaler" | "regular";
  baseRate: number;           // Base annual percentage
  termAdjustments: {
    3: number;   // e.g., -0.5% for 3-month term
    6: number;   // e.g., 0% for 6-month term
    12: number;  // e.g., 0% for 12-month term
    18: number;  // e.g., +0.5% for 18-month term
    24: number;  // e.g., +1% for 24-month term
  };
  creditScoreAdjustments: {
    excellent: number;  // 750+ score: e.g., -1%
    good: number;       // 650-749: e.g., 0%
    fair: number;       // 550-649: e.g., +1%
    poor: number;       // <550: e.g., +2% or reject
  };
}
```

---

## 6. Module Details

### 6.1 Dashboard (`/financer`)

**Purpose:** Executive overview of financer operations

**Key Metrics:**

| Metric | Description | Example |
|--------|-------------|---------|
| Total Portfolio | Sum of all active loan balances | ₱245,000 |
| Active Loans | Count of loans in active status | 47 loans |
| Pending Applications | Applications awaiting review | 5 applications |
| Overdue Amount | Sum of overdue payment amounts | ₱8,750 |
| Default Rate | Percentage of defaulted loans | 2.3% |
| Monthly Collections | Payments received this month | ₱125,000 |

**Dashboard Sections:**

1. **Stats Cards** - 4 KPI cards with visual indicators
2. **Pending Applications** - Quick view of applications needing review
3. **Quick Actions** - Shortcuts to common tasks
4. **Recent Payments** - Last 5 payment transactions

---

### 6.2 Applications (`/financer/applications`)

**Purpose:** Review and process loan applications

**Application Statuses:**

| Status | Color | Description |
|--------|-------|-------------|
| Pending | Yellow | New application, not yet reviewed |
| Under Review | Blue | Being evaluated by financer |
| Approved | Green | Approved, loan to be disbursed |
| Rejected | Red | Application denied |

**Application Data:**

```typescript
interface LoanApplication {
  id: string;                    // e.g., "APP-001"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerType: CustomerType;
  productId: string;
  productName: string;
  productImage?: string;
  requestedAmount: number;
  interestRate: number;
  requestedTerm: number;         // months
  monthlyPayment: number;        // calculated
  status: ApplicationStatus;
  appliedDate: string;
  reviewedDate?: string;
  creditScore?: number;
  notes?: string;
}
```

**Features:**
- Search by customer name, product, or application ID
- Filter by status
- View detailed application with customer credit info
- Approve/Reject with notes

**Review Actions:**
- **Approve** - Converts application to active loan
- **Reject** - Denies application with reason
- **Mark Under Review** - Indicates evaluation in progress

---

### 6.3 Active Loans (`/financer/loans`)

**Purpose:** Monitor all disbursed loans and track repayments

**Loan Statuses:**

| Status | Color | Description |
|--------|-------|-------------|
| Active | Blue | Loan in good standing, payments ongoing |
| Completed | Green | All payments received, loan closed |
| Defaulted | Red | Missed payments, requires collection action |
| Restructured | Purple | Terms modified due to payment difficulty |

**Loan Data:**

```typescript
interface ActiveLoan {
  id: string;                    // e.g., "LOAN-001"
  applicationId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerType: CustomerType;
  productName: string;
  productImage?: string;
  principalAmount: number;       // Original loan amount
  interestRate: number;
  totalAmount: number;           // Principal + Interest
  paidAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  term: number;                  // Total months
  paidInstallments: number;
  remainingInstallments: number;
  status: LoanStatus;
  startDate: string;
  nextPaymentDate: string;
  lastPaymentDate?: string;
}
```

**Features:**
- Summary stats (total outstanding, active count, completed count)
- Search and filter by status
- Visual progress bars for repayment tracking
- Detailed loan view with payment history

**Loan Detail View:**
- Customer information
- Loan summary (principal, interest, total)
- Repayment progress visualization
- Payment schedule and history
- Next payment alert
- Default warning (if applicable)

---

### 6.4 Payments (`/financer/payments`)

**Purpose:** Track all payment transactions and manage collections

**Payment Statuses:**

| Status | Color | Description |
|--------|-------|-------------|
| Paid | Green | Payment received successfully |
| Pending | Yellow | Payment due, not yet received |
| Overdue | Red | Past due date, not paid |
| Partial | Orange | Partial payment received |

**Payment Data:**

```typescript
interface Payment {
  id: string;                    // e.g., "PAY-001"
  loanId: string;
  customerId: string;
  customerName: string;
  amount: number;                // Total payment
  principalPortion: number;      // Amount reducing principal
  interestPortion: number;       // Interest earned
  paymentDate: string;
  dueDate: string;
  status: PaymentStatus;
  paymentMethod?: string;        // Bank Transfer, GCash, etc.
  transactionRef?: string;
}
```

**Features:**
- Summary stats (collected, pending, overdue)
- Tabbed interface (All, Overdue, Pending, Paid)
- Search and filter capabilities
- Principal vs. interest breakdown

**Payment Methods Supported:**
- Payroll Deduction (Employees)
- Bank Transfer
- GCash / E-wallets
- Credit Card
- Debit Card
- Cash

---

### 6.5 Customers (`/financer/customers`)

**Purpose:** Manage customer profiles and assess credit risk

**Customer Statuses:**

| Status | Color | Description |
|--------|-------|-------------|
| Active | Green | Good standing, eligible for loans |
| Inactive | Gray | No recent activity |
| Blacklisted | Red | Barred from new loans |

**Customer Types:**

| Type | Badge Color | Description |
|------|-------------|-------------|
| Employee | Blue | Corporate employees with salary deduction |
| Retailer | Purple | Small business owners |
| Wholesaler | Cyan | Bulk buyers / resellers |
| Regular | Gray | General consumers |

**Customer Data:**

```typescript
interface FinancerCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  organization?: string;
  activeLoans: number;
  totalBorrowed: number;         // All-time total
  totalPaid: number;             // All-time total
  creditScore: number;           // 300-850 range
  status: CustomerStatus;
  joinedDate: string;
  avatar?: string;
}
```

**Credit Score Indicators:**

| Range | Rating | Color |
|-------|--------|-------|
| 750+ | Excellent | Green |
| 650-749 | Good | Blue |
| 550-649 | Fair | Yellow |
| <550 | Poor | Red |

**Features:**
- Summary stats (total customers, financed, collected, blacklisted)
- Multi-filter (type + status)
- Credit score monitoring
- Loan history per customer

---

### 6.6 Reports (`/financer/reports`)

**Purpose:** Analytics, insights, and downloadable reports

**Time Period Options:**
- This Month
- Last Month
- This Quarter
- This Year
- All Time

**Key Metrics:**

| Metric | Description |
|--------|-------------|
| Total Portfolio | Sum of active loan balances |
| Interest Earned | Total interest from paid payments |
| Principal Collected | Amount of principal repayments |
| Default Rate | Percentage of defaulted loans |

**Available Reports:**

| Report | Description |
|--------|-------------|
| Portfolio Summary | Overview of all active loans and performance |
| Collections Report | Detailed breakdown of payments received |
| Delinquency Report | Analysis of overdue and defaulted loans |
| Customer Analysis | Customer demographics and loan distribution |
| Interest Income Report | Interest earned from all active loans |
| Aging Report | Breakdown of receivables by age |

**Charts & Visualizations:**
- Loan status distribution (pie chart)
- Loans by customer type (bar chart)
- Payment collection summary

---

### 6.7 Settings (`/financer/profile`)

**Purpose:** Account configuration and preferences

**Settings Tabs:**

| Tab | Content |
|-----|---------|
| **Profile** | Personal information (name, email, phone, photo) |
| **Company** | Company details (name, registration, address) |
| **Notifications** | Alert preferences (applications, payments, reports) |
| **Security** | Password, 2FA, active sessions |
| **Billing** | Subscription plan, payment method, invoices |

**Notification Preferences:**

| Notification | Default | Description |
|--------------|---------|-------------|
| New Loan Applications | On | Alert when new application submitted |
| Payment Received | On | Notification when payment processed |
| Overdue Alerts | On | Warning for overdue payments |
| Weekly Reports | Off | Automated weekly summary email |
| Marketing Updates | Off | Platform news and updates |

---

## 7. Business Workflows

### 7.1 Loan Application Flow

```
┌─────────────────┐
│ Customer applies │
│ for installment  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Application      │
│ Status: PENDING  │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Financer reviews │
│ Status: UNDER    │
│ REVIEW           │
└────────┬────────┘
         ▼
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│APPROVED│ │REJECTED│
└───┬───┘ └───────┘
    ▼
┌─────────────────┐
│ Loan Created     │
│ Status: ACTIVE   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Financer pays    │
│ vendor on behalf │
│ of customer      │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Monthly payments │
│ collected from   │
│ customer         │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Loan COMPLETED   │
│ (all paid)       │
└─────────────────┘
```

### 7.2 Payment Collection Flow

```
┌─────────────────┐
│ Payment Due Date │
│ Approaches       │
└────────┬────────┘
         ▼
┌─────────────────┐
│ System sends     │
│ payment reminder │
└────────┬────────┘
         ▼
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────────┐
│ PAID  │ │ NOT PAID  │
└───────┘ └─────┬─────┘
                ▼
         ┌──────┴──────┐
         ▼             ▼
    ┌────────┐   ┌──────────┐
    │ PENDING│   │ OVERDUE  │
    │(grace  │   │(past due)│
    │period) │   └────┬─────┘
    └────────┘        ▼
                ┌──────────┐
                │Collection │
                │ Action    │
                └──────────┘
```

### 7.3 Employee Salary Deduction Flow

```
┌─────────────────┐
│ Employee selects │
│ installment      │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Credit limit     │
│ check            │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Organization     │
│ approval (if     │
│ required)        │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Financer         │
│ approval         │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Deduction        │
│ schedule created │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Monthly payroll  │
│ deduction        │
│ (automated)      │
└─────────────────┘
```

---

## 8. Data Models Summary

```typescript
// Customer Types
type CustomerType = "employee" | "retailer" | "wholesaler" | "regular";

// Application Statuses
type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected";

// Loan Statuses
type LoanStatus = "active" | "completed" | "defaulted" | "restructured";

// Payment Statuses
type PaymentStatus = "paid" | "pending" | "overdue" | "partial";

// Customer Statuses
type CustomerStatus = "active" | "inactive" | "blacklisted";
```

---

## 9. Future Enhancements

| Feature | Priority | Description |
|---------|----------|-------------|
| **Dynamic Interest Rates** | High | UI to configure rates per term/customer type |
| **Automated Approvals** | High | Auto-approve based on credit score thresholds |
| **Payment Reminders** | Medium | SMS/Email notifications for upcoming payments |
| **Collection Automation** | Medium | Automated follow-up for overdue payments |
| **Risk Scoring Model** | Medium | AI-based credit risk assessment |
| **Loan Restructuring** | Low | Tools to modify loan terms for struggling customers |
| **API Integration** | Low | Connect to external credit bureaus |
| **Mobile App** | Low | Dedicated financer mobile application |

---

## 10. Access Control

| Action | Permission Level |
|--------|------------------|
| View Dashboard | All Financer users |
| View Applications | All Financer users |
| Approve/Reject Applications | Financer Approver+ |
| View Active Loans | All Financer users |
| View Payments | All Financer users |
| Record Payments | Financer Staff+ |
| View Customers | All Financer users |
| Blacklist Customers | Financer Manager+ |
| Generate Reports | All Financer users |
| Export Reports | Financer Manager+ |
| Configure Settings | Financer Admin only |
| Modify Interest Rates | Financer Admin only |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-30 | Initial document |

---

*This document outlines the Financer module features for the EPP platform. For technical implementation details, refer to the codebase documentation.*