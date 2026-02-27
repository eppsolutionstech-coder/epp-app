import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { toast } from "sonner";
import {
	CheckoutEmpty,
	CheckoutHeader,
	CheckoutStepper,
	SummaryStep,
	InstallmentStep,
	ConfirmationStep,
	SuccessStep,
	calculateTotals,
	getLowestInstallmentTier,
	calculateInstallmentPricing,
	type CheckoutItem,
	type CheckoutStep,
} from "~/components/employee/checkout";
import { useAuth } from "~/hooks/use-auth";
import { useCreateOrder } from "~/hooks/use-order";
import { useCheckoutCart } from "~/hooks/use-cart-item";
import { useGetFinancierConfigs } from "~/hooks/use-financier-config";

interface LocationState {
	items?: CheckoutItem[];
	source?: "cart" | "direct";
}

export default function CheckoutPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const currentStep = (searchParams.get("step") as CheckoutStep) || "summary";
	const [selectedInstallments, setSelectedInstallments] = useState<number | null>(null);
	const [orderNumber, setOrderNumber] = useState<string>();
	const { user } = useAuth();
	const isEppEmployee = (user?.role as string) === "epp-employee";
	const createOrder = useCreateOrder();
	const checkoutCart = useCheckoutCart();

	const { data: configsData } = useGetFinancierConfigs();
	const firstConfig = configsData?.financierConfigs?.[0];
	const installmentConfigs = firstConfig?.installmentRateConfig || [];

	// Get items and source from navigation state
	const locationState = location.state as LocationState | null;
	const checkoutItems = locationState?.items ?? [];
	const source = locationState?.source ?? "direct"; // Default to direct if not specified

	// Check if we have items to checkout
	if (checkoutItems.length === 0) {
		return <CheckoutEmpty />;
	}

	const { subtotal, total: baseTotal } = calculateTotals(checkoutItems);

	// Compute default selectedInstallments
	useEffect(() => {
		if (selectedInstallments === null && installmentConfigs.length > 0) {
			setSelectedInstallments(getLowestInstallmentTier(baseTotal, installmentConfigs));
		} else if (selectedInstallments === null && configsData) {
			setSelectedInstallments(0);
		}
	}, [installmentConfigs, selectedInstallments, baseTotal, configsData]);

	const activeInstallments = selectedInstallments || 0;

	// Calculate correct total and per installment values relative to the selected installment term interest
	const selectedTier = installmentConfigs.find((t) => t.installmentCount === activeInstallments);
	const activeRate = selectedTier?.rate || 0;
	const { totalWithInterest, perInstallment } = calculateInstallmentPricing(
		baseTotal,
		activeInstallments,
		activeRate,
	);

	const handleNext = () => {
		const steps: CheckoutStep[] = ["summary", "installment", "confirmation", "success"];
		const currentIndex = steps.indexOf(currentStep);
		if (currentIndex < steps.length - 1) {
			setSearchParams({ step: steps[currentIndex + 1] }, { state: location.state });
		}
	};

	const handleBack = () => {
		const steps: CheckoutStep[] = ["summary", "installment", "confirmation", "success"];
		const currentIndex = steps.indexOf(currentStep);
		if (currentIndex > 0) {
			setSearchParams({ step: steps[currentIndex - 1] }, { state: location.state });
		}
	};

	const handleConfirm = () => {
		if (!user?.id) return;

		const orderPayload = {
			userId: user.id,
			installmentMonths: activeInstallments,
			total: totalWithInterest,
			subtotal: subtotal,
			items: checkoutItems.map((item) => ({
				itemId: item.item.id,
				quantity: item.quantity,
			})),
			paymentType: "INSTALLMENT" as const,
			paymentMethod: "PAYROLL_DEDUCTION" as const,
		};

		const callbacks = {
			onSuccess: (response: any) => {
				setOrderNumber(response.order?.orderNumber || "PENDING"); // Handle potential missing orderNumber if checkout endpoint differs
				setSearchParams({ step: "success" }, { state: location.state });
			},
			onError: (error: any) => {
				console.error("Failed to create order:", error);
				toast.error(error.message || "Failed to create order. Please try again.");
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
					<SummaryStep
						items={checkoutItems}
						onNext={handleNext}
						isEppEmployee={isEppEmployee}
					/>
				)}

				{currentStep === "installment" && (
					<InstallmentStep
						total={baseTotal}
						selectedInstallments={activeInstallments}
						onSelectInstallments={setSelectedInstallments}
						installmentConfigs={installmentConfigs}
						onBack={handleBack}
						onNext={handleNext}
					/>
				)}

				{currentStep === "confirmation" && (
					<ConfirmationStep
						items={checkoutItems}
						subtotal={subtotal}
						total={totalWithInterest}
						selectedInstallments={activeInstallments}
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
