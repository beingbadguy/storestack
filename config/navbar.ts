export type NavbarLink = {
  label: string;
  href: string;
};

export const DEFAULT_BRAND_NAME = "Vogue.";

export const DEFAULT_NAV_LINKS: NavbarLink[] = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Products", href: "/products" },
  { label: "Track Order", href: "/track-order" },
  { label: "Contact Us", href: "/contact" },
];

export type NavbarProps = {
  brandName?: string;
  links?: NavbarLink[];
};
