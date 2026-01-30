// =====================================================
// EPP FINANCER PORTAL - MOCK DATA
// UI/Display Only - No Backend, No Real Authentication
// =====================================================

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export type LoanApplication = {
	id: string;
	customerId: string;
	customerName: string;
	customerEmail: string;
	customerType: "employee" | "retailer" | "wholesaler" | "regular";
	productId: string;
	productName: string;
	productImage?: string;
	requestedAmount: number;
	interestRate: number;
	requestedTerm: number; // months
	monthlyPayment: number;
	status: "pending" | "under_review" | "approved" | "rejected";
	appliedDate: string;
	reviewedDate?: string;
	creditScore?: number;
	notes?: string;
};

export type ActiveLoan = {
	id: string;
	applicationId: string;
	customerId: string;
	customerName: string;
	customerEmail: string;
	customerType: "employee" | "retailer" | "wholesaler" | "regular";
	productName: string;
	productImage?: string;
	principalAmount: number;
	interestRate: number;
	totalAmount: number;
	paidAmount: number;
	remainingAmount: number;
	monthlyPayment: number;
	term: number; // total months
	paidInstallments: number;
	remainingInstallments: number;
	status: "active" | "completed" | "defaulted" | "restructured";
	startDate: string;
	nextPaymentDate: string;
	lastPaymentDate?: string;
};

export type Payment = {
	id: string;
	loanId: string;
	customerId: string;
	customerName: string;
	amount: number;
	principalPortion: number;
	interestPortion: number;
	paymentDate: string;
	dueDate: string;
	status: "paid" | "pending" | "overdue" | "partial";
	paymentMethod?: string;
	transactionRef?: string;
};

export type FinancerCustomer = {
	id: string;
	name: string;
	email: string;
	phone: string;
	type: "employee" | "retailer" | "wholesaler" | "regular";
	organization?: string;
	activeLoans: number;
	totalBorrowed: number;
	totalPaid: number;
	creditScore: number;
	status: "active" | "inactive" | "blacklisted";
	joinedDate: string;
	avatar?: string;
};

export type FinancerStats = {
	totalPortfolio: number;
	activeLoans: number;
	pendingApplications: number;
	monthlyCollections: number;
	overdueAmount: number;
	defaultRate: number;
};

// =====================================================
// MOCK LOAN APPLICATIONS
// =====================================================

export const MOCK_LOAN_APPLICATIONS: LoanApplication[] = [
	{
		id: "APP-001",
		customerId: "CUST-001",
		customerName: "Maria Santos",
		customerEmail: "maria.santos@company.com",
		customerType: "employee",
		productId: "PROD-001",
		productName: 'MacBook Pro M3 14"',
		productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
		requestedAmount: 2499.00,
		interestRate: 12,
		requestedTerm: 12,
		monthlyPayment: 221.91,
		status: "pending",
		appliedDate: "2024-06-15",
		creditScore: 720,
	},
	{
		id: "APP-002",
		customerId: "CUST-002",
		customerName: "John Reyes",
		customerEmail: "john.reyes@retailshop.com",
		customerType: "retailer",
		productId: "PROD-003",
		productName: "iPhone 15 Pro 256GB",
		productImage: "https://images.unsplash.com/photo-1696426718956-8219488a0715?q=80&w=1000&auto=format&fit=crop",
		requestedAmount: 1199.00,
		interestRate: 15,
		requestedTerm: 6,
		monthlyPayment: 207.48,
		status: "under_review",
		appliedDate: "2024-06-14",
		creditScore: 680,
		notes: "Existing customer with good payment history",
	},
	{
		id: "APP-003",
		customerId: "CUST-003",
		customerName: "Elena Cruz",
		customerEmail: "elena.c@wholesale.ph",
		customerType: "wholesaler",
		productId: "PROD-007",
		productName: 'iPad Pro 12.9" M2',
		productImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop",
		requestedAmount: 1299.00,
		interestRate: 10,
		requestedTerm: 12,
		monthlyPayment: 114.32,
		status: "approved",
		appliedDate: "2024-06-10",
		reviewedDate: "2024-06-12",
		creditScore: 780,
	},
	{
		id: "APP-004",
		customerId: "CUST-004",
		customerName: "Miguel Torres",
		customerEmail: "miguel.t@email.com",
		customerType: "regular",
		productId: "PROD-002",
		productName: "Ergonomic Office Chair",
		productImage: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
		requestedAmount: 599.00,
		interestRate: 18,
		requestedTerm: 6,
		monthlyPayment: 108.15,
		status: "rejected",
		appliedDate: "2024-06-08",
		reviewedDate: "2024-06-09",
		creditScore: 520,
		notes: "Low credit score, previous default history",
	},
	{
		id: "APP-005",
		customerId: "CUST-005",
		customerName: "Ana Dela Rosa",
		customerEmail: "ana.delarosa@corp.com",
		customerType: "employee",
		productId: "PROD-006",
		productName: 'Dell UltraSharp 32" 4K Monitor',
		productImage: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop",
		requestedAmount: 899.00,
		interestRate: 12,
		requestedTerm: 6,
		monthlyPayment: 155.59,
		status: "pending",
		appliedDate: "2024-06-16",
		creditScore: 750,
	},
];

// =====================================================
// MOCK ACTIVE LOANS
// =====================================================

export const MOCK_ACTIVE_LOANS: ActiveLoan[] = [
	{
		id: "LOAN-001",
		applicationId: "APP-010",
		customerId: "CUST-006",
		customerName: "Roberto Garcia",
		customerEmail: "roberto.g@techfirm.com",
		customerType: "employee",
		productName: 'MacBook Pro M3 14"',
		productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
		principalAmount: 2499.00,
		interestRate: 12,
		totalAmount: 2798.88,
		paidAmount: 1399.44,
		remainingAmount: 1399.44,
		monthlyPayment: 233.24,
		term: 12,
		paidInstallments: 6,
		remainingInstallments: 6,
		status: "active",
		startDate: "2024-01-15",
		nextPaymentDate: "2024-07-15",
		lastPaymentDate: "2024-06-15",
	},
	{
		id: "LOAN-002",
		applicationId: "APP-011",
		customerId: "CUST-007",
		customerName: "Patricia Lim",
		customerEmail: "patricia.lim@retail.com",
		customerType: "retailer",
		productName: "iPhone 15 Pro 256GB",
		productImage: "https://images.unsplash.com/photo-1696426718956-8219488a0715?q=80&w=1000&auto=format&fit=crop",
		principalAmount: 1199.00,
		interestRate: 15,
		totalAmount: 1378.85,
		paidAmount: 459.62,
		remainingAmount: 919.23,
		monthlyPayment: 229.81,
		term: 6,
		paidInstallments: 2,
		remainingInstallments: 4,
		status: "active",
		startDate: "2024-05-01",
		nextPaymentDate: "2024-07-01",
		lastPaymentDate: "2024-06-01",
	},
	{
		id: "LOAN-003",
		applicationId: "APP-012",
		customerId: "CUST-008",
		customerName: "Carlos Mendoza",
		customerEmail: "carlos.m@wholesale.ph",
		customerType: "wholesaler",
		productName: "Standing Desk Pro",
		productImage: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=1000&auto=format&fit=crop",
		principalAmount: 799.00,
		interestRate: 10,
		totalAmount: 838.95,
		paidAmount: 838.95,
		remainingAmount: 0,
		monthlyPayment: 139.83,
		term: 6,
		paidInstallments: 6,
		remainingInstallments: 0,
		status: "completed",
		startDate: "2024-01-01",
		nextPaymentDate: "",
		lastPaymentDate: "2024-06-01",
	},
	{
		id: "LOAN-004",
		applicationId: "APP-013",
		customerId: "CUST-009",
		customerName: "Lisa Tan",
		customerEmail: "lisa.tan@email.com",
		customerType: "regular",
		productName: "Sony WH-1000XM5 Headphones",
		productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
		principalAmount: 349.00,
		interestRate: 18,
		totalAmount: 380.41,
		paidAmount: 126.80,
		remainingAmount: 253.61,
		monthlyPayment: 126.80,
		term: 3,
		paidInstallments: 1,
		remainingInstallments: 2,
		status: "active",
		startDate: "2024-06-01",
		nextPaymentDate: "2024-07-01",
		lastPaymentDate: "2024-06-01",
	},
	{
		id: "LOAN-005",
		applicationId: "APP-014",
		customerId: "CUST-010",
		customerName: "David Villanueva",
		customerEmail: "david.v@company.com",
		customerType: "employee",
		productName: 'iPad Pro 12.9" M2',
		productImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop",
		principalAmount: 1299.00,
		interestRate: 12,
		totalAmount: 1454.88,
		paidAmount: 0,
		remainingAmount: 1454.88,
		monthlyPayment: 121.24,
		term: 12,
		paidInstallments: 0,
		remainingInstallments: 12,
		status: "defaulted",
		startDate: "2024-04-01",
		nextPaymentDate: "2024-04-01",
		lastPaymentDate: "",
	},
];

// =====================================================
// MOCK PAYMENTS
// =====================================================

export const MOCK_PAYMENTS: Payment[] = [
	{
		id: "PAY-001",
		loanId: "LOAN-001",
		customerId: "CUST-006",
		customerName: "Roberto Garcia",
		amount: 233.24,
		principalPortion: 208.25,
		interestPortion: 24.99,
		paymentDate: "2024-06-15",
		dueDate: "2024-06-15",
		status: "paid",
		paymentMethod: "Bank Transfer",
		transactionRef: "TXN-2024061501",
	},
	{
		id: "PAY-002",
		loanId: "LOAN-002",
		customerId: "CUST-007",
		customerName: "Patricia Lim",
		amount: 229.81,
		principalPortion: 199.83,
		interestPortion: 29.98,
		paymentDate: "2024-06-01",
		dueDate: "2024-06-01",
		status: "paid",
		paymentMethod: "GCash",
		transactionRef: "TXN-2024060101",
	},
	{
		id: "PAY-003",
		loanId: "LOAN-004",
		customerId: "CUST-009",
		customerName: "Lisa Tan",
		amount: 126.80,
		principalPortion: 116.33,
		interestPortion: 10.47,
		paymentDate: "2024-06-05",
		dueDate: "2024-06-01",
		status: "paid",
		paymentMethod: "Credit Card",
		transactionRef: "TXN-2024060502",
	},
	{
		id: "PAY-004",
		loanId: "LOAN-005",
		customerId: "CUST-010",
		customerName: "David Villanueva",
		amount: 121.24,
		principalPortion: 108.25,
		interestPortion: 12.99,
		paymentDate: "",
		dueDate: "2024-04-01",
		status: "overdue",
	},
	{
		id: "PAY-005",
		loanId: "LOAN-005",
		customerId: "CUST-010",
		customerName: "David Villanueva",
		amount: 121.24,
		principalPortion: 108.25,
		interestPortion: 12.99,
		paymentDate: "",
		dueDate: "2024-05-01",
		status: "overdue",
	},
	{
		id: "PAY-006",
		loanId: "LOAN-005",
		customerId: "CUST-010",
		customerName: "David Villanueva",
		amount: 121.24,
		principalPortion: 108.25,
		interestPortion: 12.99,
		paymentDate: "",
		dueDate: "2024-06-01",
		status: "overdue",
	},
	{
		id: "PAY-007",
		loanId: "LOAN-001",
		customerId: "CUST-006",
		customerName: "Roberto Garcia",
		amount: 233.24,
		principalPortion: 208.25,
		interestPortion: 24.99,
		paymentDate: "",
		dueDate: "2024-07-15",
		status: "pending",
	},
	{
		id: "PAY-008",
		loanId: "LOAN-002",
		customerId: "CUST-007",
		customerName: "Patricia Lim",
		amount: 229.81,
		principalPortion: 199.83,
		interestPortion: 29.98,
		paymentDate: "",
		dueDate: "2024-07-01",
		status: "pending",
	},
];

// =====================================================
// MOCK CUSTOMERS
// =====================================================

export const MOCK_FINANCER_CUSTOMERS: FinancerCustomer[] = [
	{
		id: "CUST-006",
		name: "Roberto Garcia",
		email: "roberto.g@techfirm.com",
		phone: "+63 917 123 4567",
		type: "employee",
		organization: "TechFirm Inc.",
		activeLoans: 1,
		totalBorrowed: 2499.00,
		totalPaid: 1399.44,
		creditScore: 740,
		status: "active",
		joinedDate: "2024-01-10",
		avatar: "https://ui-avatars.com/api/?name=Roberto+Garcia&background=10b981&color=fff",
	},
	{
		id: "CUST-007",
		name: "Patricia Lim",
		email: "patricia.lim@retail.com",
		phone: "+63 918 234 5678",
		type: "retailer",
		organization: "Lim's Electronics",
		activeLoans: 1,
		totalBorrowed: 3500.00,
		totalPaid: 2100.00,
		creditScore: 695,
		status: "active",
		joinedDate: "2023-11-20",
		avatar: "https://ui-avatars.com/api/?name=Patricia+Lim&background=8b5cf6&color=fff",
	},
	{
		id: "CUST-008",
		name: "Carlos Mendoza",
		email: "carlos.m@wholesale.ph",
		phone: "+63 919 345 6789",
		type: "wholesaler",
		organization: "Mendoza Trading",
		activeLoans: 0,
		totalBorrowed: 5200.00,
		totalPaid: 5200.00,
		creditScore: 810,
		status: "active",
		joinedDate: "2023-06-15",
		avatar: "https://ui-avatars.com/api/?name=Carlos+Mendoza&background=0284c7&color=fff",
	},
	{
		id: "CUST-009",
		name: "Lisa Tan",
		email: "lisa.tan@email.com",
		phone: "+63 920 456 7890",
		type: "regular",
		activeLoans: 1,
		totalBorrowed: 349.00,
		totalPaid: 126.80,
		creditScore: 650,
		status: "active",
		joinedDate: "2024-05-25",
		avatar: "https://ui-avatars.com/api/?name=Lisa+Tan&background=ec4899&color=fff",
	},
	{
		id: "CUST-010",
		name: "David Villanueva",
		email: "david.v@company.com",
		phone: "+63 921 567 8901",
		type: "employee",
		organization: "Global Corp",
		activeLoans: 1,
		totalBorrowed: 1299.00,
		totalPaid: 0,
		creditScore: 480,
		status: "blacklisted",
		joinedDate: "2024-03-20",
		avatar: "https://ui-avatars.com/api/?name=David+Villanueva&background=ef4444&color=fff",
	},
];

// =====================================================
// MOCK FINANCER STATS
// =====================================================

export const MOCK_FINANCER_STATS: FinancerStats = {
	totalPortfolio: 245000,
	activeLoans: 47,
	pendingApplications: 5,
	monthlyCollections: 32500,
	overdueAmount: 8750,
	defaultRate: 2.3,
};

// =====================================================
// CUSTOMER TYPES
// =====================================================

export const CUSTOMER_TYPES = ["employee", "retailer", "wholesaler", "regular"] as const;

// =====================================================
// LOAN TERMS
// =====================================================

export const LOAN_TERMS = [3, 6, 12, 18, 24] as const;

// =====================================================
// INTEREST RATES BY CUSTOMER TYPE
// =====================================================

export const INTEREST_RATES = {
	employee: 12,
	retailer: 15,
	wholesaler: 10,
	regular: 18,
} as const;
