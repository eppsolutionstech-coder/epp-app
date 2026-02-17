import type { PurchaseOrderWithRelations } from "~/zod/purchaseOrder.zod";

interface PurchaseOrderDetailsProps {
	purchaseOrder?: PurchaseOrderWithRelations;
}

export function PurchaseOrderDetails({ purchaseOrder }: PurchaseOrderDetailsProps) {
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

	const formatCurrency = (value?: number | null) => {
		if (typeof value !== "number") return "0.00";
		return value.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	const poData = {
		poNumber: purchaseOrder?.poNumber || "-",
		date: formatDate((purchaseOrder?.createdAt as Date | string | undefined) ?? null),
		company: {
			to: purchaseOrder?.supplier?.name || "-",
			address: (purchaseOrder as any)?.supplier?.address || "-",
		},
		contact: {
			name: purchaseOrder?.contactName || "-",
			designation: purchaseOrder?.contactDesignation || "-",
			department: purchaseOrder?.contactDepartment || "-",
			contactNumber: purchaseOrder?.contactNumber || "-",
			contactMobile: purchaseOrder?.contactMobile || "-",
			email: purchaseOrder?.contactEmail || "-",
		},
		shippedTo: purchaseOrder?.requisitioner?.address || "-",
		requisitioner: purchaseOrder?.requisitioner?.name || "-",
		reqDesignation: purchaseOrder?.requisitioner?.designation || "-",
		reqDepartment: purchaseOrder?.requisitioner?.department || "-",
		terms: purchaseOrder?.pdc || "-",
		leadTime: purchaseOrder?.leadTime ?? "-",
		availability: purchaseOrder?.availability || "-",
		delivery: purchaseOrder?.delivery || "-",
		items: (purchaseOrder?.items || []).map((item) => {
			const quantity = item.quantity;
			const unitPrice = item.unitPrice ?? 0;
			const total = quantity * unitPrice;
			return {
				qty: quantity.toLocaleString(),
				unit: "unit/s",
				itemCode: item.sku,
				description: item.description || "-",
				unitPrice: formatCurrency(unitPrice),
				total: formatCurrency(total),
			};
		}),
		subTotal: "36,000,000.00",
		totalVatInc: "36,000,000.00",
		checkedBy: {
			name: "Lonaly Maderazo",
			title: "PROCUREMENT MANAGER",
			date: "04-Feb-26",
		},
		approvedBy: {
			name: "Archie Roño",
			title: "CHIEF EXECUTIVE OFFICER",
			date: "04-Feb-26",
		},
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
								className="h-10 w-10 text-blue-600">
								<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
								<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
								<line x1="12" y1="22.08" x2="12" y2="12" />
							</svg>
						</div>
						<div className="flex flex-col">
							<span className="text-3xl font-bold text-blue-600 leading-none">
								uzaro
							</span>
							<span className="text-[0.6rem] text-blue-400 tracking-[0.2em] font-medium">
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
					<div className="bg-[#2e5090] text-white py-1.5 px-4 text-center font-bold text-sm mb-2">
						PURCHASE ORDER
					</div>
					<div className="grid grid-cols-[100px_1fr] md:grid-cols-[1fr_auto] gap-x-2 text-xs">
						<div className="font-bold text-right">PO NO:</div>
						<div className="text-right">{poData.poNumber}</div>
						<div className="font-bold text-right">DATE :</div>
						<div className="text-right">{poData.date}</div>
					</div>
				</div>
			</div>

			{/* Company & Contact Details */}
			<div className="grid grid-cols-2 bg-[#1a365d] text-white text-[10px] font-bold p-1.5 text-center">
				<div>COMPANY DETAILS</div>
				<div>CONTACT DETAILS</div>
			</div>

			<div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
				{/* Company Details */}
				<div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-1">
					<div className="font-bold">To:</div>
					<div>{poData.company.to}</div>
					<div className="font-bold">Address:</div>
					<div>{poData.company.address}</div>
				</div>

				{/* Contact Details */}
				<div className="grid grid-cols-[110px_1fr_110px_1fr] gap-x-2 gap-y-1">
					<div className="font-bold">Name:</div>
					<div>{poData.contact.name}</div>
					<div className="font-bold whitespace-nowrap">Contact Number :</div>
					<div>{poData.contact.contactNumber}</div>

					<div className="font-bold">Designation:</div>
					<div>{poData.contact.designation}</div>
					<div className="font-bold whitespace-nowrap">Contact Mobile:</div>
					<div>{poData.contact.contactMobile}</div>

					<div className="font-bold">Department:</div>
					<div>{poData.contact.department}</div>
					<div className="font-bold">Email:</div>
					<div>{poData.contact.email}</div>
				</div>
			</div>

			{/* Correcting grid for Shipped To row header based on image better viewing */}
			<div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-[#1a365d] text-white text-[10px] font-bold p-1.5 text-center">
				<div className="text-left pl-4">SHIPPED TO</div>
				<div>REQUISITIONER</div>
				<div>DESIGNATION</div>
				<div>DEPARTMENT</div>
			</div>

			<div className="grid grid-cols-[2fr_1fr_1fr_1fr] p-2 text-xs text-center items-center">
				<div className="text-left pl-4">{poData.shippedTo}</div>
				<div>{poData.requisitioner}</div>
				<div>{poData.reqDesignation}</div>
				<div>{poData.reqDepartment}</div>
			</div>

			{/* Terms */}
			<div className="grid grid-cols-4 bg-[#1a365d] text-white text-[10px] font-bold p-1.5 text-center mt-2">
				<div>TERMS</div>
				<div>LEAD TIME</div>
				<div>AVAILABILITY</div>
				<div>DELIVERY</div>
			</div>
			<div className="grid grid-cols-4 p-2 text-xs text-center border-b">
				<div>{poData.terms}</div>
				<div>{poData.leadTime}</div>
				<div>{poData.availability}</div>
				<div>{poData.delivery}</div>
			</div>

			{/* Items Table */}
			<div className="bg-[#1a365d] text-white text-[10px] font-bold p-1.5 grid grid-cols-[50px_50px_100px_1fr_100px_120px] text-center mt-4">
				<div>QTY</div>
				<div>UNIT</div>
				<div>ITEM CODE</div>
				<div>DESCRIPTION</div>
				<div>UNIT PRICE</div>
				<div>TOTAL</div>
			</div>

			<div className="min-h-[150px]">
				{poData.items.map((item, index) => (
					<div
						key={index}
						className="grid grid-cols-[50px_50px_100px_1fr_100px_120px] text-xs py-4 px-2 text-center items-start">
						<div>{item.qty}</div>
						<div>{item.unit}</div>
						<div>{item.itemCode}</div>
						<div className="text-left px-2">{item.description}</div>
						<div className="text-right pr-2">₱ {item.unitPrice}</div>
						<div className="text-right pr-2">{item.total}</div>
					</div>
				))}
			</div>

			{/* Totals */}
			<div className="flex flex-col items-end pr-4 not-italic space-y-2 mb-8">
				<div className="flex gap-4 text-xs font-bold">
					<span className="w-48 text-right">SUB-TOTAL</span>
					<span className="w-4">₱</span>
					<span className="w-48 text-right">{poData.subTotal}</span>
				</div>
				<div className="flex gap-4 text-sm font-bold">
					<span className="w-48 text-right">TOTAL VAT-INC</span>
					<span className="w-4">₱</span>
					<span className="w-48 text-right">{poData.totalVatInc}</span>
				</div>
			</div>

			{/* Signatures */}
			<div className="grid grid-cols-2 gap-12 px-16 pb-12 mt-8">
				<div className="flex flex-col items-center">
					<div className="h-12 w-full flex items-end justify-center relative">
						{/* Mock Signature Component or Image could go here */}
						<div className="absolute bottom-2 font-dancing-script text-2xl rotate-[-5deg]">
							{/* Placeholder for Signature */}
						</div>
						<div className="z-10 text-sm font-medium">{poData.checkedBy.name}</div>
					</div>
					<div className="w-full border-t border-black mt-1"></div>
					<div className="text-[10px] font-bold mt-1">CHECKED BY:</div>
					<div className="text-xs font-bold text-[#1a365d] mt-2">
						{poData.checkedBy.title}
					</div>
					<div className="mt-6 w-3/4 border-b border-black"></div>
					<div className="text-xs mt-1">{poData.checkedBy.date}</div>
					<div className="text-[10px]">DATE PROCESSED</div>
				</div>

				<div className="flex flex-col items-center">
					<div className="h-12 w-full flex items-end justify-center relative">
						<div className="z-10 text-sm font-medium">{poData.approvedBy.name}</div>
					</div>
					<div className="w-full border-t border-black mt-1"></div>
					<div className="text-[10px] font-bold mt-1">APPROVED BY:</div>
					<div className="text-xs font-bold text-[#1a365d] mt-2">
						{poData.approvedBy.title}
					</div>
					<div className="mt-6 w-3/4 border-b border-black"></div>
					<div className="text-xs mt-1">{poData.approvedBy.date}</div>
					<div className="text-[10px]">DATE APPROVED</div>
				</div>
			</div>
		</div>
	);
}
