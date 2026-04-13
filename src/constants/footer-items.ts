import {
  BookOpen,
  Info,
  HelpCircle,
  Mail,
  ShieldCheck,
  ScrollText,
  LayoutDashboard,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export interface FooterLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export interface FooterConfig {
  brand: {
    name: string;
    tagline: string;
  };
  columns: FooterColumn[];
  social: {
    label: string;
    href: string;
    // SVG path data for the icon
    icon: string;
  }[];
  legal: string;
}

export const footerConfig: FooterConfig = {
  brand: {
    name: "ASMA Academy",
    tagline:
      "ASMA Academy - Maths Masters, online learning, mathematics, interactive lessons, practice exercises, expert guidance, academic goals. Built on the CAPS curriculum.",
  },

  columns: [
    {
      heading: "Learn",
      links: [
        { label: "All courses", href: "/courses", icon: BookOpen },
        {
          label: "Student dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        { label: "Enrol now", href: "/sign-up", icon: GraduationCap },
      ],
    },
    {
      heading: "Academy",
      links: [
        { label: "About us", href: "/about", icon: Info },
        { label: "Contact us", href: "/contact", icon: Mail },
        { label: "Help centre", href: "/help", icon: HelpCircle },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy policy", href: "/privacy", icon: ShieldCheck },
        { label: "Terms of use", href: "/terms", icon: ScrollText },
      ],
    },
  ],

  social: [
    {
      label: "Facebook",
      href: "https://facebook.com",
      icon: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    },
    {
      label: "Instagram",
      href: "https://instagram.com",
      icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    },
    {
      label: "WhatsApp",
      href: "https://wa.me",
      icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
    },
  ],

  legal: "ASMA Academy. All rights reserved.",
};
