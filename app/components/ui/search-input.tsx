import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onClear?: () => void;
	placeholder?: string;
	className?: string;
	inputClassName?: string;
}

export function SearchInput({
	value,
	onChange,
	onClear,
	placeholder = "Search...",
	className,
	inputClassName,
}: SearchInputProps) {
	const handleClear = () => {
		if (onClear) {
			onClear();
		} else {
			// Create a synthetic event with empty value
			const syntheticEvent = {
				target: { value: "" },
			} as ChangeEvent<HTMLInputElement>;
			onChange(syntheticEvent);
		}
	};

	return (
		<div className={cn("relative", className)}>
			<Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
			<Input
				type="search"
				placeholder={placeholder}
				className={cn(
					"pl-8 pr-8 w-[200px] lg:w-[280px] bg-white border-input [&::-webkit-search-cancel-button]:hidden",
					inputClassName,
				)}
				value={value}
				onChange={onChange}
			/>
			{value && (
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
					onClick={handleClear}>
					<X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
					<span className="sr-only">Clear search</span>
				</Button>
			)}
		</div>
	);
}
