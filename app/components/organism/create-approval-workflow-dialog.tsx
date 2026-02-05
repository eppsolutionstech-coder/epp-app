import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	CreateApprovalWorkflowSchema,
	type CreateApprovalWorkflow,
} from "~/zod/approval-workflow.zod";
import {
	useCreateApprovalWorkflow,
	useUpdateApprovalWorkflow,
	useGetApprovalWorkflowById,
} from "~/hooks/use-approval-workflow";

interface CreateApprovalWorkflowDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	workflowId?: string | null;
}

export function CreateApprovalWorkflowDialog({
	open,
	onOpenChange,
	workflowId,
}: CreateApprovalWorkflowDialogProps) {
	const isEditMode = !!workflowId;
	const { mutate: createWorkflow, isPending: isCreating } = useCreateApprovalWorkflow();
	const { mutate: updateWorkflow, isPending: isUpdating } = useUpdateApprovalWorkflow();
	const { data: workflowData, isLoading: isLoadingWorkflow } = useGetApprovalWorkflowById(
		workflowId || "",
		{
			fields: "id, name, description, isActive, minOrderAmount, maxOrderAmount, requiresInstallment",
		},
	);

	const isPending = isCreating || isUpdating;

	const form = useForm<CreateApprovalWorkflow>({
		resolver: zodResolver(CreateApprovalWorkflowSchema),
		defaultValues: {
			name: "",
			description: "",
			isActive: true,
			requiresInstallment: false,
			minOrderAmount: null,
			maxOrderAmount: null,
		},
	});

	// Reset form when dialog opens or when workflow data is loaded
	useEffect(() => {
		if (open) {
			if (isEditMode && workflowData) {
				const workflow = workflowData;
				form.reset({
					name: workflow.name || "",
					description: workflow.description || "",
					isActive: workflow.isActive ?? true,
					requiresInstallment: workflow.requiresInstallment ?? false,
					minOrderAmount: workflow.minOrderAmount
						? Number(workflow.minOrderAmount)
						: null,
					maxOrderAmount: workflow.maxOrderAmount
						? Number(workflow.maxOrderAmount)
						: null,
				});
			} else if (!isEditMode) {
				form.reset({
					name: "",
					description: "",
					isActive: true,
					requiresInstallment: false,
					minOrderAmount: null,
					maxOrderAmount: null,
				});
			}
		}
	}, [open, isEditMode, workflowData, form]);

	const onSubmit = (data: CreateApprovalWorkflow) => {
		if (isEditMode && workflowId) {
			updateWorkflow(
				{ id: workflowId, data },
				{
					onSuccess: () => {
						toast.success("Approval workflow updated successfully");
						onOpenChange(false);
					},
					onError: (error) => {
						toast.error(error.message || "Failed to update approval workflow");
					},
				},
			);
		} else {
			createWorkflow(data, {
				onSuccess: () => {
					toast.success("Approval workflow created successfully");
					onOpenChange(false);
				},
				onError: (error) => {
					toast.error(error.message || "Failed to create approval workflow");
				},
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{isEditMode ? "Edit Approval Workflow" : "Create Approval Workflow"}
					</DialogTitle>
					<DialogDescription>
						{isEditMode
							? "Update the approval workflow settings."
							: "Define a new approval workflow for your organization."}
					</DialogDescription>
				</DialogHeader>
				{isEditMode && isLoadingWorkflow ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g. Standard Approval"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe when this workflow applies..."
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="minOrderAmount"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Min Amount</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="0.00"
													{...field}
													value={field.value || ""}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? Number(e.target.value)
																: null,
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="maxOrderAmount"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Max Amount</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Optional"
													{...field}
													value={field.value || ""}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? Number(e.target.value)
																: null,
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="requiresInstallment"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Requires Installment</FormLabel>
											<FormDescription>
												This workflow only applies if order is installment
											</FormDescription>
										</div>
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button type="submit" disabled={isPending}>
									{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									{isEditMode ? "Update Workflow" : "Create Workflow"}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
}
