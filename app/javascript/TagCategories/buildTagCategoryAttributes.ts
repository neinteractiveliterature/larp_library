import { TagCategoryFormFieldsProps } from './TagCategoryFormFields';
import { TagCategoryAttributes } from '../graphqlTypes.generated';

export default function buildTagCategoryAttributes(
  tagCategory: TagCategoryFormFieldsProps['tagCategory'],
): TagCategoryAttributes {
  return {
    name: tagCategory.name,
    color: tagCategory.color,
    icon: tagCategory.icon,
  };
}
