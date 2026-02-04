import { useNavigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";

import { PAGE_TITLES } from "~/config/page-titles";
import { CatalogHero } from "~/components/employee/catalog-hero";
import { CategorySection } from "~/components/employee/category-section";
import { PartnerBrandsSection } from "~/components/employee/partner-brands-section";
import { supplierProductList } from "~/components/employee/supplier-product-list";
import type { Route } from "./+types/landing";
import { useGetsuppliers } from "~/hooks/use-supplier";

import { LoanTypesSection } from "~/components/employee/loan-types-section";

export function meta({}: Route.MetaArgs) {
	return [{ title: PAGE_TITLES.landing }];
}

export default function LandingPage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	// Fetch suppliers for filter
	const { data: suppliersResponse } = useGetsuppliers({
		limit: 10,
		fields: "id, name, items",
	});

	const suppliers = suppliersResponse?.suppliers || [];

	return (
		<div className="space-y-6 pb-20">
			<CatalogHero />
			<CategorySection />
			<PartnerBrandsSection />
			<supplierProductList suppliers={suppliers} />
			<LoanTypesSection />
		</div>
	);
}

