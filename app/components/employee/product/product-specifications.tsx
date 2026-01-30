interface ProductSpecificationsProps {
	specifications: Record<string, unknown>;
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
	if (!specifications || Object.keys(specifications).length === 0) {
		return null;
	}

	return (
		<div className="space-y-3">
			<h3 className="font-medium">Specifications</h3>
			<div className="grid gap-2">
				{Object.entries(specifications).map(([key, value]) => (
					<div
						key={key}
						className="flex justify-between py-2 border-b border-dashed last:border-0">
						<span className="text-muted-foreground capitalize">
							{key.replace(/_/g, " ")}
						</span>
						<span className="font-medium">
							{Array.isArray(value) ? value.join(", ") : String(value)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
