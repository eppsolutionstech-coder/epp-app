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
	FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	CreateApprovalTypeSchema,
	ApproverRoleEnum,
	type CreateApprovalType,
	type ApprovalType,
} from "../../zod/approval-type.zod";
import { useCreateApprovalType, useUpdateApprovalType } from "~/hooks/use-approval-type";

type CreateApprovalTypeInput = z.input<typeof CreateApprovalTypeSchema>;

interface CreateApprovalTypeFormProps {
	onSuccess: () => void;
	onCancel?: () => void;
	defaultValues?: Partial<CreateApprovalTypeInput>;
	levelId?: string;
}

export function CreateApprovalTypeForm({
	onSuccess,
	onCancel,
	defaultValues,
	levelId,
}: CreateApprovalTypeFormProps) {
	const { mutate: createLevel, isPending: isCreating } = useCreateApprovalType();
	const { mutate: updateLevel, isPending: isUpdating } = useUpdateApprovalType();

	const isPending = isCreating || isUpdating;

	const form = useForm<CreateApprovalTypeInput>({
		resolver: zodResolver(CreateApprovalTypeSchema),
		defaultValues: defaultValues || {
			role: "MANAGER",
			description: "",
			isRequired: true,
			autoApproveUnder: null,
			timeoutDays: null,
		},
	});

	const onSubmit = (data: CreateApprovalTypeInput) => {
		if (levelId) {
			updateLevel(
				{ id: levelId, data: data as CreateApprovalType },
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
			createLevel(data as CreateApprovalType, {
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
				<FormField
					control={form.control}
					name="isRequired"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
							<FormControl>
								<Checkbox
									checked={field.value as boolean}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Required</FormLabel>
								<FormDescription>
									If checked, this approval level cannot be skipped.
								</FormDescription>
							</div>
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
