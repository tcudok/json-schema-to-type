import { SchemaCommon } from './common';
import { Schema } from '..';

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
export type ArraySchema<
  TItems extends SchemaArray = SchemaArray
> = SchemaCommon & {
  type: 'array';
  default?: TItems;
  examples?: TItems;

  items?: TItems; // TODO: allow single Schema if all items are of the same type

  additionalItems?: boolean; // Schema | boolean;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  // contains?: Schema;
};

// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface SchemaArray extends Array<Schema> {}
