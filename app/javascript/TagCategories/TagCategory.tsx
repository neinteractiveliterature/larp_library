import Tag, { TagProps } from '../Tags/Tag';
import { TagCategoryFragment } from './TagCategoryFragment.generated';

export type TagCategoryProps = Omit<TagProps, 'tag'> & {
  tagCategory: TagCategoryFragment;
};

export default function TagCategory({ tagCategory, ...otherProps }: TagCategoryProps): JSX.Element {
  return (
    <Tag
      tag={{
        __typename: 'Tag',
        id: tagCategory.id,
        name: tagCategory.name,
        tagCategory: tagCategory,
      }}
      {...otherProps}
    />
  );
}
