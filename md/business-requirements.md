# EPP (Employee Purchase Program) - Business Requirements Document

## 1. Executive Summary

The Employee Purchase Program (EPP) is a B2B2C e-commerce platform owned by **Uzaro** that enables various customer types to purchase products at discounted prices through strategic vendor partnerships. The platform supports multiple payment options including installment plans funded by partnered **Financiers** (lending institutions) that lend capital to Uzaro for product procurement and order fulfillment.

---

## 2. Business Model

### 2.1 Core Value Proposition

- **Uzaro** establishes direct partnerships with vendors/suppliers/manufacturers
- Partners offer products at **discounted wholesale prices** to Uzaro
- Uzaro applies a **small markup** (still lower than SRP/retail price) and sells to customers
- **Financiers** lend capital (equal to the **Cost Price**) to Uzaro to purchase products from vendors on behalf of customers
- Customers benefit from below-market pricing through the EPP program
- Interest revenue from installment plans is **shared between Uzaro and the Financier** (configurable split)

### 2.2 Revenue Streams

| Revenue Source | Description |
|----------------|-------------|
| Product Markup | Small margin added to vendor wholesale price |
| Platform Fees | Commission from vendor sales |
| Financier Interest Share | 50% (configurable) of installment interest revenue shared with Uzaro |

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
| **Financier** | Lending institutions that fund product purchases | Approve orders, release funds to Uzaro, set installment terms & rates, receive repayments |

---

## 4. Pricing Structure

### 4.1 Pricing Tiers

```
Market SRP (Suggested Retail Price - reference point)
    ↓
Cost Price (Discounted price from vendor via internal partnership)
    ↓ Uzaro adds small markup per customer type
├── Employee Price (Lowest markup)
├── Wholesaler Price (Bulk discount applied)
├── Retailer Price (Standard markup)
└── Regular User Price (Highest markup, still < SRP)
    ↓ For installment orders, Financier adds interest
Final Installment Price (Base Price + Financier Interest)
```

### 4.2 Pricing Rules

1. **All EPP prices must be lower than market SRP**
2. **Employee pricing** receives the highest discount (company subsidy)
3. **Wholesaler pricing** applies volume-based discounts for bulk purchases
4. **Retailer pricing** standard EPP markup
5. **Regular user pricing** lowest discount tier but still competitive

### 4.3 Pricing Terminology

| Term | Definition |
|------|-----------|
| **SRP** | Suggested Retail Price — the market price set by the vendor |
| **Cost Price** | The discounted price Uzaro acquires the product for via vendor partnership |
| **Employee Price** | Cost Price + Uzaro markup for employee customers |
| **Wholesaler Price** | Cost Price + Uzaro markup for wholesaler customers |
| **Retailer Price** | Cost Price + Uzaro markup for retailer customers |
| **Regular User Price** | Cost Price + Uzaro markup for general consumers |
| **Financier Rate** | Interest rate per installment set by the Financier |
| **Total Installment Price** | Base price + total accumulated interest across all installments |

### 4.4 Pricing Calculation with Financier (Installment Orders)

When a customer chooses installment payment, the Financier's interest is applied on top of the base price for that customer type.

**Example Calculation (Employee Price, 3-month installment):**

```
Step 1: Vendor sets product SRP
  SRP = ₱10,000

Step 2: Uzaro acquires at discounted Cost Price (via vendor partnership)
  Cost Price = ₱9,000

Step 3: Uzaro adds markup → Employee Price
  Uzaro Markup = ₱250
  Employee Price = ₱9,000 + ₱250 = ₱9,250

Step 4: Financier sets installment terms
  Installment Term = 3 months
  Interest Rate = 2% per installment

Step 5: Calculate installment breakdown
  Principal per Installment = ₱9,250 / 3 = ₱3,083.33
  Interest per Installment  = ₱3,083.33 × 0.02 = ₱61.67
  Amount per Installment    = ₱3,083.33 + ₱61.67 = ₱3,145.00

Step 6: Calculate total price
  Total Installment Price = ₱3,145.00 × 3 = ₱9,435.00
  Total Interest Revenue  = ₱9,435.00 - ₱9,250.00 = ₱185.00
```

### 4.5 Financier Interest Revenue Sharing

The total interest revenue generated from installment plans is **split between Uzaro and the Financier** based on a configurable ratio.

```
Using the example above:

Total Interest Revenue = ₱185.00
Revenue Split Ratio    = 50/50 (configurable per Financier agreement)

Uzaro Share     = ₱185.00 × 50% = ₱92.50
Financier Share = ₱185.00 × 50% = ₱92.50
```

**Revenue Split Configuration:**

| Setting | Description | Default |
|---------|-------------|---------|
| Split Ratio | Percentage of interest revenue allocated to each party | 50% Uzaro / 50% Financier |
| Configurable Per | Can be configured per Financier agreement | Per Financier |
| Override | Admin can override default split for specific Financier partnerships | Yes |

**Uzaro Total Revenue per Transaction (Installment):**

```
Financier Lends         = Cost Price = ₱9,000.00 (excludes Uzaro markup)
Uzaro Markup Revenue    = Employee Price - Cost Price = ₱250.00
Uzaro Interest Share    = ₱92.50
Total Uzaro Revenue     = ₱250.00 + ₱92.50 = ₱342.50

Uzaro remits to Financier = ₱9,000.00 + ₱92.50 = ₱9,092.50
```

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

### 5.6 Financier Features

| Feature | Description |
|---------|-------------|
| Order Approval | Review and approve/reject customer installment orders |
| Fund Release | Release lending capital to Uzaro for approved orders |
| Installment Configuration | Set number of installments and interest rate per term |
| Interest Rate Management | Configure interest rates per installment term |
| Payment Tracking | Monitor scheduled repayments from Uzaro |
| Revenue Share Dashboard | Track interest revenue and split with Uzaro |
| Collection Management | Handle overdue and default cases |
| Customer Portfolio | View customer loan history and risk profile |
| Financial Reports | Loan portfolio analytics, revenue share reports |

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
| 3 months | 3 months | Set by Financier | Short-term |
| 6 months | 6 months | Set by Financier | Popular option |
| 12 months | 12 months | Set by Financier | Standard |
| 18 months | 18 months | Set by Financier | Extended |
| 24 months | 24 months | Set by Financier | Long-term |

### 6.4 Salary Deduction Flow (Employees)

```
1. Employee selects installment payment at checkout
2. System checks credit limit eligibility
3. Order requires organization approval (if configured)
4. Uzaro Admin reviews the order
5. Financier reviews and approves the installment order
6. Financier releases funds equal to Cost Price (lending capital) to Uzaro
7. Uzaro uses funds to create Purchase Order to vendor/supplier
8. Vendor/Supplier fulfills and ships product to Uzaro
9. Uzaro receives product and signs delivery receipt
10. Uzaro fulfills and delivers product to the customer
11. Monthly salary deduction begins for the customer
12. HR/Payroll system processes deductions each pay period
13. Uzaro collects payments from payroll deductions
14. Uzaro remits repayment to Financier (cost price + Financier's interest share)
15. Loan marked complete after final payment
```

---

## 7. Order Workflow

### 7.1 Order Status Flow

```
PENDING_ADMIN_REVIEW
    ↓ (Uzaro Admin reviews)
PENDING_FINANCIER_APPROVAL
    ↓ (Financier approves installment order)
FINANCIER_APPROVED
    ↓ (Financier releases Cost Price funds to Uzaro)
FUNDS_RELEASED
    ↓ (Uzaro creates Purchase Order to vendor)
PO_CREATED
    ↓ (Vendor fulfills product)
VENDOR_SHIPPED
    ↓ (Uzaro receives product)
RECEIVED_BY_UZARO
    ↓ (Uzaro ships to customer)
SHIPPED_TO_CUSTOMER
    ↓ (Customer receives)
DELIVERED
    ↓ (Optional)
COMPLETED

Alternative flows:
- REJECTED (Financier or Admin denies)
- CANCELLED (customer/admin cancels)
- RETURNED (customer returns product)
```

### 7.2 End-to-End Order Flow (Installment)

```
1. Vendor/Supplier adds product to EPP app
2. Uzaro Admin approves the product listing
3. Customer browses products on EPP app
4. Customer places order with installment/payroll deduction
5. Uzaro Admin sees and reviews the order
6. Financier reviews and approves the order
7. Financier releases lending capital equal to Cost Price (funds) to Uzaro
8. Uzaro uses the funds to purchase product from vendor/supplier
9. Uzaro creates Purchase Order (PO) to vendor/supplier
10. Vendor/Supplier sees and fulfills the order
11. Uzaro receives the product and signs a delivery receipt
12. Uzaro fulfills the product to the customer
13. Customer receives product ✓
14. Customer pays via automatic payroll deduction (monthly installments)
15. Uzaro collects the installment payments
16. Uzaro remits repayment to Financier (cost price + Financier's interest share)
17. Financier receives repayment ✓
18. Uzaro retains its markup + its share of the interest revenue ✓
```

### 7.3 Approval Workflow

1. **Organization-level Approval**: Required for employees based on org settings
2. **Credit Limit Check**: Automatic validation against available credit
3. **Admin Review**: Uzaro admin reviews the order
4. **Financier Approval**: Required for installment payments — Financier decides whether to fund the order
5. **Admin Override**: Manual intervention capability

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

## 10. Financier Partnership

### 10.1 Financier Role

The Financier acts as a **lending institution** that provides capital to Uzaro for purchasing products from vendors on behalf of customers who choose installment payment.

- **Lend money to Uzaro** equal to the **Cost Price** (not including Uzaro's markup) to fund product purchases for installment orders
- **Approve installment orders** — decide whether to fund each customer order
- **Release funds to Uzaro** upon order approval
- Set and manage **installment terms** (number of installments) and **interest rates** per term
- **Receive repayments** from Uzaro as customers pay through payroll deductions
- Earn revenue through **interest rate share** (configurable split with Uzaro)

### 10.2 Financier Fund Flow

```
Financier releases funds (Cost Price = ₱9,000) to Uzaro
    ↓
Uzaro uses funds to purchase product from Vendor at Cost Price
    ↓
Uzaro creates Purchase Order → Vendor fulfills
    ↓
Customer pays installments via payroll deduction (based on Employee Price + interest)
    ↓
Uzaro collects payments (₱9,435.00 total)
    ↓
Uzaro remits to Financier: Cost Price + Financier's Interest Share (₱9,000 + ₱92.50 = ₱9,092.50)
    ↓
Uzaro retains: Markup + Uzaro's Interest Share (₱250 + ₱92.50 = ₱342.50)
```

### 10.3 Financier Revenue Model

```
Example: Cost Price = ₱9,000 | Employee Price = ₱9,250 | Term = 3 months | Rate = 2%

Financier lends to Uzaro   = ₱9,000 (Cost Price only, excludes Uzaro markup)

Customer installment calculation (based on Employee Price):
  Principal per Installment  = ₱9,250 / 3 = ₱3,083.33
  Interest per Installment   = ₱3,083.33 × 2% = ₱61.67
  Payment per Installment    = ₱3,083.33 + ₱61.67 = ₱3,145.00

Total Paid by Customer       = ₱3,145.00 × 3 = ₱9,435.00
Total Interest Generated     = ₱185.00

Revenue Split (50/50 default):
  Financier Interest Share   = ₱185.00 × 50% = ₱92.50
  Uzaro Interest Share       = ₱185.00 × 50% = ₱92.50

Financier receives from Uzaro:
  Total = ₱9,000.00 (cost price / loan principal) + ₱92.50 (interest share) = ₱9,092.50

Uzaro retains:
  Total = ₱250.00 (markup) + ₱92.50 (interest share) = ₱342.50

Verification: ₱9,092.50 + ₱342.50 = ₱9,435.00 ✓ (matches total paid by customer)
```

### 10.4 Risk Management

| Factor | Description |
|--------|-------------|
| Credit Scoring | Assess customer creditworthiness |
| Employment Verification | Confirm active employment status |
| Salary Validation | Verify salary for deduction capacity |
| Loan-to-Income Ratio | Cap installment vs. monthly salary |
| Default Handling | Collections process for non-payment |
| Order Approval | Financier can reject high-risk orders before releasing funds |

---

## 11. Technical Requirements

### 11.1 Platform Architecture

- **Frontend**: React-based SPA with role-based interfaces
- **Backend**: RESTful API services
- **Database**: Relational database for transactional data
- **Authentication**: Role-based access control (RBAC)
- **Integration**: Payroll systems, payment gateways, financier APIs

### 11.2 Integration Points

| System | Integration Type | Purpose |
|--------|------------------|---------|
| Payroll Systems | API/File | Salary deduction processing |
| Payment Gateway | API | Card and bank payments |
| Financier Systems | API | Loan processing and management |
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

### 13.3 Financier Reports

- Loan portfolio summary
- Approval/rejection rates
- Fund release tracking (capital lent to Uzaro)
- Repayment collection rates
- Default and delinquency metrics
- Interest revenue analysis (total and Financier's share)
- Revenue share breakdown per order

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
| 1.1 | 2026-02-11 | - | Added Financier role, fund flow, detailed order workflow, pricing with financier interest, revenue sharing model |
| 1.2 | 2026-02-11 | - | Clarified Financier lends Cost Price only (excludes Uzaro markup), updated settlement calculations |

---

*This document serves as the foundational business requirements for the EPP platform. Technical specifications and detailed user stories should be derived from these requirements.*