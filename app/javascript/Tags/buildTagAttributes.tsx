import { TagFormFieldsProps } from './TagFormFields';
import { TagAttributes } from '../graphqlTypes.generated';

export default function buildTagAttributes(tag: TagFormFieldsProps['tag']): TagAttributes {
  return {
    name: tag.name,
    tagCategoryId: tag.tagCategory?.id,
  };
}
