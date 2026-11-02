import type { TagFormFieldsProps } from '~/components/tags/TagFormFields';

/** What the form sends to the server for a tag */
export default function buildTagAttributes(tag: TagFormFieldsProps['tag']) {
  return {
    name: tag.name,
    tagCategoryId: tag.tagCategory?.id ?? null,
  };
}
