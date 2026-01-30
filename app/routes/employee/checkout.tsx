import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
	CheckoutEmpty,
	CheckoutHeader,
	CheckoutStepper,
	SummaryStep,
	InstallmentStep,
	ConfirmationStep,
	SuccessStep,
	calculateTotals,
	type CheckoutItem,
	type CheckoutStep,
} from "~/components/employee/checkout";
import { useAuth } from "~/hooks/use-auth";
import { useCreateOrder } from "~/hooks/use-order";
import { useCheckoutCart } from "~/hooks/use-cart-item";

interface LocationState {
	items?: CheckoutItem[];
	source?: "cart" | "direct";
}

export default function CheckoutPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [currentStep, setCurrentStep] = useState<CheckoutStep>("summary");
	const [selectedInstallments, setSelectedInstallments] = useState(6);
	const [orderNumber, setOrderNumber] = useState<string>();
	const { user } = useAuth();
	const createOrder = useCreateOrder();
	const checkoutCart = useCheckoutCart();

	// Get items and source from navigation state
	const locationState = location.state as LocationState | null;
	const checkoutItems = locationState?.items ?? [];
	const source = locationState?.source ?? "direct"; // Default to direct if not specified
	console.log(checkoutItems, source);

	// Check if we have items to checkout
	if (checkoutItems.length === 0) {
		return <CheckoutEmpty />;
	}

	const { subtotal, total } = calculateTotals(checkoutItems);
	const perInstallment = total / selectedInstallments;

	const handleNext = () => {
		const steps: CheckoutStep[] = ["summary", "installment", "confirmation", "success"];
		const currentIndex = steps.indexOf(currentStep);
		if (currentIndex < steps.length - 1) {
			setCurrentStep(steps[currentIndex + 1]);
		}
	};

	const handleBack = () => {
		const steps: CheckoutStep[] = ["summary", "installment", "confirmation", "success"];
		const currentIndex = steps.indexOf(currentStep);
		if (currentIndex > 0) {
			setCurrentStep(steps[currentIndex - 1]);
		}
	};

	const handleConfirm = () => {
		if (!user?.id) return;

		const orderPayload = {
			employeeId: user.id,
			installmentMonths: selectedInstallments,
			total: total,
			subtotal: subtotal,
			items: checkoutItems.map((item) => ({
				itemId: item.itemId,
				quantity: item.quantity,
			})),
			paymentType: "INSTALLMENT" as const,
			paymentMethod: "PAYROLL_DEDUCTION" as const,
		};

		const callbacks = {
			onSuccess: (response: any) => {
				setOrderNumber(response.order?.orderNumber || "PENDING"); // Handle potential missing orderNumber if checkout endpoint differs
				setCurrentStep("success");
			},
			onError: (error: any) => {
				console.error("Failed to create order:", error);
				// TODO: Show error toast/notification
			},
		};

		if (source === "cart") {
			checkoutCart.mutate(orderPayload, callbacks);
		} else {
			createOrder.mutate(orderPayload, callbacks);
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<CheckoutHeader
				showBackButton={currentStep !== "success"}
				onBack={() => navigate(-1)}
			/>

			<CheckoutStepper currentStep={currentStep} />

			<div className="space-y-6">
				{currentStep === "summary" && (
					<SummaryStep items={checkoutItems} onNext={handleNext} />
				)}

				{currentStep === "installment" && (
					<InstallmentStep
						total={total}
						selectedInstallments={selectedInstallments}
						onSelectInstallments={setSelectedInstallments}
						onBack={handleBack}
						onNext={handleNext}
					/>
				)}

				{currentStep === "confirmation" && (
					<ConfirmationStep
						items={checkoutItems}
						subtotal={subtotal}
						total={total}
						selectedInstallments={selectedInstallments}
						perInstallment={perInstallment}
						onBack={handleBack}
						onConfirm={handleConfirm}
						isSubmitting={createOrder.isPending || checkoutCart.isPending}
					/>
				)}

				{currentStep === "success" && <SuccessStep orderNumber={orderNumber} />}
			</div>
		</div>
	);
}
