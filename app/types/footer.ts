/* ── จาก app/data/footerMockData.ts ── */

export interface FooterNavLink {
  label: string;
  href: string;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterNavLink[];
}

export interface FooterSocialIcon {
  label: string;
  href: string;
  icon:
    | "telegram"
    | "x"
    | "discord"
    | "instagram"
    | "youtube"
    | "line"
    | "medium"
    | "linkedin"
    | "reddit"
    | "tiktok";
}

/** โลโก้ธนาคาร/ช่องทางชำระ — footer desktop (public/assets/bank-logo) */
export interface FooterPaymentBank {
  id: string;
  name: string;
  logoSrc: string;
}
