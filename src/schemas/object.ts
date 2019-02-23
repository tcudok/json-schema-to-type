import { SchemaCommon } from './common';
import { JsonSchema } from '../schema';
import { StringSchema } from './string';

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
export type ObjectSchema<
  TProps extends SchemaProperties = SchemaProperties
> = SchemaCommon & {
  type: 'object';
  properties?: TProps;
  required?: (keyof TProps)[];
  default?: object; // TODO: get actual type
  examples?: object[]; // TODO: get actual type

  maxProperties?: number;
  minProperties?: number;

  // patternProperties?: {
  //   [key: string]: JsonSchema;
  // };
  additionalProperties?: boolean; // TODO: JsonSchema | boolean;
  // dependencies?: {
  //   [key: string]: JsonSchema | string[];
  // };
  propertyNames?: StringSchema; // TODO: make the "type" property optional, as it it implied here
};

export type SchemaProperties = {
  [key: string]: JsonSchema;
};
