import {
  ApolloCache,
  DocumentNode,
  MutationUpdaterFn,
  Reference,
  StoreObject,
} from '@apollo/client';
import { Modifier } from '@apollo/client/cache/core/types/common';

export function addNewObjectToReferenceArrayModifier<Q, T extends { id: string }>(
  cache: ApolloCache<Q>,
  newObject: T,
  fragment: DocumentNode,
): Modifier<(Reference | undefined)[]> {
  const modifier: Modifier<(Reference | undefined)[]> = (existingObjectRefs, { readField }) => {
    const newObjectRef = cache.writeFragment({
      data: newObject,
      fragment: fragment,
    });

    if (existingObjectRefs.some((ref: Reference) => readField('id', ref) === newObject.id)) {
      return existingObjectRefs;
    }

    return [...existingObjectRefs, newObjectRef];
  };

  return modifier;
}

export function addNewObjectToReferenceArrayUpdater<Q, T extends { id: string }>(
  containingObject: Reference | StoreObject,
  fieldName: string,
  getNewObject: (data: Q) => T | undefined,
  fragment: DocumentNode,
): MutationUpdaterFn<Q> {
  const updater: MutationUpdaterFn<Q> = (cache, result) => {
    const data = result.data;

    if (data) {
      const newObject = getNewObject(data);
      if (newObject) {
        cache.modify({
          id: cache.identify(containingObject),
          fields: {
            [fieldName]: addNewObjectToReferenceArrayModifier(cache, newObject, fragment),
          },
        });
      }
    }
  };

  return updater;
}

export function deleteObjectFromReferenceArrayModifier<T extends { id: string }>(
  deletedObject: T,
): Modifier<Reference[]> {
  const modifier: Modifier<Reference[]> = (existingObjectRefs, { readField }) => {
    return existingObjectRefs.filter(
      (existingObjectRef: Reference) => deletedObject.id !== readField('id', existingObjectRef),
    );
  };

  return modifier;
}

export function deleteObjectFromReferenceArrayUpdater<Q, T extends { id: string }>(
  containingObject: Reference | StoreObject,
  fieldName: string,
  deletedObject: T,
): MutationUpdaterFn<Q> {
  const updater: MutationUpdaterFn<Q> = (cache) => {
    cache.modify({
      id: cache.identify(containingObject),
      fields: {
        [fieldName]: deleteObjectFromReferenceArrayModifier(deletedObject),
      },
    });
  };
  return updater;
}
