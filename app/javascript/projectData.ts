// The plain, JSON-friendly shapes the server's loaders hand to pages, which several pages share. (Browser-safe: nothing here
// imports server code.)

export type TagCategoryData = {
  id: number;
  name: string;
  /** A hex color, "#777777" for a category that was never given one */
  color: string;
  /** Black or white, whichever is readable on `color` */
  textColor: string;
  /** A Bootstrap icon name, without the "bi-" */
  icon: string;
};

export type TagData = {
  id: number;
  name: string;
  tagCategory: TagCategoryData | null;
};

/** What the cards in a list of projects show */
export type ProjectHeadersData = {
  id: number;
  title: string | null;
  authors: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  minFacilitators: number | null;
  maxFacilitators: number | null;
  publicationYear: number | null;
  lengthQuantity: number | null;
  lengthUnits: string | null;
  brand: { id: number; name: string; slug: string };
  tags: TagData[];
};
