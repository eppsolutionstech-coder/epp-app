import { useNavigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";

import { PAGE_TITLES } from "~/config/page-titles";
import { CatalogHero } from "~/components/employee/catalog-hero";
import { CategorySection } from "~/components/employee/category-section";
import { PartnerBrandsSection } from "~/components/employee/partner-brands-section";
import { VendorProductList } from "~/components/employee/vendor-product-list";
import type { Route } from "./+types/landing";
import { useGetVendors } from "~/hooks/use-vendor";

import { LoanTypesSection } from "~/components/employee/loan-types-section";

export function meta({}: Route.MetaArgs) {
	return [{ title: PAGE_TITLES.landing }];
}

export default function LandingPage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	// Fetch vendors for filter
	const { data: vendorsResponse } = useGetVendors({
		limit: 10,
		fields: "id, name, items",
	});

	const vendors = vendorsResponse?.vendors || [];

	return (
		<div className="space-y-6 pb-20">
			<CatalogHero />
			<CategorySection />
			<PartnerBrandsSection />
			<VendorProductList vendors={vendors} />
			<LoanTypesSection />
		</div>
	);
}
