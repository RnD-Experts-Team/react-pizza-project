/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)'
                },
                popover: {
                    DEFAULT: 'var(--popover)',
                    foreground: 'var(--popover-foreground)'
                },
                primary: {
                    DEFAULT: 'var(--primary)',
                    foreground: 'var(--primary-foreground)'
                },
                secondary: {
                    DEFAULT: 'var(--secondary)',
                    foreground: 'var(--secondary-foreground)'   
                },
                muted: {
                    DEFAULT: 'var(--muted)',
                    foreground: 'var(--muted-foreground)'
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'var(--accent-foreground)'
                },
                destructive: {
                    DEFAULT: 'var(--destructive)',
                    foreground: 'var(--destructive-foreground)'
                },
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                chart: {
                    '1': 'var(--chart-1)',
                    '2': 'var(--chart-2)',
                    '3': 'var(--chart-3)',
                    '4': 'var(--chart-4)',
                    '5': 'var(--chart-5)'
                },
                sidebar: {
                    DEFAULT: 'var(--sidebar-background)',
                    foreground: 'var(--sidebar-foreground)',
                    primary: 'var(--sidebar-primary)',
                    'primary-foreground': 'var(--sidebar-primary-foreground)',
                    accent: 'var(--sidebar-accent)',
                    'accent-foreground': 'var(--sidebar-accent-foreground)',
                    border: 'var(--sidebar-border)',
                    ring: 'var(--sidebar-ring)'
                },
                
                // Add futuristic colors
                futuristic: {
                    blue: {
                        DEFAULT: 'var(--futuristic-blue)',
                        light: 'var(--futuristic-blue-light)',
                        dark: 'var(--futuristic-blue-dark)'
                    },
                    purple: {
                        DEFAULT: 'var(--futuristic-purple)',
                        light: 'var(--futuristic-purple-light)',
                        dark: 'var(--futuristic-purple-dark)'
                    },
                    cyan: {
                        DEFAULT: 'var(--futuristic-cyan)',
                        light: 'var(--futuristic-cyan-light)',
                        dark: 'var(--futuristic-cyan-dark)'
                    },
                    green: {
                        DEFAULT: 'var(--futuristic-green)',
                        light: 'var(--futuristic-green-light)',
                        dark: 'var(--futuristic-green-dark)'
                    }
                },
                
                // Add orb colors for background effects
                orb: {
                    blue: 'var(--orb-blue)',
                    purple: 'var(--orb-purple)',
                    cyan: 'var(--orb-cyan)'
                }
            },
            
            // Add gradient utilities
            backgroundImage: {
                'futuristic-gradient': 'var(--gradient-primary)',
                'futuristic-hover': 'var(--gradient-hover)',
                'futuristic-text': 'var(--gradient-text)'
            },
            
            // Add backdrop blur values
            backdropBlur: {
                'glass': '12px'
            }
        }
    },
    plugins: [
        require("tailwindcss-animate")
    ],
}
