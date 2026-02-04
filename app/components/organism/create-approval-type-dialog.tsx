import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	CreateApprovalTypeSchema,
	ApproverRoleEnum,
	type CreateApprovalType,
} from "../../zod/approval-type.zod";
import { useCreateApprovalType } from "~/hooks/use-approval-type";

interface CreateApprovalTypeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type CreateApprovalTypeInput = z.input<typeof CreateApprovalTypeSchema>;

export function CreateApprovalTypeDialog({ open, onOpenChange }: CreateApprovalTypeDialogProps) {
	const { mutate: createLevel, isPending } = useCreateApprovalType();

	const form = useForm<CreateApprovalTypeInput>({
		resolver: zodResolver(CreateApprovalTypeSchema),
		defaultValues: {
			role: "MANAGER",
			description: "",
			isRequired: true,
			autoApproveUnder: null,
			timeoutDays: null,
		},
	});

	useEffect(() => {
		if (open) {
			form.reset();
		}
	}, [open, form]);

	const onSubmit = (data: CreateApprovalTypeInput) => {
		createLevel(data as CreateApprovalType, {
			onSuccess: () => {
				toast.success("Approval level created successfully");
				onOpenChange(false);
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create approval level");
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Approval Level</DialogTitle>
					<DialogDescription>Define a new reusable approval level.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value as string}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{ApproverRoleEnum.options.map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
											placeholder="e.g. Department Manager Approval"
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
								name="autoApproveUnder"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Auto-approve Under</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Optional"
												{...field}
												value={field.value === null ? "" : field.value}
												onChange={(e) => {
													const val = e.target.value;
													field.onChange(val === "" ? null : val);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="timeoutDays"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Timeout (Days)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Optional"
												{...field}
												value={field.value === null ? "" : field.value}
												onChange={(e) => {
													const val = e.target.value;
													field.onChange(val === "" ? null : Number(val));
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isPending}>
								{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Create Level
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
