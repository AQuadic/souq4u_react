# ProductList Component

## Overview

`ProductList` is a unified, highly flexible React component for displaying product grids across the application. It consolidates functionality previously duplicated across multiple components (`OurProducts`, `DiscountedProducts`, `YouMayBeInterestedIn`, and recommended products sections).

## Features

- **Flexible Theming**: Complete control over styling via theme configuration
- **Dynamic Filtering**: Client-side product filtering with custom functions
- **Query Configuration**: Full control over API parameters
- **Loading States**: Built-in skeleton loading with configurable count
- **Error Handling**: Customizable error and empty states
- **Responsive Design**: Mobile-first responsive grid layouts
- **Translation Support**: Full i18n support via next-intl
- **React Query Integration**: Automatic caching and data management
- **RTL Support**: Built-in right-to-left language support

## Installation

The component is part of the products feature slice:

```typescript
import ProductList from "@/features/products/components/ProductList";
// or
import { ProductList } from "@/features/products/components";
```

## Basic Usage

### Simple Product List

```tsx
<ProductList
  titleKey="title"
  queryParams={{
    sort_by: "updated_at",
    sort_order: "desc",
  }}
/>
```

### With Custom Title and Max Items

```tsx
<ProductList
  title="Featured Products"
  maxItems={4}
  titleAlign="left"
  queryParams={{
    is_featured: 1,
  }}
/>
```

## Props API

### Core Props

| Prop            | Type                            | Default    | Description                             |
| --------------- | ------------------------------- | ---------- | --------------------------------------- |
| `title`         | `string`                        | -          | Custom title text (overrides titleKey)  |
| `titleKey`      | `string`                        | `"title"`  | Translation key for the title           |
| `titleAlign`    | `"center" \| "left" \| "right"` | `"center"` | Title text alignment                    |
| `maxItems`      | `number`                        | -          | Maximum number of products to display   |
| `skeletonCount` | `number`                        | `8`        | Number of skeleton items during loading |
| `showTopRated`  | `boolean`                       | `true`     | Show top-rated badge on product cards   |
| `showSection`   | `boolean`                       | `true`     | Wrap content in a `<section>` tag       |

### Query Configuration

| Prop                | Type                | Default        | Description                                     |
| ------------------- | ------------------- | -------------- | ----------------------------------------------- |
| `queryParams`       | `GetProductsParams` | `{}`           | API query parameters                            |
| `queryKey`          | `string[]`          | Auto-generated | React Query cache key                           |
| `excludeProductIds` | `number[]`          | -              | Exclude specific product IDs from results       |
| `onlyFeatured`      | `boolean`           | -              | Only show featured products (is_featured === 1) |
| `onlyDiscounted`    | `boolean`           | -              | Only show products with active discounts        |

### Button Configuration

| Prop             | Type             | Default             | Description                               |
| ---------------- | ---------------- | ------------------- | ----------------------------------------- |
| `viewAllLink`    | `string \| null` | `"/products"`       | Link for "View All" button (null to hide) |
| `viewAllText`    | `string`         | -                   | Custom button text                        |
| `viewAllTextKey` | `string`         | `"viewAllProducts"` | Translation key for button                |

### Custom States

| Prop               | Type              | Default        | Description                     |
| ------------------ | ----------------- | -------------- | ------------------------------- |
| `emptyMessage`     | `string`          | -              | Custom empty state message      |
| `emptyMessageKey`  | `string`          | `"noProducts"` | Translation key for empty state |
| `loadingComponent` | `React.ReactNode` | -              | Custom loading component        |
| `errorComponent`   | `React.ReactNode` | -              | Custom error component          |

### Theme Configuration

| Prop    | Type               | Default       | Description         |
| ------- | ------------------ | ------------- | ------------------- |
| `theme` | `ProductListTheme` | Default theme | Custom theme object |

## Theme Object

```typescript
interface ProductListTheme {
  containerClassName?: string; // Section wrapper classes
  titleClassName?: string; // Title styling
  gridClassName?: string; // Grid layout classes
  gapClassName?: string; // Grid gap classes
  errorClassName?: string; // Error message styling
  buttonClassName?: string; // Button styling
  buttonIconClassName?: string; // Button icon wrapper
}
```

### Default Theme Values

```typescript
{
  containerClassName: "container md:py-[88px] py-8",
  titleClassName: "text-main md:text-[32px] text-2xl font-normal leading-[100%] uppercase font-anton-sc",
  gridClassName: "xl:grid-cols-4 md:grid-cols-2 grid-cols-1",
  gapClassName: "gap-6",
  errorClassName: "text-center text-main mt-8",
  buttonClassName: "flex items-center justify-center gap-2 md:w-[255px] w-[188px] h-14 bg-main rounded-[8px] text-[#FDFDFD] md:text-lg text-base font-bold leading-[100%]",
  buttonIconClassName: "md:flex hidden rtl:rotate-180"
}
```

## Query Parameters

Available `GetProductsParams` options:

```typescript
interface GetProductsParams {
  q?: string; // Search query
  sort_by?: "id" | "price" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
  only_discount?: boolean; // Only discounted products
  pagination?: boolean; // Enable pagination
  category_id?: number; // Filter by category
  min_price?: number; // Minimum price filter
  max_price?: number; // Maximum price filter
  is_featured?: boolean | number; // Featured products only
}
```

## Advanced Examples

### Discounted Products with Custom Theme

```tsx
<ProductList
  titleKey="discountedProducts"
  titleAlign="center"
  queryParams={{
    sort_by: "updated_at",
    sort_order: "desc",
    only_discount: true,
  }}
  onlyDiscounted={true}
  theme={{
    titleClassName: "text-red-500 text-3xl font-bold",
    gridClassName: "lg:grid-cols-3 md:grid-cols-2 grid-cols-1",
  }}
/>
```

### Featured Products Without Section Wrapper

```tsx
<ProductList
  title="You May Be Interested In"
  titleAlign="left"
  maxItems={4}
  queryParams={{
    is_featured: 1,
    pagination: false,
  }}
  onlyFeatured={true}
  viewAllLink={null}
  showSection={false}
  theme={{
    containerClassName: "",
    titleClassName: "text-white text-xl font-semibold mb-6",
    gridClassName: "lg:grid-cols-4 grid-cols-2",
  }}
/>
```

### Category-Specific Products (Exclude Current Product)

```tsx
<ProductList
  titleKey="recommendedForYou"
  titleAlign="left"
  queryParams={{
    category_id: categoryId,
    pagination: false,
  }}
  excludeProductIds={[currentProductId]}
  viewAllLink={null}
  theme={{
    gridClassName: "xl:grid-cols-4 grid-cols-2",
  }}
/>
```

### Custom Loading State

```tsx
<ProductList
  title="Custom Products"
  queryParams={{ sort_by: "price", sort_order: "asc" }}
  loadingComponent={
    <div className="flex justify-center items-center py-20">
      <CustomSpinner />
    </div>
  }
/>
```

### With Pagination Control

```tsx
<ProductList
  titleKey="allProducts"
  maxItems={12}
  queryParams={{
    sort_by: "created_at",
    sort_order: "desc",
    pagination: true,
  }}
  viewAllLink="/products"
/>
```

## Migration Guide

### From OurProducts

**Before:**

```tsx
<OurProducts />
```

**After:**

```tsx
<ProductList
  titleKey="title"
  queryParams={{
    sort_by: "updated_at",
    sort_order: "desc",
  }}
  theme={{
    gridClassName: "xl:grid-cols-4 grid-cols-2",
  }}
/>
```

### From DiscountedProducts

**Before:**

```tsx
<DiscountedProducts />
```

**After:**

```tsx
<ProductList
  titleKey="discountedProducts"
  queryParams={{
    sort_by: "updated_at",
    sort_order: "desc",
    only_discount: true,
  }}
  onlyDiscounted={true}
/>
```

### From YouMayBeInterestedIn

**Before:**

```tsx
<YouMayBeInterestedIn title="Featured" maxItems={4} />
```

**After:**

```tsx
<ProductList
  title="Featured"
  maxItems={4}
  titleAlign="left"
  queryParams={{ is_featured: 1 }}
  onlyFeatured={true}
  viewAllLink={null}
  showSection={false}
  theme={{
    titleClassName: "text-white text-xl font-semibold mb-6",
    gridClassName: "lg:grid-cols-4 grid-cols-2",
  }}
/>
```

## Best Practices

1. **Use Semantic Query Keys**: Always provide meaningful query keys for better React Query cache management
2. **Filter on Server When Possible**: Use API parameters instead of client-side filtering for better performance
3. **Client-Side Filtering**: Use `onlyFeatured`, `onlyDiscounted`, and `excludeProductIds` props for simple client-side filtering
4. **Consistent Theming**: Create theme constants for reuse across similar sections
5. **Translation Keys**: Use translation keys instead of hardcoded text for i18n support
6. **Accessibility**: Ensure titles are semantic and descriptive
7. **Performance**: Use `maxItems` to limit renders on large datasets

## Filtering Options

The component provides three built-in filtering props to avoid passing functions (which can't be serialized):

- **`excludeProductIds`**: Array of product IDs to exclude from results (useful for "recommended" sections)
- **`onlyFeatured`**: Boolean to show only featured products (where `is_featured === 1`)
- **`onlyDiscounted`**: Boolean to show only products with active discounts

These filters are applied client-side after fetching data, so use API query parameters when possible for better performance.

## Performance Considerations

- Uses React Query for automatic caching and deduplication
- Renders skeleton states during loading to prevent layout shifts
- Applies filters after data fetching to minimize API calls
- Memoizes theme configuration to prevent unnecessary re-renders

## Accessibility

- Semantic HTML with proper heading hierarchy
- RTL language support built-in
- Keyboard navigation support through ProductCard
- ARIA labels inherited from child components

## Browser Support

Works on all modern browsers supporting:

- ES6+ JavaScript
- CSS Grid
- Flexbox
- CSS Custom Properties (for theming)

## Dependencies

- `react` & `react-dom`
- `next-intl` (translations)
- `@tanstack/react-query` (data fetching)
- `next/link` (routing)
- Custom components:
  - `ProductCard`
  - `Skeleton` (from UI library)
  - `Arrow` icon

## Related Components

- `ProductCard` - Individual product display
- `OurProducts` - Wrapper component using ProductList
- `DiscountedProducts` - Wrapper component using ProductList
- `YouMayBeInterestedIn` - Wrapper component using ProductList

## Troubleshooting

### Products not loading

- Check `queryParams` are valid
- Verify API endpoint is accessible
- Check React Query devtools for error details

### Theme not applying

- Ensure theme properties match `ProductListTheme` interface
- Check CSS specificity conflicts
- Verify Tailwind classes are not purged

### Filter not working

- Ensure `filterProducts` returns an array
- Check filter logic doesn't mutate original array
- Verify products exist before filtering

## License

Part of the OBranchy Next.js application. All rights reserved.
