// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { tagCategoryData } from './tagDisplay';

const category = { id: 1, name: 'Genre', color: null, icon: null };

describe('tagCategoryData', () => {
  it('fills in the default color and icon for a category without them', () => {
    expect(tagCategoryData(category)).toEqual({
      id: 1,
      name: 'Genre',
      color: '#777777',
      textColor: '#ffffff',
      icon: 'tag',
    });
  });

  it('keeps the color and icon a category was given', () => {
    expect(tagCategoryData({ ...category, color: '#3366cc', icon: 'star-fill' })).toMatchObject({
      color: '#3366cc',
      icon: 'star-fill',
    });
  });

  // The expected values here are what Rails' Color::RGB#brightness produced for the same colors
  it.each([
    ['#777777', '#ffffff'],
    ['#7f7f7f', '#ffffff'],
    ['#808080', '#000000'],
    ['#ffff00', '#000000'],
    ['#00ff00', '#000000'],
    ['#ffffff', '#000000'],
    ['#0000ff', '#ffffff'],
    ['#ff0000', '#ffffff'],
    ['#3366cc', '#ffffff'],
    ['#000000', '#ffffff'],
    ['#FFFF00', '#000000'],
  ])('picks the text color for %s', (color, textColor) => {
    expect(tagCategoryData({ ...category, color }).textColor).toEqual(textColor);
  });

  it('treats a color that is not a six-digit hex color as unset', () => {
    expect(tagCategoryData({ ...category, color: '#zzzzzz' })).toMatchObject({
      color: '#777777',
      textColor: '#ffffff',
    });
  });
});
