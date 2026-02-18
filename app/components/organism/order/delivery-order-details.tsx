import type { DeliveryDocument } from "~/zod/deliveryDocument.zod";

interface DeliveryOrderDetailsProps {
	deliveryDocument?: DeliveryDocument;
}

export function DeliveryOrderDetails({ deliveryDocument }: DeliveryOrderDetailsProps) {
	const formatDate = (value?: string | Date | null) => {
		if (!value) return "-";
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) return "-";
		return date.toLocaleDateString("en-US", {
			day: "2-digit",
			month: "short",
			year: "2-digit",
		});
	};

	const doData = {
		doNumber: deliveryDocument?.documentNumber || "-",
		date: formatDate((deliveryDocument?.documentDate as Date | string | undefined) ?? null),
		fromLocation: deliveryDocument?.fromLocation || "-",
		toName: deliveryDocument?.toName || "-",
		toAddress: deliveryDocument?.toAddress || "-",
		carrierInfo: deliveryDocument?.carrierInfo || "-",
		trackingNumber: deliveryDocument?.trackingNumber || "-",
		expectedDeliveryDate: formatDate(deliveryDocument?.expectedDeliveryDate),
		items: (deliveryDocument?.items || []).map((item) => {
			const quantity = item.quantity;
			return {
				qty: quantity.toLocaleString(),
				unit: "unit/s",
				itemCode: item.sku,
				description: item.description || "-",
			};
		}),
		receiverName: deliveryDocument?.receiverName || "-",
		receivedDate: formatDate(deliveryDocument?.updatedAt), // Using updatedAt as proxy for received date if waiting for signature
	};

	return (
		<div className="w-full bg-white text-slate-900 section-to-print">
			{/* Header Section */}
			<div className="flex flex-col md:flex-row justify-between pb-4">
				<div className="flex flex-col">
					<div className="flex items-center gap-2 mb-2">
						{/* Logo Placeholder */}
						<div className="h-12 w-12 relative flex items-center justify-center">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="h-10 w-10 text-orange-600">
								<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
								<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
								<line x1="12" y1="22.08" x2="12" y2="12" />
							</svg>
						</div>
						<div className="flex flex-col">
							<span className="text-3xl font-bold text-orange-600 leading-none">
								uzaro
							</span>
							<span className="text-[0.6rem] text-orange-400 tracking-[0.2em] font-medium">
								SOLUTIONS TECH INC
							</span>
						</div>
					</div>
					<div className="text-[10px] text-muted-foreground leading-tight">
						<p>
							2F Fairway Residences #9 Capitol Hills Matandang Balara, Quezon City,
							1119
						</p>
						<p>Tel. No : 83306689 | Email : sales@uzaro.net</p>
					</div>
				</div>

				<div className="mt-4 md:mt-0 md:text-right min-w-[300px]">
					<div className="bg-orange-700 text-white py-1.5 px-4 text-center font-bold text-sm mb-2">
						DELIVERY ORDER
					</div>
					<div className="grid grid-cols-[100px_1fr] md:grid-cols-[1fr_auto] gap-x-2 text-xs">
						<div className="font-bold text-right">DO NO:</div>
						<div className="text-right">{doData.doNumber}</div>
						<div className="font-bold text-right">DATE :</div>
						<div className="text-right">{doData.date}</div>
					</div>
				</div>
			</div>

			{/* Shipping Details */}
			<div className="grid grid-cols-2 bg-orange-800 text-white text-[10px] font-bold p-1.5 text-center">
				<div>FROM</div>
				<div>TO</div>
			</div>

			<div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
				{/* From Details */}
				<div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-1">
					<div className="font-bold">Location:</div>
					<div>{doData.fromLocation}</div>
				</div>

				{/* To Details */}
				<div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-1">
					<div className="font-bold">Name:</div>
					<div>{doData.toName}</div>
					<div className="font-bold">Address:</div>
					<div>{doData.toAddress}</div>
				</div>
			</div>

			{/* Carrier Info */}
			<div className="grid grid-cols-3 bg-orange-800 text-white text-[10px] font-bold p-1.5 text-center mt-2">
				<div>CARRIER</div>
				<div>TRACKING NUMBER</div>
				<div>EXPECTED DELIVERY</div>
			</div>
			<div className="grid grid-cols-3 p-2 text-xs text-center border-b">
				<div>{doData.carrierInfo}</div>
				<div>{doData.trackingNumber}</div>
				<div>{doData.expectedDeliveryDate}</div>
			</div>

			{/* Items Table */}
			<div className="bg-orange-800 text-white text-[10px] font-bold p-1.5 grid grid-cols-[80px_80px_150px_1fr] text-center mt-4">
				<div>QTY</div>
				<div>UNIT</div>
				<div>ITEM CODE</div>
				<div>DESCRIPTION</div>
			</div>

			<div className="min-h-[150px]">
				{doData.items.map((item, index) => (
					<div
						key={index}
						className="grid grid-cols-[80px_80px_150px_1fr] text-xs py-4 px-2 text-center items-start border-b border-dashed border-gray-200 last:border-0">
						<div>{item.qty}</div>
						<div>{item.unit}</div>
						<div>{item.itemCode}</div>
						<div className="text-left px-2">{item.description}</div>
					</div>
				))}
			</div>

			{/* Signatures */}
			<div className="grid grid-cols-2 gap-12 px-16 pb-12 mt-8">
				<div className="flex flex-col items-center">
					<div className="h-12 w-full flex items-end justify-center relative">
						<div className="z-10 text-sm font-medium">Auth. Personnel</div>
					</div>
					<div className="w-full border-t border-black mt-1"></div>
					<div className="text-[10px] font-bold mt-1">PREPARED BY:</div>
					<div className="mt-6 w-3/4 border-b border-black"></div>
					<div className="text-[10px] mt-1">DATE PREPARED</div>
				</div>

				<div className="flex flex-col items-center">
					<div className="h-12 w-full flex items-end justify-center relative">
						<div className="z-10 text-sm font-medium">{doData.receiverName}</div>
					</div>
					<div className="w-full border-t border-black mt-1"></div>
					<div className="text-[10px] font-bold mt-1">RECEIVED BY:</div>
					<div className="mt-6 w-3/4 border-b border-black"></div>
					<div className="text-xs mt-1">{doData.receivedDate}</div>
					<div className="text-[10px]">DATE RECEIVED</div>
				</div>
			</div>
		</div>
	);
}
