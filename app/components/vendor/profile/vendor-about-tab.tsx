import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Globe } from "lucide-react";
import type { Vendor, Product } from "~/data/mock-admin-data";

interface VendorAboutTabProps {
	vendor: Vendor;
	products: Product[];
}

export function VendorAboutTab({ vendor, products }: VendorAboutTabProps) {
	const activeProducts = products.filter((p) => p.status === "active").length;
	const totalRevenue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<h2 className="text-2xl font-semibold">Company Profile</h2>
				<Button variant="outline" size="sm">
					Edit
				</Button>
			</div>

			{/* Company Card */}
			<Card>
				<CardContent className="">
					<div className="flex items-start gap-6">
						{/* Logo */}
						<div className="h-20 w-20 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
							<span className="text-2xl font-bold text-white">
								{vendor.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.slice(0, 2)}
							</span>
						</div>

						{/* Info */}
						<div className="space-y-4 flex-1">
							<div>
								<h3 className="text-xl font-semibold">{vendor.name}</h3>
								<p className="text-muted-foreground">Vendor Partner</p>
							</div>

							<div className="grid gap-3 sm:grid-cols-2">
								<div className="flex items-center gap-2 text-sm">
									<Mail className="h-4 w-4 text-muted-foreground" />
									{vendor.email}
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Phone className="h-4 w-4 text-muted-foreground" />
									{vendor.phone || "+1 (555) 123-4567"}
								</div>
								<div className="flex items-center gap-2 text-sm">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									{vendor.address || "123 Business Street, City"}
								</div>
								<div className="flex items-center gap-2 text-sm">
									<Badge variant="default" className="capitalize">
										{vendor.status}
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardContent className=" text-center">
						<div className="text-3xl font-bold">{products.length}</div>
						<p className="text-sm text-muted-foreground">Total Products</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className=" text-center">
						<div className="text-3xl font-bold">{activeProducts}</div>
						<p className="text-sm text-muted-foreground">Active Listings</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className=" text-center">
						<div className="text-3xl font-bold text-emerald-600">
							₱{totalRevenue.toLocaleString()}
						</div>
						<p className="text-sm text-muted-foreground">Total Sales</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
