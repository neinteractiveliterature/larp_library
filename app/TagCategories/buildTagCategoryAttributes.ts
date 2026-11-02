import type { TagCategoryFormFieldsProps } from './TagCategoryFormFields';

/** What the form sends to the server for a tag category */
export default function buildTagCategoryAttributes(tagCategory: TagCategoryFormFieldsProps['tagCategory']) {
  return {
    name: tagCategory.name,
    color: tagCategory.color ?? null,
    icon: tagCategory.icon ?? null,
  };
}
