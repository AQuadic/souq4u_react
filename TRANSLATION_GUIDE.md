# Translation Quick Reference Guide

## Adding Translations to a New Component

### 1. Import the hook

```tsx
import { useTranslation } from "react-i18next";
```

### 2. Use in your component

```tsx
const MyComponent = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language; // 'en' or 'ar'

  return <button>{t("Common.submit")}</button>;
};
```

### 3. Add translation keys

Add to `/public/locales/en/translation.json`:

```json
{
  "MyFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}
```

Add to `/public/locales/ar/translation.json`:

```json
{
  "MyFeature": {
    "title": "ميزتي",
    "description": "هذه ميزتي"
  }
}
```

## Common Translation Patterns

### Simple Text

```tsx
<h1>{t("Products.title")}</h1>
// Result (EN): "Products"
// Result (AR): "المنتجات"
```

### With Variables (Interpolation)

```tsx
<p>{t("Cart.saveOffer", { amount: 10, currency: "EGP", percent: 15 })}</p>
// Result (EN): "Save 10 EGP (15% off)"
// Result (AR): "وفر 10 ج.م (15% خصم)"
```

Translation key in JSON:

```json
"saveOffer": "Save {amount} {currency} ({percent}% off)"
```

### Form Placeholders

```tsx
<input placeholder={t("Contact.namePlaceholder")} />
```

### Conditional Text

```tsx
<button>{loading ? t("Common.loading") : t("Common.submit")}</button>
```

### Alt Text for Images

```tsx
<img alt={t("HomeTryApp.googlePlayAlt")} src="/google-play.png" />
```

## Accessing Current Language

```tsx
const { i18n } = useTranslation();
const currentLanguage = i18n.language; // 'en' or 'ar'
const isArabic = currentLanguage === "ar";
```

## Changing Language

```tsx
const { i18n } = useTranslation();

const switchLanguage = () => {
  const newLang = i18n.language === "en" ? "ar" : "en";
  i18n.changeLanguage(newLang);
};
```

## Translation Key Namespaces

| Namespace      | Purpose                    | Example Keys                                    |
| -------------- | -------------------------- | ----------------------------------------------- |
| `Common.*`     | Buttons, labels, common UI | `Common.loading`, `Common.save`                 |
| `Navigation.*` | Menu items                 | `Navigation.home`, `Navigation.products`        |
| `Products.*`   | Product pages              | `Products.addToCart`, `Products.outOfStock`     |
| `Cart.*`       | Shopping cart              | `Cart.emptyCart`, `Cart.checkout`               |
| `Auth.*`       | Login, signup              | `Auth.login`, `Auth.welcome`                    |
| `Contact.*`    | Contact form               | `Contact.name`, `Contact.submit`                |
| `Footer.*`     | Footer sections            | `Footer.explore`, `Footer.help`                 |
| `Profile.*`    | User profile               | `Profile.account`, `Profile.orders`             |
| `Checkout.*`   | Checkout flow              | `Checkout.paymentMethod`, `Checkout.placeOrder` |

## Best Practices

### ✅ DO

```tsx
// Use descriptive key names
{
  t("Products.addToCart");
}

// Keep translation logic in component
const buttonText = loading ? t("Common.loading") : t("Common.submit");

// Use interpolation for dynamic content
{
  t("Cart.itemCount", { count: items.length });
}
```

### ❌ DON'T

```tsx
// Don't hardcode text
<button>Add to Cart</button>;

// Don't concatenate translated strings
{
  t("Products.price") + " " + price;
} // ❌

// Instead use interpolation
{
  t("Products.priceAmount", { amount: price });
} // ✅
```

## RTL Support

Arabic language automatically switches the direction to RTL (Right-to-Left). The i18n configuration handles this:

```tsx
// In i18n.ts
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});
```

## Debugging

### Check if translation is loading:

```tsx
const { t, ready } = useTranslation();

if (!ready) return <div>Loading translations...</div>;
```

### See which key is being used:

```tsx
// In development, you can log the key
console.log(t("Products.title")); // Shows actual translation
```

### Check current language:

```tsx
const { i18n } = useTranslation();
console.log("Current language:", i18n.language);
console.log("Supported languages:", i18n.languages);
```

## Testing Translations

### Manual Testing

1. Switch language using the language switcher in header
2. Verify all text changes to the selected language
3. Check RTL layout for Arabic
4. Verify forms, buttons, and error messages

### Code Review Checklist

- [ ] All user-visible text uses `t()` function
- [ ] Translation keys exist in both `en` and `ar` files
- [ ] Variables in translations use interpolation
- [ ] Alt texts for images are translated
- [ ] Error messages are translated
- [ ] Form placeholders are translated

## Common Issues & Solutions

### Issue: Translation not showing

**Solution**: Check that:

1. Key exists in both translation files
2. No typos in the key name
3. Translation file is valid JSON

### Issue: Language not switching

**Solution**: Verify:

1. `useTranslation()` hook is imported
2. Language switcher calls `i18n.changeLanguage()`
3. Browser console for errors

### Issue: Arabic text not in RTL

**Solution**: Check:

1. `i18n.ts` has the language change listener
2. HTML `dir` attribute is set correctly
3. CSS doesn't override direction

## Adding New Translation Keys

1. **Identify the section**: Determine which namespace (Common, Products, etc.)
2. **Add to English file**: Add key to `/public/locales/en/translation.json`
3. **Add to Arabic file**: Add corresponding key to `/public/locales/ar/translation.json`
4. **Use in component**: Import `useTranslation` and use `t("Namespace.key")`
5. **Test both languages**: Switch language and verify

## Example: Complete Component with Translation

```tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Submit logic...
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{t("Contact.title")}</h2>

      <label htmlFor="name">{t("Contact.name")}</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("Contact.namePlaceholder")}
      />

      <button type="submit" disabled={loading}>
        {loading ? t("Contact.sending") : t("Contact.submit")}
      </button>
    </form>
  );
};

export default ContactForm;
```

## Resources

- **i18n Config**: `src/i18n.ts`
- **EN Translations**: `/public/locales/en/translation.json`
- **AR Translations**: `/public/locales/ar/translation.json`
- **Translation Summary**: `TRANSLATION_SUMMARY.md`
- **react-i18next Docs**: https://react.i18next.com/
