import { Check, ShoppingBag, CreditCard, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckoutStep, StepConfig } from "./checkout-utils";

const steps: StepConfig[] = [
	{ id: "summary", label: "Review", description: "Order details", icon: ShoppingBag },
	{ id: "installment", label: "Payment", description: "Choose plan", icon: CreditCard },
	{ id: "confirmation", label: "Confirm", description: "Place order", icon: ClipboardCheck },
	{ id: "success", label: "Done", description: "Order placed", icon: Check },
];

interface CheckoutStepperProps {
	currentStep: CheckoutStep;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
	const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

	return (
		<div className="relative">
			{/* Progress Line Background */}
			<div className="absolute top-6 left-0 right-0 h-0.5 bg-muted mx-12" />
			{/* Progress Line Filled */}
			<div
				className="absolute top-6 left-0 h-0.5 bg-primary mx-12 transition-all duration-500"
				style={{
					width: `calc(${currentStepIndex / (steps.length - 1)} * (100% - 6rem))`,
				}}
			/>

			<div className="relative flex justify-between">
				{steps.map((step, index) => {
					const Icon = step.icon;
					const isActive = step.id === currentStep;
					const isCompleted = currentStepIndex > index;
					const isPending = currentStepIndex < index;

					return (
						<div
							key={step.id}
							className={cn(
								"flex flex-col items-center transition-all duration-300",
								isActive && "scale-105",
							)}>
							<div
								className={cn(
									"h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
									isActive &&
										"bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg",
									isCompleted && "bg-primary text-primary-foreground",
									isPending && "bg-muted text-muted-foreground",
								)}>
								{isCompleted ? (
									<Check className="h-5 w-5" />
								) : (
									<Icon className="h-5 w-5" />
								)}
							</div>
							<div className="mt-3 text-center">
								<span
									className={cn(
										"text-sm font-medium block",
										isActive && "text-primary",
										isPending && "text-muted-foreground",
									)}>
									{step.label}
								</span>
								<span className="text-xs text-muted-foreground hidden sm:block">
									{step.description}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
