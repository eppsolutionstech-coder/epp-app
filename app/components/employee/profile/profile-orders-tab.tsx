import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGetOrders } from "~/hooks/use-order";
import { useAuth } from "~/hooks/use-auth";
import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { ProfileOrdersEmpty } from "~/components/employee/profile/profile-orders-empty";

export function ProfileOrdersTab() {
	const { user } = useAuth();
	const { data: ordersResponse, isLoading } = useGetOrders({
		fields: "id, orderNumber, userId, status, orderItems.id, orderItems.quantity, orderItems.unitPrice, orderItems.subtotal, orderItems.item.images, subtotal, tax, total, paymentType, installmentMonths, installmentCount, installmentAmount, paymentMethod, paymentStatus, orderDate, installments.status",
		filter: `userId:${user?.id}`,
	});

	const orders = ordersResponse?.orders ?? [];

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">My Orders</h2>

			{!isLoading && orders.length === 0 ? (
				<ProfileOrdersEmpty />
			) : (
				<div className="space-y-4 flex flex-col">
					{orders.map((order: any) => {
					// Calculate paid installments
					const paidInstallments = order.installments.filter(
						(i: any) => i.status === "PAID",
					).length;
					const totalInstallments = order.installments.length;
					const totalItems = order.orderItems?.length || 0;
					const firstImage = order.orderItems?.[0]?.item?.images?.[0]?.url;

					return (
						<Link key={order.id} to={`/employee/orders/${order.id}`}>
							<Card className="transition-colors hover:bg-muted/50 cursor-pointer">
								<CardContent className="py-0">
									<div className="flex items-center gap-4">
										{/* Image or Placeholder */}
										{firstImage ? (
											<img
												src={firstImage}
												alt={order.orderNumber}
												className="h-16 w-16 rounded-lg object-cover"
											/>
										) : (
											<div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
												<ShoppingBag className="h-8 w-8" />
											</div>
										)}

										<div className="flex-1 min-w-0">
											<h3 className="font-medium">{order.orderNumber}</h3>
											<p className="text-sm text-muted-foreground">
												{totalItems} {totalItems === 1 ? "item" : "items"} •{" "}
												{new Date(order.orderDate).toLocaleDateString()}
											</p>
											{order.paymentType === "INSTALLMENT" && (
												<div className="flex items-center gap-2 mt-2">
													<Progress
														value={
															totalInstallments > 0
																? (paidInstallments /
																		totalInstallments) *
																	100
																: 0
														}
														className="h-2 w-24"
													/>
													<span className="text-xs text-muted-foreground">
														{paidInstallments}/{totalInstallments}{" "}
														payments
													</span>
												</div>
											)}
										</div>
										<div className="text-right">
											<div className="font-semibold">
												{/* Display Monthly Payment or Total */}
												{order.paymentType === "INSTALLMENT"
													? `₱${(order.installmentAmount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo`
													: `₱${(order.total || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
											</div>
											<Badge
												variant={
													order.status === "COMPLETED"
														? "default"
														: "secondary"
												}
												className="capitalize mt-1">
												{order.status.replace("_", " ").toLowerCase()}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					);
					})}
				</div>
			)}
		</div>
	);
}
