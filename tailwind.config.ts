import type { Config } from "tailwindcss";
import tailwindanimate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0035C3",
          background: "var(--background)",
          foreground: "hsl(var(--foreground))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          border: "#E4E7EC",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        PennBlue: "#001652",
        PersianBlue: "#0035C3",
        CarrotOrange: "#E88B00",
        Charcoal: "#475367",
        CadetGray: "#98A2B3",
        SalteGray: "#667185",
        BrightLavender: "#E6EBF9",
        BlueHour: "#0030B1",
        IcyLilac: "#E6EBF9",
        BeeCluster: "#FFAD33",
        MidnightExpress: "#1D2739",
        BlackRiverFalls: "#344054",
        DrWhite: "#F9FAFB",
        VitaminC: "#FF9900",
        ArtistBlue: "#03363D",
        SatinWhite: "#D0D5DD",
        OfficeBrown: "#3E3838",
        MaximumYellowRed: "#F5B546",
        DreamyCloud: "#E4E7EC",
        DarkRift: "#040815",
        ChefsHat: "#F3F5F7",
        Sambucus: "#101928",
        EerieBlack: "#1B1B1B",
        Tin: "#909090",
        CheGuevaraRed: "#EC284E",
        GoldenBerylYellow: "#D7A601",
        CarpetMoss: "#00AE32",
        AlgalFuel: "#2AC670",
        FreeSpeechBlue: "#335DCF",
        DarkShadeBlue: "#0F172A",
        MediumMintGreen: "#40b869",
        FieryRed: "#d42620",
        PaleSkyBlue: "#c9e5fa",
        ForestGreen: "#036B26",
        BlushPink: "#FBEAE9",
        AmberGold: "#B56D00",
        PeachCream: "#fff5e6",
        Black: "#000000",
        SoftSkyBlue: "#bbcaf5",
        RichBlack: "#0a0d14",
        GraphiteGray: "#303030",
        CoolGray: "#9ca3af",
        SlateGray: "#525866",
        DarkRed: "#9E0A05",
        MintGreen: "#E7F6E6",
        DarkShadeGray: "#374151",
        LightGray: "#E5E7EB",
        MediumGray: "#4B5563",
        GrayishBlue: "#848897",
        RichNavy: "#0A112F",
        BlueGray: "#9094A1",
        SmokySlate: "#70707a",
        SkyBlue: "#51c6fb",
        DarkGray: "#1b1b1b",
        LightMint: "#e7f6ec",
        ThamarBlack: "#1A1919",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        heading: ["var(--font-roboto)", "sans-serif"],
      },
      screens: {
        "3xl": "2560px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slide-up": {
          from: {
            transform: "translateY(28px)",
          },
          to: {
            transform: "translateY(0)",
          },
        },
        entrance: {
          "0%": {
            transform: "scale(0)",
          },
          "20%": {
            transform: "scale(1.1)",
          },
          "40%": {
            transform: "scale(0.95)",
          },
          "60%": {
            transform: "scale(1.05)",
          },
          "80%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.5s ease-in-out",
        entrance: "entrance 1.3s ease-in-out",
      },
    },
  },
  plugins: [
    tailwindanimate,
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar": {
          "::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".ios-scrollbar": {
          "::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "::-webkit-scrollbar-thumb": {
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "3px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0, 0, 0, 0.3)",
          },
        },
      });
    }),
  ],
} satisfies Config;
