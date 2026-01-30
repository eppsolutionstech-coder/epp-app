import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinancerHeaderProps {
	onToggleSidebar: () => void;
}

export function FinancerHeader({ onToggleSidebar }: FinancerHeaderProps) {
	return (
		<header className="flex h-16 items-center gap-4 border-b bg-background pl-3 pr-6">
			<Button
				variant="ghost"
				size="icon"
				className="cursor-pointer"
				onClick={onToggleSidebar}>
				<Menu className="h-6 w-6" />
			</Button>
			<div className="ml-auto flex items-center gap-4">
				<div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-medium text-emerald-600">
					FN
				</div>
			</div>
		</header>
	);
}
