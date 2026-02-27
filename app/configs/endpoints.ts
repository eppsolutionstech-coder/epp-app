export const API_ENDPOINTS = {
	AUTH_URL: import.meta.env.VITE_AUTH_URL || "http://localhost:3001/api",
	BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3001/api",

	// Auth API endpoints
	AUTH: {
		LOGIN: "/auth/login",
		LOGOUT: "/auth/logout",
		REGISTER: "/auth/register",
		ME: "/auth/me",
	},

	// User API endpoints
	USER: {
		GET_ALL: "/user",
		GET_BY_ID: "/user/:id",
		GET_CURRENT: "/user/me",
		CREATE: "/user",
		UPDATE: "/user/:id",
		DELETE: "/user/:id", // Soft delete
	},

	SUPPLIER: {
		GET_ALL: "/supplier",
		GET_BY_ID: "/supplier/:id",
		CREATE: "/supplier",
		UPDATE: "/supplier/:id",
		DELETE: "/supplier/:id", // Soft delete
	},

	ITEM: {
		GET_ALL: "/items",
		GET_BY_ID: "/items/:id",
		CREATE: "/items",
		UPDATE: "/items/:id",
		DELETE: "/items/:id", // Soft delete
	},

	CATEGORY: {
		GET_ALL: "/category",
		GET_BY_ID: "/category/:id",
		CREATE: "/category",
		UPDATE: "/category/:id",
		DELETE: "/category/:id", // Soft delete
	},

	CART_ITEM: {
		GET_ALL: "/cartItem",
		GET_BY_ID: "/cartItem/:id",
		CREATE: "/cartItem",
		UPDATE: "/cartItem/:id",
		DELETE: "/cartItem/:id", // Soft delete
		CHECKOUT: "/cartItem/checkout",
	},

	ORDER: {
		GET_ALL: "/order",
		GET_BY_ID: "/order/:id",
		CREATE: "/order",
		UPDATE: "/order/:id",
		DELETE: "/order/:id", // Soft delete
	},

	TRANSACTION: {
		GET_ALL: "/transaction",
		GET_BY_ID: "/transaction/:id",
		CREATE: "/transaction",
		UPDATE: "/transaction/:id",
		DELETE: "/transaction/:id",
	},

	ORGANIZATION: {
		GET_ALL: "/organization",
		GET_BY_ID: "/organization/:id",
		CREATE: "/organization",
		UPDATE: "/organization/:id",
		DELETE: "/organization/:id", // Soft delete
	},

	APPROVAL_WORKFLOW: {
		GET_ALL: "/approvalWorkflow",
		GET_BY_ID: "/approvalWorkflow/:id",
		CREATE: "/approvalWorkflow",
		UPDATE: "/approvalWorkflow/:id",
		DELETE: "/approvalWorkflow/:id", // Soft delete
	},

	APPROVAL_TYPE: {
		GET_ALL: "/approvalType",
		GET_BY_ID: "/approvalType/:id",
		CREATE: "/approvalType",
		UPDATE: "/approvalType/:id",
		DELETE: "/approvalType/:id", // Soft delete
	},

	WORKFLOW_APPROVAL_TYPE: {
		GET_ALL: "/workflowapprovalLevel",
		GET_BY_ID: "/workflowapprovalLevel/:id",
		CREATE: "/workflowapprovalLevel",
		UPDATE: "/workflowapprovalLevel/:id",
		DELETE: "/workflowapprovalLevel/:id", // Soft delete
	},

	FINANCIER_CONFIG: {
		GET_ALL: "/financierConfig",
		GET_BY_ID: "/financierConfig/:id",
		CREATE: "/financierConfig",
		UPDATE: "/financierConfig/:id",
		DELETE: "/financierConfig/:id", // Soft delete
	},

	ORDER_APPROVAL: {
		GET_ALL: "/orderApproval",
		GET_BY_ID: "/orderApproval/:id",
		CREATE: "/orderApproval",
		UPDATE: "/orderApproval/:id",
		DELETE: "/orderApproval/:id", // Soft delete
	},

	PURCHASE_ORDER: {
		GET_ALL: "/purchaseOrder",
		GET_BY_ID: "/purchaseOrder/:id",
		CREATE: "/purchaseOrder",
		UPDATE: "/purchaseOrder/:id",
		DELETE: "/purchaseOrder/:id", // Soft delete
	},

	INSTALLMENT: {
		GET_ALL: "/installment",
		GET_BY_ID: "/installment/:id",
		CREATE: "/installment",
		UPDATE: "/installment/:id",
		DELETE: "/installment/:id", // Soft delete
		GET_LEDGER: "/installment/ledger/:employeeId/order/:orderId",
		GET_SUMMARY_ORDER: "/installment/order/:orderId/summary",
		PAY_INSTALLMENT: "/installment/:id/deduct",
	},

	FINANCIER_DISBURSEMENT: {
		GET_ALL: "/financier-disbursement",
		GET_BY_ID: "/financier-disbursement/:id",
		CREATE: "/financier-disbursement",
		UPDATE: "/financier-disbursement/:id",
		DELETE: "/financier-disbursement/:id", // Hard delete in API
		GET_LEDGER: "/ledger/:role/:financierConfigId",
		// RECONCILE: "/financier-disbursement/:id/reconcile",
		// CREATE_REMITTANCE: "/financier-disbursement/:id/remittance",
		// GET_REMITTANCES: "/financier-disbursement/:id/remittances",
		// GET_LEDGER: "/financier-disbursement/ledger/:financierConfigId",
		// GET_ADMIN_SOA: "/financier-disbursement/ledger/admin",
		// GET_ADMIN_SOA_BY_ID: "/financier-disbursement/ledger/admin/:financierConfigId",
		// GET_FINANCIER_SOA: "/financier-disbursement/ledger/financier/:financierConfigId",
	},

	DELIVERY_DOCUMENT: {
		GET_ALL: "/deliveryDocument",
		GET_BY_ID: "/deliveryDocument/:id",
		CREATE: "/deliveryDocument",
		CREATE_DO_TO_ADMIN: "/deliveryDocument/:purchaseOrderId/dispatch",
		UPDATE: "/deliveryDocument/:id",
		DELETE: "/deliveryDocument/:id",
		RECEIVE: "/deliveryDocument/:id/receive",
	},

};
