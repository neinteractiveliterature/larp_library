import type { TagCategoryData } from '../../projectData';

const DEFAULT_COLOR = '#777777';
const DEFAULT_ICON = 'tag';

/** The brightness of a "#rrggbb" color from 0 to 1, weighted the way the Ruby `color` gem does (what Rails used); null if it isn't one */
function brightness(color: string): number | null {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
  if (!match) {
    return null;
  }
  const [red, green, blue] = [match[1], match[2], match[3]].map((channel) => parseInt(channel, 16) / 255);
  return 0.299 * red + 0.587 * green + 0.114 * blue;
}

/**
 * A tag category as pages show it: with a color and icon filled in for categories that were never given one, and a text
 * color that's readable against the background.
 */
export function tagCategoryData(category: {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
}): TagCategoryData {
  const requestedColor = category.color ?? DEFAULT_COLOR;
  // (Rails only checked that a color was six letters or digits, so an unparseable one is possible; treat it as unset)
  const color = brightness(requestedColor) == null ? DEFAULT_COLOR : requestedColor;

  return {
    id: category.id,
    name: category.name,
    color,
    textColor: brightness(color)! > 0.5 ? '#000000' : '#ffffff',
    icon: category.icon ?? DEFAULT_ICON,
  };
}
