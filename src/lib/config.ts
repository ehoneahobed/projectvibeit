type SiteConfig = {
  name: string
  description: string
  url: string
  authors: { name: string; url: string }[]
  og: string
  themeColors: {
    light: string
    dark: string
  }
}

export const siteConfig: SiteConfig = {
  name: "VibeIt",
  description: "Master AI-assisted coding with step-by-step lessons and hands-on projects. From zero to hero, completely free.",
  url: "https://vibeit.com",
  authors: [
    { name: "Gideon Ofori Addo", url: "https://github.com/wuzgood98" },
    { name: "Obed Ehoneah", url: "https://github.com/ehoneahobed" },
  ],
  og: "https://vibeit.com/og.png",
  themeColors: {
    light: "#0C6075",
    dark: "#0A4F61",
  },
}
