import { useState } from "react";
import { Plus, Settings, ArrowLeft, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useGetApprovalLevels, useDeleteApprovalLevel } from "~/hooks/use-approval-level";
import type { ApprovalLevel } from "~/zod/approval-level.zod";
import { CreateApprovalLevelForm } from "./create-approval-level-form";

interface ManageApprovalLevelsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type ViewState = "list" | "create" | "edit";

export function ManageApprovalLevelsDialog({
	open,
	onOpenChange,
}: ManageApprovalLevelsDialogProps) {
	const { data: levelsData, isLoading } = useGetApprovalLevels({ limit: 100 });
	const { mutate: deleteLevel } = useDeleteApprovalLevel();
	const levels = (levelsData as { approvalLevels: ApprovalLevel[] })?.approvalLevels || [];
	const [view, setView] = useState<ViewState>("list");
	const [editingLevel, setEditingLevel] = useState<ApprovalLevel | null>(null);

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset view when closing
			setTimeout(() => {
				setView("list");
				setEditingLevel(null);
			}, 300);
		}
		onOpenChange(newOpen);
	};

	const handleEdit = (level: ApprovalLevel) => {
		setEditingLevel(level);
		setView("edit");
	};

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this approval level?")) {
			deleteLevel(id, {
				onSuccess: () => {
					toast.success("Approval level deleted successfully");
				},
				onError: (error) => {
					toast.error(error.message || "Failed to delete approval level");
				},
			});
		}
	};

	const getTitle = () => {
		switch (view) {
			case "list":
				return "Manage Approval Levels";
			case "create":
				return "Create Approval Level";
			case "edit":
				return "Edit Approval Level";
		}
	};

	const getDescription = () => {
		switch (view) {
			case "list":
				return "View and manage all available approval levels. These are reusable across different workflows.";
			case "create":
				return "Define a new reusable approval level.";
			case "edit":
				return "Modify existing approval level details.";
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<div className="space-y-1.5">
							<DialogTitle>{getTitle()}</DialogTitle>
							<DialogDescription>{getDescription()}</DialogDescription>
						</div>
						{view === "list" ? (
							<Button
								size="sm"
								onClick={() => {
									setEditingLevel(null);
									setView("create");
								}}>
								<Plus className="mr-2 h-4 w-4" />
								Create Level
							</Button>
						) : (
							<Button size="sm" variant="ghost" onClick={() => setView("list")}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to List
							</Button>
						)}
					</div>
				</DialogHeader>

				<div className="flex-1 overflow-auto -mx-6 px-6 pt-2">
					{view === "create" || view === "edit" ? (
						<div className="max-w-lg mx-auto py-4">
							<CreateApprovalLevelForm
								levelId={view === "edit" ? editingLevel?.id : undefined}
								defaultValues={
									view === "edit" && editingLevel
										? {
												role: editingLevel.role,
												description: editingLevel.description || "",
												isRequired: editingLevel.isRequired,
												autoApproveUnder: editingLevel.autoApproveUnder,
												timeoutDays: editingLevel.timeoutDays,
											}
										: undefined
								}
								onSuccess={() => setView("list")}
								onCancel={() => setView("list")}
							/>
						</div>
					) : isLoading ? (
						<div className="space-y-2">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="h-12 bg-muted/40 rounded animate-pulse" />
							))}
						</div>
					) : levels.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
							<div className="p-3 bg-muted/20 rounded-full mb-4">
								<Settings className="h-6 w-6 text-muted-foreground" />
							</div>
							<h3 className="text-sm font-medium">No levels defined</h3>
							<p className="text-sm text-muted-foreground mt-1 mb-4 max-w-xs">
								Create your first approval level to start building workflows.
							</p>
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									setEditingLevel(null);
									setView("create");
								}}>
								Create Level
							</Button>
						</div>
					) : (
						<div className="border rounded-md">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[150px]">Role</TableHead>
										<TableHead>Description</TableHead>
										<TableHead>Required</TableHead>
										<TableHead>Auto-approve Under</TableHead>
										<TableHead>Timeout</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{levels.map((level) => (
										<TableRow key={level.id}>
											<TableCell className="font-medium">
												<Badge variant="outline">{level.role}</Badge>
											</TableCell>
											<TableCell>
												<span className="text-muted-foreground text-sm">
													{level.description || "—"}
												</span>
											</TableCell>
											<TableCell>
												{level.isRequired ? (
													<Badge
														variant="secondary"
														className="font-normal text-xs">
														Yes
													</Badge>
												) : (
													<span className="text-muted-foreground text-xs">
														No
													</span>
												)}
											</TableCell>
											<TableCell>
												{level.autoApproveUnder ? (
													<span className="font-mono text-xs">
														₱
														{Number(
															level.autoApproveUnder,
														).toLocaleString()}
													</span>
												) : (
													<span className="text-muted-foreground text-xs">
														—
													</span>
												)}
											</TableCell>
											<TableCell>
												{level.timeoutDays ? (
													<Badge
														variant="secondary"
														className="font-normal text-xs">
														{level.timeoutDays} days
													</Badge>
												) : (
													<span className="text-muted-foreground text-xs">
														—
													</span>
												)}
											</TableCell>
											<TableCell className="text-muted-foreground text-xs">
												{new Date(level.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															className="h-8 w-8 p-0">
															<span className="sr-only">
																Open menu
															</span>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>
															Actions
														</DropdownMenuLabel>
														<DropdownMenuItem
															onClick={() => handleEdit(level)}>
															<Pencil className="mr-2 h-4 w-4" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-destructive focus:text-destructive"
															onClick={() => handleDelete(level.id)}>
															<Trash className="mr-2 h-4 w-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
