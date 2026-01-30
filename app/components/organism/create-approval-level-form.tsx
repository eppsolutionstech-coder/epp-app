import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
	type CreateApprovalLevel,
	type ApprovalLevel,
} from "../../zod/approval-level.zod";
import { useCreateApprovalLevel, useUpdateApprovalLevel } from "~/hooks/use-approval-level";

// We use z.input for the form to allow strings that will be coerced/transformed
type CreateApprovalLevelInput = z.input<typeof CreateApprovalLevelSchema>;

interface CreateApprovalLevelFormProps {
	onSuccess: () => void;
	onCancel?: () => void;
	defaultValues?: Partial<CreateApprovalLevelInput>;
	levelId?: string;
}

export function CreateApprovalLevelForm({
	onSuccess,
	onCancel,
	defaultValues,
	levelId,
}: CreateApprovalLevelFormProps) {
	const { mutate: createLevel, isPending: isCreating } = useCreateApprovalLevel();
	const { mutate: updateLevel, isPending: isUpdating } = useUpdateApprovalLevel();

	const isPending = isCreating || isUpdating;

	const form = useForm<CreateApprovalLevelInput>({
		resolver: zodResolver(CreateApprovalLevelSchema),
		defaultValues: defaultValues || {
			role: "MANAGER",
			description: "",
			isRequired: true,
			autoApproveUnder: null,
			timeoutDays: null,
		},
	});

	const onSubmit = (data: CreateApprovalLevelInput) => {
		if (levelId) {
			updateLevel(
				{ id: levelId, data: data as CreateApprovalLevel },
				{
					onSuccess: () => {
						toast.success("Approval level updated successfully");
						onSuccess();
					},
					onError: (error) => {
						toast.error(error.message || "Failed to update approval level");
					},
				},
			);
		} else {
			createLevel(data as CreateApprovalLevel, {
				onSuccess: () => {
					toast.success("Approval level created successfully");
					onSuccess();
				},
				onError: (error) => {
					toast.error(error.message || "Failed to create approval level");
				},
			});
		}
	};

	return (
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
				<div className="flex justify-end gap-2 pt-2">
					{onCancel && (
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
					)}
					<Button type="submit" disabled={isPending}>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{levelId ? "Update Level" : "Create Level"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
