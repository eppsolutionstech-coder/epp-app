import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, FileText, Settings } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_EMPLOYEES, type Employee } from "~/data/mock-admin-data";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";

export default function AdminEmployees() {
	const columns: DataTableColumn<Employee>[] = [
		{
			key: "name",
			label: "Employee",
			sortable: true,
			searchable: true,
			render: (_, row) => (
				<div className="flex flex-col">
					<span className="font-medium text-sm">{row.name}</span>
					<span className="text-xs text-muted-foreground">{row.email}</span>
				</div>
			),
		},
		{
			key: "department",
			label: "Department",
			sortable: true,
			filterable: true,
			filterOptions: [
				{ label: "Engineering", value: "Engineering" },
				{ label: "Design", value: "Design" },
				{ label: "Product", value: "Product" },
				{ label: "Sales", value: "Sales" },
				{ label: "Marketing", value: "Marketing" },
				{ label: "HR", value: "HR" },
				{ label: "Finance", value: "Finance" },
			],
		},
		{
			key: "status",
			label: "Status",
			sortable: true,
			filterable: true,
			filterOptions: [
				{ label: "Active", value: "active" },
				{ label: "Inactive", value: "inactive" },
				{ label: "On Leave", value: "on_leave" },
			],
			render: (value) => (
				<Badge variant={value === "active" ? "default" : "secondary"}>{value}</Badge>
			),
		},
		{
			key: "usedAmount", // Use usedAmount for key, but render logic handles calculation
			label: "Credit Usage",
			render: (_, row) => {
				const usagePercent = (row.usedAmount / row.creditLimit) * 100;
				return (
					<div className="w-[200px] space-y-1">
						<div className="flex justify-between text-xs">
							<span>₱{row.usedAmount.toLocaleString()} used</span>
							<span className="text-muted-foreground">
								of ₱{row.creditLimit.toLocaleString()}
							</span>
						</div>
						<Progress value={usagePercent} className="h-2" />
					</div>
				);
			},
		},
		{
			key: "creditLimit", // Just for uniqueness
			label: "Remaining",
			className: "text-right font-medium",
			render: (_, row) => `₱${(row.creditLimit - row.usedAmount).toLocaleString()}`,
		},
		{
			key: "id",
			label: "Actions",
			className: "text-right",
			render: () => (
				<div className="text-right">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem>
								<FileText className="mr-2 h-4 w-4" />
								View History
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 h-4 w-4" />
								Edit Limit
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Employees</h1>
					<p className="text-muted-foreground">
						Manage employee eligibility and credit limits.
					</p>
				</div>
				<Button>Export List</Button>
			</div>

			<div className="rounded-md border bg-card">
				<DataTable columns={columns} data={MOCK_EMPLOYEES} />
			</div>
		</div>
	);
}
