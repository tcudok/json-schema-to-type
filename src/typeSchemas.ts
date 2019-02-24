import { JsonSchema } from './schema';

export type StringSchema = {
  type: 'string';
};

export type NumberSchema = {
  type: 'number';
};

export type IntegerSchema = {
  type: 'integer';
};

export type BooleanSchema = {
  type: 'boolean';
};

export type ObjectSchema<
  TProps extends ObjectSchemaProperties = ObjectSchemaProperties
> = {
  type: 'object';
  properties?: TProps;
  required?: (keyof TProps)[];
};

export type ObjectSchemaProperties = {
  [key: string]: JsonSchema;
};

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
export type ArraySchema<TItems extends ArraySchemaItems = ArraySchemaItems> = {
  type: 'array';
  default?: TItems;

  items?: TItems; // TODO: allow a single JsonSchema

  additionalItems?: boolean; // JsonSchema | boolean;
  uniqueItems?: boolean;
  // contains?: JsonSchema;
};

// // https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface ArraySchemaItems extends Array<JsonSchema> {}

export type NullSchema = {
  type: 'null';
};
