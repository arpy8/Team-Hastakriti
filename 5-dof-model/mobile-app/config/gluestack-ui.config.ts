import { createConfig } from "@gluestack-ui/themed";

export const config = createConfig({
  tokens: {
    colors: {
      primary: '#0f0',
      background: '#000',
      secondary: '#1c1c1c',
    },
  },
  plugins: [],
});

type ConfigType = typeof config;

declare module '@gluestack-ui/themed' {
  interface UIConfig extends ConfigType {}
}

{
    "tailwind": {
      "config": "tailwind.config.js",
      "css": "global.css"
    },
    "app": {
      "entry": "app/_layout.tsx",
      "components": "components/ui"
    }
  }