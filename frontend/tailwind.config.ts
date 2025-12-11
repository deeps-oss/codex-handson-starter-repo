import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx,json}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ocean: '#0F4C75',
        sand: '#F2E9E4',
        stone: '#1B262C',
        accent: '#FFD166'
      }
    }
  },
  plugins: []
};

export default config;
