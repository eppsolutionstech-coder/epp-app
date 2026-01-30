import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

// Employee routes
const authRoutes: RouteConfig = [route("/login", "routes/auth/login.tsx")];

const employeeRoutes: RouteConfig = [
	index("routes/employee/landing.tsx"),
	route("catalog", "routes/employee/catalog.tsx"),
	route("product/:id", "routes/employee/product.$id.tsx"),
	route("cart", "routes/employee/cart.tsx"),
	route("checkout", "routes/employee/checkout.tsx"),
	route("profile/:tab?", "routes/employee/profile.tsx"),
	route("orders/:id", "routes/employee/orders.$id.tsx"),
	route("loans", "routes/employee/loans.tsx"),
];

// Vendor routes
const vendorRoutes: RouteConfig = [
	index("routes/vendor/index.tsx"),
	route("dashboard", "routes/vendor/dashboard.tsx"),
	route("products", "routes/vendor/products.tsx"),
	route("products/:id", "routes/vendor/product.$id.tsx"),
	route("categories", "routes/vendor/categories.tsx"),
	route("orders", "routes/vendor/orders.tsx"),
	route("orders/:id", "routes/vendor/orders.$id.tsx"),
	route("profile/:tab?", "routes/vendor/profile.tsx"),
];

// Admin routes
const adminRoutes: RouteConfig = [
	index("routes/admin/index.tsx"),
	route("dashboard", "routes/admin/dashboard.tsx"),

	route("orders", "routes/admin/orders.tsx"),
	route("orders/:id", "routes/admin/orders.$id.tsx"),
	route("employees", "routes/admin/employees.tsx"),
	route("products", "routes/admin/products.tsx"),
	route("products/:id", "routes/admin/product.$id.tsx"),
	route("organizations", "routes/admin/organizations.tsx"),
	route("organization/:id", "routes/admin/organization.$id.tsx", [
		index("routes/admin/organization.$id._index.tsx"),
		route("users", "routes/admin/organization.$id.users.tsx"),
		route("products", "routes/admin/organization.$id.products.tsx"),
		route("approvals", "routes/admin/organization.$id.approvals.tsx"),
		route("settings", "routes/admin/organization.$id.settings.tsx"),
	]),
	route("vendors", "routes/admin/vendors.tsx"),
	route("reports", "routes/admin/reports.tsx"),
];

// Financer routes
const financerRoutes: RouteConfig = [
	index("routes/financer/index.tsx"),
	route("dashboard", "routes/financer/dashboard.tsx"),
	route("applications", "routes/financer/applications.tsx"),
	route("applications/:id", "routes/financer/applications.$id.tsx"),
	route("loans", "routes/financer/loans.tsx"),
	route("loans/:id", "routes/financer/loans.$id.tsx"),
	route("payments", "routes/financer/payments.tsx"),
	route("customers", "routes/financer/customers.tsx"),
	route("reports", "routes/financer/reports.tsx"),
	route("profile/:tab?", "routes/financer/profile.tsx"),
];

// Main routes
export default [
	index("routes/landing.tsx"),
	layout("layouts/auth-layout.tsx", authRoutes),
	layout("layouts/employee-layout.tsx", prefix("employee", employeeRoutes)),
	layout("layouts/vendor-layout.tsx", prefix("vendor", vendorRoutes)),
	layout("layouts/admin-layout.tsx", prefix("admin", adminRoutes)),
	layout("layouts/financer-layout.tsx", prefix("financer", financerRoutes)),
] satisfies RouteConfig;
