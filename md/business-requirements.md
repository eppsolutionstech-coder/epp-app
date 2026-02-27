# EPP (Employee Purchase Program) — Business Requirements

## 1. Overview

**Uzaro** operates a B2B2C e-commerce platform where employees and other customer types buy products at below-market prices via vendor partnerships. **Financiers** (lending institutions) fund installment orders by lending capital to Uzaro equal to the supplier's price (`supplierPrice`). Interest revenue from installment plans is split between Uzaro and the Financier (configurable ratio, default 50/50).

**Revenue streams:** Product markup | Platform/commission fees | Financier interest share

---

## 2. Roles

### Customer Types

| Type | Description | Price Field | Payment Options |
|------|-------------|-------------|-----------------|
| **Employee** | Corporate employees enrolled in EPP | `employeePrice` (lowest) | Full Payment, Installment (Salary Deduction) |
| **Wholesaler** | Bulk buyers / resellers | `wholesalePrice` | Full Payment, Installment |
| **Retailer** | Small business owners | `standardPrice` | Full Payment, Installment |
| **Regular User** | General consumers | `standardPrice` | Full Payment, Installment |

### Platform Roles

| Role | Primary Functions |
|------|-------------------|
| **Customer** | Browse, purchase, track orders, manage loans |
| **Vendor/Supplier** | Manage products, fulfill orders, track sales |
| **Admin** | Manage users, vendors, orgs, approvals, settings |
| **Financier** | Approve orders, release funds, set installment terms & rates, receive repayments |

---

## 3. Pricing

### Schema Field Mapping (Source of Truth)

| Schema Field | Business Term | Description |
|---|---|---|
| `srp` | SRP | Market/suggested retail price — set by vendor; reference point only |
| `supplierPrice` | Supplier Price | Price supplier sells to Uzaro (Financier lends this amount) |
| `employeePrice` | Employee Price | `supplierPrice` + Uzaro markup for employees (lowest customer price) |
| `standardPrice` | Retailer / Regular User Price | `supplierPrice` + Uzaro markup for retailer and regular user customers |
| `wholesalePrice` | Wholesale Price | `supplierPrice` + Uzaro markup (volume-based) for wholesale customers |

### Pricing Tier (Low → High)

```
srp — market reference, all EPP prices must be below this
    ↓
supplierPrice — supplier → Uzaro (Financier lends this)
    ↓ + Uzaro markup per customer type
├── employeePrice   (Employee — lowest markup)
├── wholesalePrice  (Wholesaler — volume discount)
└── standardPrice   (Retailer & Regular User — standard markup)
    ↓ + Financier interest (installment orders only)
Final Installment Price
```

### Pricing Rules

1. All EPP prices must be below `srp`
2. `employeePrice` has the lowest markup — company subsidy
3. `wholesalePrice` applies volume-based discounts for bulk purchases
4. Uzaro markup = customer price field − `supplierPrice`

### Installment Calculation Example

```
srp                      = ₱10,000
supplierPrice            = ₱9,000   (supplier → Uzaro; Financier lends this)
employeePrice            = ₱9,250   (supplierPrice + ₱250 Uzaro markup)

Installment term = 3 months | Rate = 2% per installment

Principal/installment = ₱9,250 ÷ 3         = ₱3,083.33
Interest/installment  = ₱3,083.33 × 2%     = ₱61.67
Payment/installment   = ₱3,083.33 + ₱61.67 = ₱3,145.00

Total paid by customer = ₱3,145.00 × 3          = ₱9,435.00
Total interest         = ₱9,435.00 − ₱9,250.00  = ₱185.00

Revenue split (50/50 default):
  Financier share = ₱185.00 × 50% = ₱92.50
  Uzaro share     = ₱185.00 × 50% = ₱92.50

Settlement:
  Financier receives = supplierPrice + Financier share = ₱9,000 + ₱92.50 = ₱9,092.50
  Uzaro retains      = markup + Uzaro share            =   ₱250 + ₱92.50 =   ₱342.50
  Verification: ₱9,092.50 + ₱342.50 = ₱9,435.00 ✓
```

### Revenue Split Configuration

| Setting | Default |
|---------|---------|
| Split ratio | 50% Uzaro / 50% Financier |
| Configurable per | Financier agreement |
| Admin override | Yes |

### UI Display Rule (EPP Employees)

- `supplierPrice` and retail discount savings are **NOT** shown in cart/checkout for the Employee role
- UI displays `Total With Interest` in place of `supplierPrice` across all summary views

---

## 4. Features

### Employee
Product catalog (filter by category/vendor/price) | Shopping cart | Multi-step checkout with installment options | Salary deduction | Credit limit | Order tracking | Loan management | Profile management

### Wholesaler
Bulk ordering with volume discounts | MOQ requirements | Bulk pricing calculator | Recurring orders | Invoice management

### Retailer
Standard EPP order flow | Business account (company profile, tax) | Order history | Payment options

### Vendor/Supplier
Product management (create/update/publish) | Inventory tracking + low-stock alerts | Pricing configuration (`supplierPrice`, `srp`) | Category management | Order fulfillment | Sales analytics | Profile/bank management

### Admin
Organization onboarding & management | Employee eligibility & credit limits | Vendor onboarding & approval | Product approval (PENDING → APPROVED/REJECTED) | Order management & override | Approval workflow configuration | Platform reports & analytics | System settings

### Financier
Order approval (approve/reject installment orders) | Fund release (releases `supplierPrice` to Uzaro) | Installment term & interest rate configuration | Payment tracking (repayments from Uzaro) | Revenue share dashboard | Collection management (overdue/defaults) | Customer loan portfolio | Financial reports

---

## 5. Payment System

### Payment Types

| Type | Applicable To |
|------|--------------|
| Full Payment | All customers |
| Installment | All customers |
| Points (loyalty) | Enrolled customers |
| Mixed | All customers |

### Payment Methods

| Method | Applicable To |
|--------|--------------|
| Payroll Deduction | Employees only |
| Cash (COD) | All |
| Credit Card | All |
| Debit Card | All |
| Bank Transfer | All |

### Installment Terms
Available: **3 / 6 / 12 / 18 / 24 months** — interest rates set per term by Financier.

---

## 6. Order Workflow

### Order Status Flow

```
PENDING_ADMIN_REVIEW → PENDING_FINANCIER_APPROVAL → FINANCIER_APPROVED
→ FUNDS_RELEASED → PO_CREATED → VENDOR_SHIPPED → RECEIVED_BY_UZARO
→ SHIPPED_TO_CUSTOMER → DELIVERED → COMPLETED

Alt: REJECTED | CANCELLED | RETURNED
```

### End-to-End Installment Flow

```
1.  Vendor adds product → Admin approves listing (PENDING → APPROVED)
2.  Customer places order with installment/payroll deduction
3.  [If org requires] Organization-level approval
4.  Credit limit checked automatically
5.  Uzaro Admin reviews → PENDING_FINANCIER_APPROVAL
6.  Financier approves → FINANCIER_APPROVED
7.  Financier releases supplierPrice funds to Uzaro → FUNDS_RELEASED
8.  Uzaro creates PO to supplier → PO_CREATED
9.  Supplier fulfills & ships to Uzaro → VENDOR_SHIPPED
10. Uzaro receives & signs delivery receipt → RECEIVED_BY_UZARO
11. Uzaro ships to customer → SHIPPED_TO_CUSTOMER
12. Customer receives product → DELIVERED / COMPLETED
13. Monthly payroll deductions begin
14. Uzaro collects installment payments
15. Uzaro remits to Financier: supplierPrice + Financier's interest share
16. Uzaro retains: markup + Uzaro's interest share
```

---

## 7. Organization Management

Multi-tenant: each org onboarded separately with custom branding (logo, colors), isolated employee pool, and org-specific settings:

| Setting | Description |
|---------|-------------|
| Credit Limits | Default and max per employee |
| Approval Workflows | Multi-level chains |
| Product Catalog | Curated selection per org |
| Payment Options | Enabled methods |
| Deduction Schedule | Payroll deduction timing |

---

## 8. Vendor Partnership

**Onboarding:** Application → Admin review → Contract & pricing → Activation → Catalog setup → Go-live

**Obligations:** Supply at agreed `supplierPrice` | Maintain inventory | Meet SLA | Handle returns/warranties | Provide product content

**Benefits:** Access to corporate employee market | Guaranteed volume | Reduced marketing costs | Streamlined payments

---

## 9. Financier Partnership

**Role:** Lending institution that funds installment orders.
- Lends `supplierPrice` (excludes Uzaro markup) per approved order
- Approves/rejects each installment order before releasing funds
- Sets installment terms and interest rates
- Receives repayment from Uzaro: `supplierPrice` + Financier's interest share

**Risk Management:**

| Factor | Description |
|--------|-------------|
| Credit Scoring | Customer creditworthiness assessment |
| Employment Verification | Confirm active employment |
| Salary Validation | Verify deduction capacity |
| Loan-to-Income Ratio | Cap installments vs. monthly salary |
| Default Handling | Collections process for non-payment |
| Order Approval | Financier can reject high-risk orders |

---

## 10. Technical

**Stack:** React SPA (role-based) | RESTful API | Relational DB | RBAC auth

**Integrations:**

| System | Type | Purpose |
|--------|------|---------|
| Payroll Systems | API/File | Salary deduction processing |
| Payment Gateway | API | Card and bank payments |
| Financier Systems | API | Loan processing and management |
| Shipping Providers | API | Order tracking |
| SMS/Email Gateway | API | Notifications |

**Security:** Data encryption at rest & in transit | PCI-DSS | GDPR/Data Privacy | RBAC | MFA (optional) | Audit logging

---

## 11. Reporting

| Audience | Reports |
|----------|---------|
| **Admin** | Sales by vendor/category/period, employee participation, fulfillment metrics, platform revenue |
| **Vendor** | Product performance, fulfillment rates, revenue & commission, inventory turnover |
| **Financier** | Loan portfolio, approval/rejection rates, fund release tracking, repayment rates, defaults, interest revenue & share breakdown |

---

## 12. Success Metrics

| Metric | Target |
|--------|--------|
| Employee Participation | >50% |
| Order Fulfillment Rate | >95% |
| Loan Approval Rate | >80% |
| Payment Collection Rate | >98% |
| Customer Satisfaction | >4.5/5 |
| Vendor Retention | >90% |

---

## 13. Future Phases

| Phase | Feature |
|-------|---------|
| 2 | Mobile App (iOS/Android), Loyalty Program (points) |
| 3 | AI Recommendations, Advanced Analytics |
| 4 | Open Marketplace expansion |

---

_v1.3 — Schema field names (`srp`, `supplierPrice`, `employeePrice`, `wholesalePrice`, `standardPrice`) are the source of truth for pricing._
