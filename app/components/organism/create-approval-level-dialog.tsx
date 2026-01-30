import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod"; // Import z for input type inference
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
	CreateApprovalLevelSchema,
	ApproverRoleEnum,
	type CreateApprovalLevel, // This matches z.infer (output)
} from "../../zod/approval-level.zod";
import { useCreateApprovalLevel } from "~/hooks/use-approval-level";

interface CreateApprovalLevelDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// We use z.input for the form to allow strings that will be coerced/transformed
type CreateApprovalLevelInput = z.input<typeof CreateApprovalLevelSchema>;

export function CreateApprovalLevelDialog({ open, onOpenChange }: CreateApprovalLevelDialogProps) {
	const { mutate: createLevel, isPending } = useCreateApprovalLevel();

	const form = useForm<CreateApprovalLevelInput>({
		resolver: zodResolver(CreateApprovalLevelSchema),
		defaultValues: {
			role: "MANAGER", // Default role
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

	const onSubmit = (data: CreateApprovalLevelInput) => {
		// data here is actually the output type after validation, but hook-form types it as input.
		// We cast it to the expected output type for the mutation.
		createLevel(data as CreateApprovalLevel, {
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
												// Allow Zod schema to handle coercion/string checking
												// Passing the string directly lets user type decimals comfortably
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
													// timeoutDays expects number in schema primarily, but our custom helper might not apply to timeoutDays
													// Looking at schema: timeoutDays: z.number().int()...
													// So we MUST coerce to number, or use valueAsNumber
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
