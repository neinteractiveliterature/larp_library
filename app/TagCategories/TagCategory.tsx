import type { JSX } from 'react';
import Tag, { TagProps } from '~/Tags/Tag';

/** What a tag category badge needs: satisfied by both the server loaders' plain data and the GraphQL fragments */
export type TagCategoryLike = {
  id: string | number;
  name: string;
  color?: string | null;
  textColor?: string | null;
  icon?: string | null;
};

export type TagCategoryProps = Omit<TagProps, 'tag'> & {
  tagCategory: TagCategoryLike;
};

export default function TagCategory({ tagCategory, ...otherProps }: TagCategoryProps): JSX.Element {
  return (
    <Tag
      tag={{
        id: tagCategory.id,
        name: tagCategory.name,
        tagCategory: tagCategory,
      }}
      {...otherProps}
    />
  );
}
