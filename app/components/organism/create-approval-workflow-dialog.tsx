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
import { useCreateApprovalWorkflow } from "~/hooks/use-approval-workflow";

interface CreateApprovalWorkflowDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateApprovalWorkflowDialog({
	open,
	onOpenChange,
}: CreateApprovalWorkflowDialogProps) {
	const { mutate: createWorkflow, isPending } = useCreateApprovalWorkflow();

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

	useEffect(() => {
		if (open) {
			form.reset();
		}
	}, [open, form]);

	const onSubmit = (data: CreateApprovalWorkflow) => {
		createWorkflow(data, {
			onSuccess: () => {
				toast.success("Approval workflow created successfully");
				onOpenChange(false);
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create approval workflow");
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Approval Workflow</DialogTitle>
					<DialogDescription>
						Define a new approval workflow for your organization.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="e.g. Standard Approval" {...field} />
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
								Create Workflow
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
