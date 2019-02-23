import { SchemaCommon } from './common';
import { JsonSchema } from '../schema';

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
export type ArraySchema<
  TItems extends SchemaArray = SchemaArray
> = SchemaCommon & {
  type: 'array';
  default?: TItems;
  examples?: TItems;

  items?: TItems; // TODO: allow a single JsonSchema

  additionalItems?: boolean; // JsonSchema | boolean;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  // contains?: JsonSchema;
};

// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface SchemaArray extends Array<JsonSchema> {}
