
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#8A6FD6', // Refreshed purple
          light: '#B3A0E3',
          dark: '#6B51B8',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: '#57B5E7', // Refreshed blue
          light: '#8ACDED',
          dark: '#3C9DD0',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        tertiary: {
          DEFAULT: '#F9B572', // Warm orange
          light: '#FBCF9B',
          dark: '#F79B4B'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'none': '0px',
        DEFAULT: '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
        'button': '8px'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeInUp: 'fadeInUp 0.6s ease-out',
        scaleIn: 'scaleIn 0.4s ease-out',
        slideIn: 'slideIn 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'playfair': ['Playfair Display', 'serif'],
        'raleway': ['Raleway', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 5px 20px -5px rgba(0, 0, 0, 0.1)',
        'hover': '0 10px 40px -15px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-soft': 'linear-gradient(to right, #f6d365 0%, #fda085 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8A6FD6 0%, #B3A0E3 100%)',
        'gradient-blue': 'linear-gradient(135deg, #57B5E7 0%, #8ACDED 100%)'
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
