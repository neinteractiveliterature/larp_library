import { pixelBasedPreset, type TailwindConfig } from '@react-email/components';

// react-email's <Tailwind> wrapper needs its own config object; the site itself uses Bootstrap, so these are the few
// Bootstrap-matching tokens the emails need. Email clients don't reliably load web fonts, so the font stacks are safe
// system fallbacks. pixelBasedPreset swaps Tailwind's rem-based scale for px, since several email clients (Outlook
// chief among them) don't support rem units.
export const emailTheme: TailwindConfig = {
  theme: {
    extend: {
      ...pixelBasedPreset.theme?.extend,
      colors: {
        primary: '#0d6efd',
        'light-grey': 'rgb(244, 245, 246)',
        'almost-black': 'rgb(33, 37, 41)',
      },
      fontFamily: {
        'sans-serif': ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
};
