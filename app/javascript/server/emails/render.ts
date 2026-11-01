import { render } from '@react-email/render';
import type { ReactElement } from 'react';

export type RenderedEmail = {
  html: string;
  text: string;
};

// Pure rendering: takes a React element, returns html and text, and knows nothing about transports or config.
export async function renderEmail(element: ReactElement): Promise<RenderedEmail> {
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { html, text };
}
