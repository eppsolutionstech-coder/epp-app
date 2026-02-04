// =====================================================
// EPP MICROAPP - MOCK DATA
// UI/Display Only - No Backend, No Real Authentication
// =====================================================

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export type Employee = {
	id: string;
	name: string;
	email: string;
	department: string;
	status: "active" | "inactive" | "on_leave";
	creditLimit: number;
	usedAmount: number;
	joinDate: string;
	avatar?: string;
};

export type PurchaseRequest = {
	id: string;
	employeeId: string;
	employeeName: string;
	productName: string;
	amount: number;
	status: "pending" | "approved" | "rejected";
	date: string;
	installments: number;
};

export type DashboardStats = {
	totalOutstanding: number;
	activeUsers: number;
	monthlyVolume: number;
	pendingApprovals: number;
};

export type Product = {
	id: string;
	name: string;
	description: string;
	category: string;
	price: number;
	supplier: string;
	supplierId: string;
	status: "active" | "draft" | "pending" | "archived";
	stock: number;
	image?: string;
	installmentOptions: number[]; // e.g., [3, 6, 12] months
	specifications?: Record<string, string>;
};

export type supplier = {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	productsCount: number;
	status: "active" | "inactive" | "pending";
	joinedDate: string;
	logo?: string;
	description?: string;
};

export type Order = {
	id: string;
	productId: string;
	productName: string;
	productImage?: string;
	employeeId: string;
	employeeName: string;
	employeeEmail: string;
	supplierId: string;
	supplierName: string;
	amount: number;
	installments: number;
	monthlyPayment: number;
	status: "pending" | "approved" | "processing" | "shipped" | "delivered" | "cancelled";
	orderDate: string;
	deliveryDate?: string;
};

export type EmployeePurchase = {
	id: string;
	orderId: string;
	productName: string;
	productImage?: string;
	supplierName: string;
	totalAmount: number;
	paidAmount: number;
	remainingAmount: number;
	monthlyPayment: number;
	installmentsPaid: number;
	totalInstallments: number;
	status: "active" | "completed" | "cancelled";
	startDate: string;
	nextPaymentDate: string;
};

// =====================================================
// MOCK EMPLOYEES
// =====================================================

export const MOCK_EMPLOYEES: Employee[] = [
	{
		id: "EMP-001",
		name: "Alice Johnson",
		email: "alice.j@techcorp.com",
		department: "Engineering",
		status: "active",
		creditLimit: 5000,
		usedAmount: 1200,
		joinDate: "2023-01-15",
		avatar: "https://ui-avatars.com/api/?name=Alice+Johnson&background=6366f1&color=fff",
	},
	{
		id: "EMP-002",
		name: "Bob Smith",
		email: "bob.s@techcorp.com",
		department: "Marketing",
		status: "active",
		creditLimit: 3000,
		usedAmount: 2800,
		joinDate: "2023-03-10",
		avatar: "https://ui-avatars.com/api/?name=Bob+Smith&background=8b5cf6&color=fff",
	},
	{
		id: "EMP-003",
		name: "Charlie Brown",
		email: "charlie.b@techcorp.com",
		department: "Sales",
		status: "on_leave",
		creditLimit: 4000,
		usedAmount: 0,
		joinDate: "2022-11-05",
		avatar: "https://ui-avatars.com/api/?name=Charlie+Brown&background=ec4899&color=fff",
	},
	{
		id: "EMP-004",
		name: "Diana Prince",
		email: "diana.p@techcorp.com",
		department: "Engineering",
		status: "active",
		creditLimit: 6000,
		usedAmount: 4500,
		joinDate: "2021-06-20",
		avatar: "https://ui-avatars.com/api/?name=Diana+Prince&background=14b8a6&color=fff",
	},
	{
		id: "EMP-005",
		name: "Evan Wright",
		email: "evan.w@techcorp.com",
		department: "HR",
		status: "inactive",
		creditLimit: 2000,
		usedAmount: 500,
		joinDate: "2024-01-02",
		avatar: "https://ui-avatars.com/api/?name=Evan+Wright&background=f59e0b&color=fff",
	},
];

// =====================================================
// MOCK suppliers
// =====================================================

export const MOCK_suppliers: supplier[] = [
	{
		id: "VND-001",
		name: "TechWorld Electronics",
		email: "contact@techworld.com",
		phone: "+1 (555) 123-4567",
		address: "123 Tech Blvd, Silicon Valley, CA 94025",
		productsCount: 45,
		status: "active",
		joinedDate: "2023-01-15",
		logo: "https://ui-avatars.com/api/?name=TechWorld+Electronics&background=0284c7&color=fff",
		description: "Leading distributor of consumer electronics and computing equipment.",
	},
	{
		id: "VND-002",
		name: "Office Essentials Co.",
		email: "sales@officeessentials.com",
		phone: "+1 (555) 987-6543",
		address: "456 Business Park Dr, Austin, TX 78758",
		productsCount: 120,
		status: "active",
		joinedDate: "2023-03-20",
		logo: "https://ui-avatars.com/api/?name=Office+Essentials&background=d97706&color=fff",
		description:
			"Everything you need for a productive workspace, from furniture to stationery.",
	},
	{
		id: "VND-003",
		name: "Gadget Hub",
		email: "partners@gadgethub.io",
		phone: "+1 (555) 456-7890",
		address: "789 Innovation Way, Seattle, WA 98109",
		productsCount: 85,
		status: "active",
		joinedDate: "2023-05-10",
		logo: "https://ui-avatars.com/api/?name=Gadget+Hub&background=7c3aed&color=fff",
		description: "Curated selection of the latest gadgets and accessories.",
	},
	{
		id: "VND-004",
		name: "Premium Furnishings",
		email: "hello@premiumfurnishings.com",
		phone: "+1 (555) 222-3333",
		address: "321 Design Ave, New York, NY 10013",
		productsCount: 15,
		status: "pending",
		joinedDate: "2024-06-01",
		logo: "https://ui-avatars.com/api/?name=Premium+Furnishings&background=db2777&color=fff",
		description: "High-end furniture for the discerning professional.",
	},
];

// =====================================================
// MOCK PRODUCTS (Expanded)
// =====================================================

export const MOCK_PRODUCTS: Product[] = [
	{
		id: "PROD-001",
		name: 'MacBook Pro M3 14"',
		description:
			"Apple MacBook Pro with M3 chip, 14-inch Liquid Retina XDR display, 18GB unified memory, 512GB SSD. Perfect for professionals who need power and portability.",
		category: "Electronics",
		price: 2499.0,
		supplier: "TechWorld Electronics",
		supplierId: "VND-001",
		status: "active",
		stock: 45,
		image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [3, 6, 12, 24],
		specifications: {
			Processor: "Apple M3 Pro",
			Memory: "18GB Unified",
			Storage: "512GB SSD",
			Display: '14" Liquid Retina XDR',
		},
	},
	{
		id: "PROD-002",
		name: "Ergonomic Office Chair",
		description:
			"Premium ergonomic mesh office chair with lumbar support, adjustable armrests, headrest, and 4D adjustable design for all-day comfort.",
		category: "Furniture",
		price: 599.0,
		supplier: "Office Essentials Co.",
		supplierId: "VND-002",
		status: "active",
		stock: 12,
		image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [3, 6, 12],
		specifications: {
			Material: "Breathable Mesh",
			"Max Weight": "300 lbs",
			Adjustable: "Yes - 4D",
			Warranty: "5 Years",
		},
	},
	{
		id: "PROD-003",
		name: "iPhone 15 Pro 256GB",
		description:
			"Apple iPhone 15 Pro with A17 Pro chip, 48MP camera system, titanium design, and Action button. The most powerful iPhone ever.",
		category: "Electronics",
		price: 1199.0,
		supplier: "Gadget Hub",
		supplierId: "VND-003",
		status: "active",
		stock: 8,
		image: "https://images.unsplash.com/photo-1696426718956-8219488a0715?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [3, 6, 12],
		specifications: {
			Chip: "A17 Pro",
			Storage: "256GB",
			Camera: "48MP Main",
			Display: '6.1" Super Retina XDR',
		},
	},
	{
		id: "PROD-004",
		name: "Sony WH-1000XM5 Headphones",
		description:
			"Industry-leading noise canceling wireless headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours battery life.",
		category: "Electronics",
		price: 349.0,
		supplier: "TechWorld Electronics",
		supplierId: "VND-001",
		status: "active",
		stock: 25,
		image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [3, 6],
		specifications: {
			Type: "Over-ear",
			"Noise Canceling": "Yes",
			Battery: "30 hours",
			Bluetooth: "5.2",
		},
	},
	{
		id: "PROD-005",
		name: "Standing Desk Pro",
		description:
			"Electric height-adjustable standing desk with memory presets, cable management, and premium bamboo desktop. Transform your workspace.",
		category: "Furniture",
		price: 799.0,
		supplier: "Office Essentials Co.",
		supplierId: "VND-002",
		status: "active",
		stock: 18,
		image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [3, 6, 12],
		specifications: {
			"Height Range": '28" - 48"',
			"Desktop Size": '60" x 30"',
			Motor: "Dual Motor",
			Memory: "4 Presets",
		},
	},
	{
		id: "PROD-006",
		name: 'Dell UltraSharp 32" 4K Monitor',
		description:
			"Professional-grade 32-inch 4K monitor with USB-C hub, 100% sRGB, and HDR support. Perfect for creative professionals.",
		category: "Electronics",
		price: 899.0,
		supplier: "TechWorld Electronics",
		supplierId: "VND-001",
		status: "active",
		stock: 15,
		image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [3, 6, 12],
		specifications: {
			Resolution: "3840 x 2160",
			Panel: "IPS",
			Ports: "USB-C, HDMI, DP",
			HDR: "HDR400",
		},
	},
	{
		id: "PROD-007",
		name: 'iPad Pro 12.9" M2',
		description:
			"Apple iPad Pro with M2 chip, 12.9-inch Liquid Retina XDR display, and Apple Pencil hover. The ultimate iPad experience.",
		category: "Electronics",
		price: 1299.0,
		supplier: "Gadget Hub",
		supplierId: "VND-003",
		status: "active",
		stock: 10,
		image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [3, 6, 12, 24],
		specifications: {
			Chip: "Apple M2",
			Storage: "256GB",
			Display: '12.9" Liquid Retina XDR',
			Connectivity: "WiFi + Cellular",
		},
	},
	{
		id: "PROD-008",
		name: "Logitech MX Master 3S",
		description:
			"Advanced wireless mouse with ultra-fast scrolling, 8K DPI tracking, quiet clicks, and USB-C quick charging.",
		category: "Accessories",
		price: 99.0,
		supplier: "TechWorld Electronics",
		supplierId: "VND-001",
		status: "active",
		stock: 50,
		image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [3],
		specifications: {
			DPI: "8000",
			Battery: "70 days",
			Connectivity: "Bluetooth, USB",
			Buttons: "7",
		},
	},
	{
		id: "PROD-009",
		name: "Samsung Galaxy Watch 6",
		description:
			"Advanced health monitoring smartwatch with sleep tracking, body composition analysis, and sapphire crystal display.",
		category: "Wearables",
		price: 399.0,
		supplier: "Gadget Hub",
		supplierId: "VND-003",
		status: "active",
		stock: 20,
		image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [3, 6],
		specifications: {
			Display: '1.5" AMOLED',
			Battery: "40 hours",
			"Water Resistant": "5ATM",
			OS: "Wear OS",
		},
	},
	{
		id: "PROD-010",
		name: "Herman Miller Aeron Chair",
		description:
			"The iconic Aeron chair with PostureFit SL support, 8Z Pellicle suspension, and fully adjustable arms. The gold standard in ergonomic seating.",
		category: "Furniture",
		price: 1495.0,
		supplier: "Premium Furnishings",
		supplierId: "VND-004",
		status: "pending",
		stock: 5,
		image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=1000&auto=format&fit=crop",
		installmentOptions: [6, 12, 24],
		specifications: {
			Size: "B (Medium)",
			Material: "8Z Pellicle",
			Warranty: "12 Years",
			Adjustable: "Fully Adjustable",
		},
	},
];

// =====================================================
// MOCK ORDERS (For supplier & Employee views)
// =====================================================

export const MOCK_ORDERS: Order[] = [
	{
		id: "ORD-001",
		productId: "PROD-001",
		productName: 'MacBook Pro M3 14"',
		productImage:
			"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		employeeEmail: "alice.j@techcorp.com",
		supplierId: "VND-001",
		supplierName: "TechWorld Electronics",
		amount: 2499.0,
		installments: 12,
		monthlyPayment: 208.25,
		status: "delivered",
		orderDate: "2024-01-15",
		deliveryDate: "2024-01-22",
	},
	{
		id: "ORD-002",
		productId: "PROD-003",
		productName: "iPhone 15 Pro 256GB",
		productImage:
			"https://images.unsplash.com/photo-1696426718956-8219488a0715?q=80&w=1000&auto=format&fit=crop",
		employeeId: "EMP-002",
		employeeName: "Bob Smith",
		employeeEmail: "bob.s@techcorp.com",
		supplierId: "VND-003",
		supplierName: "Gadget Hub",
		amount: 1199.0,
		installments: 6,
		monthlyPayment: 199.83,
		status: "shipped",
		orderDate: "2024-06-10",
	},
	{
		id: "ORD-003",
		productId: "PROD-002",
		productName: "Ergonomic Office Chair",
		productImage:
			"https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
		employeeId: "EMP-004",
		employeeName: "Diana Prince",
		employeeEmail: "diana.p@techcorp.com",
		supplierId: "VND-002",
		supplierName: "Office Essentials Co.",
		amount: 599.0,
		installments: 6,
		monthlyPayment: 99.83,
		status: "processing",
		orderDate: "2024-06-12",
	},
	{
		id: "ORD-004",
		productId: "PROD-005",
		productName: "Standing Desk Pro",
		productImage:
			"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=1000&auto=format&fit=crop",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		employeeEmail: "alice.j@techcorp.com",
		supplierId: "VND-002",
		supplierName: "Office Essentials Co.",
		amount: 799.0,
		installments: 12,
		monthlyPayment: 66.58,
		status: "approved",
		orderDate: "2024-06-14",
	},
	{
		id: "ORD-005",
		productId: "PROD-004",
		productName: "Sony WH-1000XM5 Headphones",
		productImage:
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
		employeeId: "EMP-004",
		employeeName: "Diana Prince",
		employeeEmail: "diana.p@techcorp.com",
		supplierId: "VND-001",
		supplierName: "TechWorld Electronics",
		amount: 349.0,
		installments: 3,
		monthlyPayment: 116.33,
		status: "pending",
		orderDate: "2024-06-15",
	},
];

// =====================================================
// MOCK EMPLOYEE PURCHASES (For Employee Dashboard)
// =====================================================

export const MOCK_EMPLOYEE_PURCHASES: EmployeePurchase[] = [
	{
		id: "PUR-001",
		orderId: "ORD-001",
		productName: 'MacBook Pro M3 14"',
		productImage:
			"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
		supplierName: "TechWorld Electronics",
		totalAmount: 2499.0,
		paidAmount: 1249.5,
		remainingAmount: 1249.5,
		monthlyPayment: 208.25,
		installmentsPaid: 6,
		totalInstallments: 12,
		status: "active",
		startDate: "2024-01-15",
		nextPaymentDate: "2024-07-15",
	},
	{
		id: "PUR-002",
		orderId: "ORD-002",
		productName: "iPhone 15 Pro 256GB",
		productImage:
			"https://images.unsplash.com/photo-1696426718956-8219488a0715?q=80&w=1000&auto=format&fit=crop",
		supplierName: "Gadget Hub",
		totalAmount: 1199.0,
		paidAmount: 399.66,
		remainingAmount: 799.34,
		monthlyPayment: 199.83,
		installmentsPaid: 2,
		totalInstallments: 6,
		status: "active",
		startDate: "2024-06-10",
		nextPaymentDate: "2024-08-10",
	},
	{
		id: "PUR-003",
		orderId: "ORD-003",
		productName: "Ergonomic Office Chair",
		productImage:
			"https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
		supplierName: "Office Essentials Co.",
		totalAmount: 599.0,
		paidAmount: 599.0,
		remainingAmount: 0,
		monthlyPayment: 99.83,
		installmentsPaid: 6,
		totalInstallments: 6,
		status: "completed",
		startDate: "2023-12-01",
		nextPaymentDate: "",
	},
];

// =====================================================
// MOCK PURCHASE REQUESTS (For Admin Approvals)
// =====================================================

export const MOCK_REQUESTS: PurchaseRequest[] = [
	{
		id: "REQ-1001",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "Standing Desk Pro",
		amount: 799,
		status: "pending",
		date: "2024-06-14",
		installments: 12,
	},
	{
		id: "REQ-1002",
		employeeId: "EMP-002",
		employeeName: "Bob Smith",
		productName: 'Dell UltraSharp 32" Monitor',
		amount: 899,
		status: "pending",
		date: "2024-06-15",
		installments: 6,
	},
	{
		id: "REQ-1003",
		employeeId: "EMP-004",
		employeeName: "Diana Prince",
		productName: "Sony WH-1000XM5 Headphones",
		amount: 349,
		status: "pending",
		date: "2024-06-15",
		installments: 3,
	},
	{
		id: "REQ-1004",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "MacBook Pro M3",
		amount: 2499,
		status: "approved",
		date: "2024-01-10",
		installments: 12,
	},
	{
		id: "REQ-1005",
		employeeId: "EMP-002",
		employeeName: "Bob Smith",
		productName: "iPhone 15 Pro",
		amount: 1199,
		status: "approved",
		date: "2024-06-08",
		installments: 6,
	},
	{
		id: "REQ-1006",
		employeeId: "EMP-003",
		employeeName: "Charlie Brown",
		productName: 'iPad Pro 12.9"',
		amount: 1299,
		status: "rejected",
		date: "2024-05-20",
		installments: 12,
	},
];

// =====================================================
// MOCK DASHBOARD STATS
// =====================================================

export const MOCK_STATS: DashboardStats = {
	totalOutstanding: 125000,
	activeUsers: 142,
	monthlyVolume: 45000,
	pendingApprovals: 3,
};

// =====================================================
// PRODUCT CATEGORIES
// =====================================================

export const PRODUCT_CATEGORIES = ["Electronics", "Furniture", "Accessories", "Wearables"] as const;

// =====================================================
// PLATFORM ACTIVITY (For Admin Dashboard)
// =====================================================

export const MOCK_PLATFORM_ACTIVITY = [
	{
		id: "ACT-001",
		type: "order",
		message: "Alice Johnson placed an order for Standing Desk Pro",
		timestamp: "2024-06-14T10:30:00Z",
	},
	{
		id: "ACT-002",
		type: "supplier",
		message: "Premium Furnishings submitted for approval",
		timestamp: "2024-06-13T14:20:00Z",
	},
	{
		id: "ACT-003",
		type: "product",
		message: "TechWorld Electronics added 3 new products",
		timestamp: "2024-06-12T09:15:00Z",
	},
	{
		id: "ACT-004",
		type: "approval",
		message: "Bob Smith's request for iPhone 15 Pro was approved",
		timestamp: "2024-06-10T16:45:00Z",
	},
	{
		id: "ACT-005",
		type: "delivery",
		message: "Order ORD-001 was delivered to Alice Johnson",
		timestamp: "2024-01-22T11:00:00Z",
	},
];

// =====================================================
// MOCK ORGANIZATIONS
// =====================================================

