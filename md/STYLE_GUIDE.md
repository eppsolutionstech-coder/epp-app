# EPP App Style Guide

> **Philosophy**: Be creative while maintaining a modern and minimal aesthetic. Every design decision should serve the user experience without unnecessary complexity.

---

## Color System

Always reference `@app/app.css` for the color theme. The app uses **OKLCH color space** for perceptually uniform colors with excellent dark mode support.

### Primary Palette

| Token           | Usage                                       |
| --------------- | ------------------------------------------- |
| `--primary`     | Main brand color, CTAs, active states       |
| `--secondary`   | Supporting elements, less prominent actions |
| `--accent`      | Highlights, hover states                    |
| `--muted`       | Backgrounds, disabled states                |
| `--destructive` | Errors, delete actions, warnings            |

### Chart/Accent Colors

Use these for data visualization, status indicators, and category differentiation:

```css
--chart-1  /* Primary blue - monetary values, primary metrics */
--chart-2  /* Teal - users, growth indicators */
--chart-3  /* Lavender - volume, secondary metrics */
--chart-4  /* Cyan - time-based, pending states */
--chart-5  /* Pink - special highlights */
```

### Color Application Pattern

```tsx
// Consistent color pairing for stat cards and indicators
color: "text-chart-1";
bg: "bg-chart-1/10";
border: "border-chart-1/20";
```

---

## Typography

### Font Family

The app uses **Outfit** as the primary sans-serif font, defined in `@app/app.css`.

### Hierarchy

| Element       | Classes                                      |
| ------------- | -------------------------------------------- |
| Page Title    | `text-4xl font-bold tracking-tight`          |
| Section Title | `text-xl font-semibold`                      |
| Card Title    | `text-sm font-medium text-muted-foreground`  |
| Body Text     | `text-sm` or `text-base`                     |
| Small/Caption | `text-xs text-muted-foreground`              |
| Large Values  | `text-3xl font-bold` or `text-2xl font-bold` |

### Gradient Text (Use Sparingly)

For impactful headings:

```tsx
className = "bg-gradient-to-r from-primary to-chart-4 bg-clip-text text-transparent";
```

---

## Spacing & Layout

### Grid System

Use responsive grid layouts with consistent gaps:

```tsx
// Stats grid - 4 columns on large screens
"grid gap-6 md:grid-cols-2 lg:grid-cols-4";

// Mixed content grid - asymmetric layout
"grid gap-6 md:grid-cols-2 lg:grid-cols-7";
// Then use col-span-4 and col-span-3 for children
```

### Spacing Scale

- **Section spacing**: `space-y-8`
- **Card internal spacing**: `space-y-6` or `space-y-4`
- **Element gaps**: `gap-3`, `gap-4`, or `gap-6`
- **Tight spacing**: `space-y-1` or `space-y-2`

---

## Components

### Cards

Cards are the primary container for content. Apply subtle borders and shadows:

```tsx
// Base card
className="shadow-md border-border/50"

// Interactive stat card
className={`relative overflow-hidden border transition-all duration-200
  hover:shadow-lg hover:-translate-y-1 ${borderColor}`}
```

#### Decorative Background Icons

Add visual interest with large, faded icons:

```tsx
<div className={`absolute top-0 right-0 p-3 opacity-10 ${color} rounded-bl-full`}>
	<Icon className="h-16 w-16" />
</div>
```

### Buttons

#### Standard Actions

```tsx
<Button variant="outline" className="hover:bg-primary/5 hover:border-primary/50 transition-all duration-300">
```

#### Quick Action Buttons (Large, Icon-Focused)

```tsx
className="h-24 flex flex-col items-center justify-center gap-2
  hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
```

#### Ghost Actions

```tsx
<Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
	View all <ArrowUpRight className="ml-2 h-3 w-3" />
</Button>
```

### Badges

Use semantic colors for status indicators:

```tsx
// Approved/Success
className = "bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20";

// Pending/Warning
className = "bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-500/20";

// Use variant="destructive" for rejected/error states
```

### Avatars

Add subtle depth with rings and borders:

```tsx
className="h-10 w-10 border-2 border-background ring-2 ring-muted
  transition-transform group-hover:scale-105"
```

### Icons

#### Icon Containers

Wrap icons in colored circles for visual hierarchy:

```tsx
// Small icon in header
<div className={`p-2 rounded-full ${bg} ${color}`}>
  <Icon className="h-4 w-4" />
</div>

// Medium icon for actions
<div className={`p-2 rounded-full ${bg}`}>
  <Icon className={`h-5 w-5 ${color}`} />
</div>

// Large decorative icon
<div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
  <Icon className="h-6 w-6" />
</div>
```

### Trend Indicators

Show directional data with appropriate colors:

```tsx
// Upward trend
<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
<span className="text-green-500 font-medium">{description}</span>

// Downward trend
<TrendingDown className="mr-1 h-3 w-3 text-red-500" />
<span className="text-muted-foreground">{description}</span>
```

---

## Animations & Transitions

### Page Enter Animation

Apply to main content containers:

```tsx
className = "animate-in fade-in slide-in-from-bottom-4 duration-500";
```

### Hover Transitions

Always use smooth transitions for interactive elements:

```tsx
// Standard transition
"transition-colors";

// Transform transitions
"transition-transform group-hover:scale-105";

// All properties
"transition-all duration-200";
"transition-all duration-300";
```

### Custom Animations

Reference `@app/app.css` for:

- `.animate-scroll` - Horizontal scrolling marquee effect

---

## Special Patterns

### Highlighted Cards (CTAs, Status)

Use gradient backgrounds for important information:

```tsx
className="w-full bg-gradient-to-br from-primary/90 to-primary
  text-primary-foreground border-none shadow-lg"
```

### Group Hover Effects

Use Tailwind's group utilities for coordinated hover states:

```tsx
<div className="group">
	<Avatar className="transition-transform group-hover:scale-105" />
	<p className="group-hover:text-primary transition-colors">{name}</p>
</div>
```

### Glassmorphism Elements

For floating or overlay elements:

```tsx
className = "bg-white/20 backdrop-blur-sm";
```

---

## Utility Classes

Custom utilities defined in `@app/app.css`:

| Class                | Usage                                                  |
| -------------------- | ------------------------------------------------------ |
| `.hide-scrollbar`    | Hide scrollbars while maintaining scroll functionality |
| `.minimal-scrollbar` | Thin, subtle scrollbar                                 |
| `.neumorphism`       | Soft shadow effect (use sparingly)                     |

---

## Dark Mode

The app automatically supports dark mode via the `.dark` class. All color tokens in `@app/app.css` have dark mode variants.

**Best Practices:**

- Use CSS custom properties (not hardcoded colors)
- Test all components in both light and dark modes
- Use `/opacity` suffixes for backgrounds (e.g., `bg-chart-1/10`)

---

## Charts

All charts and data visualizations in the application **must use [Recharts](https://recharts.org/)**. This ensures consistent styling, animations, and responsive behavior across the app.

### Import

```tsx
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
```

### Best Practices

- **Always wrap charts** in `<ResponsiveContainer>` for responsive sizing.
- **Use chart colors** from the CSS variables (`--chart-1` through `--chart-5`).
- **Add tooltips** for better data accessibility.
- **Keep charts simple** – avoid clutter with too many data series.

### Example

```tsx
<ResponsiveContainer width="100%" height={300}>
	<BarChart data={data}>
		<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
		<XAxis dataKey="name" className="text-xs" />
		<YAxis className="text-xs" />
		<Tooltip />
		<Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
	</BarChart>
</ResponsiveContainer>
```

---

## Data Tables

All tables in the application should use the `DataTable` component from `@app/components/molecule/data-table-updated.tsx`. This component provides consistent styling, sorting, filtering, searching, and loading states.

### Import

```tsx
import { DataTable, type DataTableColumn } from "@/components/molecule/data-table-updated";
```

### Column Definition

Define columns with the `DataTableColumn` interface:

```tsx
const columns: DataTableColumn<YourDataType>[] = [
	{
		key: "id",
		label: "ID",
		sortable: true,
	},
	{
		key: "name",
		label: "Name",
		sortable: true,
		searchable: true,
	},
	{
		key: "status",
		label: "Status",
		filterable: true,
		filterOptions: [
			{ value: "active", label: "Active" },
			{ value: "pending", label: "Pending" },
			{ value: "inactive", label: "Inactive" },
		],
		render: (value) => <Badge className={getStatusColor(value)}>{value}</Badge>,
	},
	{
		key: "amount",
		label: "Amount",
		className: "text-right",
		render: (value) => `₱${value.toLocaleString()}`,
	},
];
```

### Column Options

| Option          | Type                        | Description                             |
| --------------- | --------------------------- | --------------------------------------- |
| `key`           | `keyof T`                   | Data field to display                   |
| `label`         | `string`                    | Column header text                      |
| `sortable`      | `boolean`                   | Enable sorting (asc/desc)               |
| `searchable`    | `boolean`                   | Enable search input                     |
| `filterable`    | `boolean`                   | Enable filter checkboxes                |
| `filterOptions` | `ColumnFilter[]`            | Filter options with `value` and `label` |
| `render`        | `(value, row) => ReactNode` | Custom cell renderer                    |
| `className`     | `string`                    | Additional cell classes                 |

### Basic Usage

```tsx
<DataTable columns={columns} data={data} onRowClick={(row) => navigate(`/details/${row.id}`)} />
```

### With Loading State

```tsx
<DataTable columns={columns} data={data} isLoading={isLoading} skeletonRowCount={5} />
```

### Features

- **URL Persistence**: Sort, filter, and search states are synced with URL params
- **Skeleton Loading**: Built-in loading states with configurable row count
- **Empty State**: Automatic "No results found" display
- **Interactive Headers**: Click column headers to access sort/search/filter controls
- **Debounced Search**: Search input has 500ms debounce to reduce API calls

### Styling

The component uses minimal styling by default. Customize with the `className` prop:

```tsx
<DataTable columns={columns} data={data} className="shadow-md border-border/50" />
```

---

## Do's and Don'ts

### Do

- Use the chart color palette for visual variety
- Add subtle hover states to all interactive elements
- Use consistent spacing from the scale
- Apply enter animations to page content
- Use icons inside colored circular containers
- Reference `@app/app.css` for all colors

### Don't

- Use hardcoded color values
- Overuse gradients (reserve for headings and CTAs)
- Skip transition effects on interactive elements
- Mix spacing values outside the scale
- Use heavy shadows (keep them subtle)
- Forget dark mode support

---

## Component Checklist

When creating new components, ensure:

- [ ] Uses colors from `@app/app.css` theme
- [ ] Has appropriate hover/focus states
- [ ] Includes smooth transitions
- [ ] Works in dark mode
- [ ] Follows spacing scale
- [ ] Uses consistent typography hierarchy
- [ ] Maintains minimal, modern aesthetic
- [ ] Adds creative touches without sacrificing usability
