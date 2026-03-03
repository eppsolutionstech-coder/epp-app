import type { OrderStatus } from "~/zod/order.zod";

type TimelineDate = Date | string | null | undefined;

type OrderStatusMeta = {
	label: string;
	badgeClass: string;
	surfaceClass: string;
	message: string;
};

type TimelineStepTone = "default" | "danger" | "warning";

export type OrderTimelineStep = {
	key: string;
	title: string;
	description: string;
	date?: TimelineDate;
	isCompleted: boolean;
	isActive?: boolean;
	tone?: TimelineStepTone;
};

export type OrderTimelineInput = {
	status?: string | null;
	orderDate?: TimelineDate;
	approvedAt?: TimelineDate;
	rejectedAt?: TimelineDate;
	shippedDate?: TimelineDate;
	deliveredDate?: TimelineDate;
	cancelledDate?: TimelineDate;
	updatedAt?: TimelineDate;
};

const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
	PENDING_APPROVAL: {
		label: "Pending Approval",
		badgeClass: "bg-yellow-500 hover:bg-yellow-600",
		surfaceClass:
			"bg-yellow-50/50 border-yellow-200 dark:border-yellow-900/30 dark:bg-yellow-900/10",
		message: "This order is waiting for approval.",
	},
	APPROVED: {
		label: "Approved",
		badgeClass: "bg-emerald-500 hover:bg-emerald-600",
		surfaceClass:
			"bg-emerald-50/50 border-emerald-200 dark:border-emerald-900/30 dark:bg-emerald-900/10",
		message: "This order has been approved and can proceed to fulfillment.",
	},
	REJECTED: {
		label: "Rejected",
		badgeClass: "bg-rose-500 hover:bg-rose-600",
		surfaceClass:
			"bg-rose-50/50 border-rose-200 dark:border-rose-900/30 dark:bg-rose-900/10",
		message: "This order was rejected during approval.",
	},
	PROCESSING: {
		label: "Processing",
		badgeClass: "bg-purple-500 hover:bg-purple-600",
		surfaceClass:
			"bg-purple-50/50 border-purple-200 dark:border-purple-900/30 dark:bg-purple-900/10",
		message: "The items are currently being prepared.",
	},
	SHIPPED: {
		label: "Shipped",
		badgeClass: "bg-indigo-500 hover:bg-indigo-600",
		surfaceClass:
			"bg-indigo-50/50 border-indigo-200 dark:border-indigo-900/30 dark:bg-indigo-900/10",
		message: "The package is in transit.",
	},
	DELIVERED: {
		label: "Delivered",
		badgeClass: "bg-green-500 hover:bg-green-600",
		surfaceClass:
			"bg-green-50/50 border-green-200 dark:border-green-900/30 dark:bg-green-900/10",
		message: "The package was delivered successfully.",
	},
	CANCELLED: {
		label: "Cancelled",
		badgeClass: "bg-red-500 hover:bg-red-600",
		surfaceClass:
			"bg-red-50/50 border-red-200 dark:border-red-900/30 dark:bg-red-900/10",
		message: "This order was cancelled and is no longer active.",
	},
	RETURNED: {
		label: "Returned",
		badgeClass: "bg-orange-500 hover:bg-orange-600",
		surfaceClass:
			"bg-orange-50/50 border-orange-200 dark:border-orange-900/30 dark:bg-orange-900/10",
		message: "The order was delivered and later returned.",
	},
};

const UNKNOWN_STATUS_META: OrderStatusMeta = {
	label: "Unknown Status",
	badgeClass: "bg-gray-500 hover:bg-gray-600",
	surfaceClass: "bg-muted/50 border-border",
	message: "Status information is unavailable.",
};

const isKnownOrderStatus = (status?: string | null): status is OrderStatus =>
	!!status && status in ORDER_STATUS_META;

const getOrderStatusMeta = (status?: string | null): OrderStatusMeta => {
	if (!isKnownOrderStatus(status)) {
		return UNKNOWN_STATUS_META;
	}
	return ORDER_STATUS_META[status];
};

export const getOrderStatusLabel = (status?: string | null) => getOrderStatusMeta(status).label;

export const getOrderStatusBadgeClass = (status?: string | null) =>
	getOrderStatusMeta(status).badgeClass;

export const getOrderStatusSurfaceClass = (status?: string | null) =>
	getOrderStatusMeta(status).surfaceClass;

export const getOrderStatusMessage = (status?: string | null) =>
	getOrderStatusMeta(status).message;

export const getOrderTimelineSteps = (order: OrderTimelineInput): OrderTimelineStep[] => {
	const status = order.status;
	const isRejected = status === "REJECTED";
	const isCancelled = status === "CANCELLED";
	const isReturned = status === "RETURNED";

	const approvedCompletedByStatus =
		status === "APPROVED" ||
		status === "PROCESSING" ||
		status === "SHIPPED" ||
		status === "DELIVERED" ||
		status === "RETURNED";

	const processingCompletedByStatus =
		status === "PROCESSING" ||
		status === "SHIPPED" ||
		status === "DELIVERED" ||
		status === "RETURNED";

	const shippedCompletedByStatus =
		status === "SHIPPED" || status === "DELIVERED" || status === "RETURNED";

	const deliveredCompletedByStatus = status === "DELIVERED" || status === "RETURNED";

	const approvedCompleted =
		approvedCompletedByStatus || (isCancelled && !!order.approvedAt);
	const processingCompleted =
		processingCompletedByStatus ||
		(isCancelled && (!!order.shippedDate || !!order.deliveredDate));
	const shippedCompleted =
		shippedCompletedByStatus ||
		(isCancelled && (!!order.shippedDate || !!order.deliveredDate));
	const deliveredCompleted = deliveredCompletedByStatus || (isCancelled && !!order.deliveredDate);

	const steps: OrderTimelineStep[] = [
		{
			key: "placed",
			title: "Order Placed",
			date: order.orderDate,
			description: "Customer placed the order.",
			isCompleted: true,
		},
		{
			key: "approved",
			title: "Verified & Approved",
			date: order.approvedAt,
			description: "Order approved by supplier.",
			isCompleted: approvedCompleted,
			isActive: status === "PENDING_APPROVAL",
		},
		{
			key: "processing",
			title: "Processing",
			description: "Items are being packed.",
			isCompleted: processingCompleted,
			isActive: status === "APPROVED",
		},
		{
			key: "shipped",
			title: "Shipped",
			date: order.shippedDate,
			description: "Package is on its way.",
			isCompleted: shippedCompleted,
			isActive: status === "PROCESSING",
		},
		{
			key: "delivered",
			title: "Delivered",
			date: order.deliveredDate,
			description: "Package received by customer.",
			isCompleted: deliveredCompleted,
			isActive: status === "SHIPPED",
		},
	];

	if (isRejected) {
		steps.push({
			key: "rejected",
			title: "Rejected",
			date: order.rejectedAt ?? order.updatedAt,
			description: "The order did not pass approval.",
			isCompleted: true,
			isActive: true,
			tone: "danger",
		});
	}

	if (isCancelled) {
		steps.push({
			key: "cancelled",
			title: "Cancelled",
			date: order.cancelledDate ?? order.updatedAt,
			description: "The order was cancelled before completion.",
			isCompleted: true,
			isActive: true,
			tone: "danger",
		});
	}

	if (isReturned) {
		steps.push({
			key: "returned",
			title: "Returned",
			date: order.updatedAt,
			description: "The delivered order was returned.",
			isCompleted: true,
			isActive: true,
			tone: "warning",
		});
	}

	return steps;
};
