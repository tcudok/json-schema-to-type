import { SchemaCommon } from './common';
import { Schema } from '..';
import { StringSchema } from './string';

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
export type ObjectSchema<
  TProps extends SchemaProperties = SchemaProperties
> = SchemaCommon & {
  type: 'object';
  properties?: TProps;
  required?: (keyof TProps)[];
  default?: {};
  examples?: {};

  maxProperties?: number;
  minProperties?: number;

  // patternProperties?: {
  //   [key: string]: Schema;
  // };
  additionalProperties?: boolean; // TODO: Schema | boolean;
  // dependencies?: {
  //   [key: string]: Schema | string[];
  // };
  propertyNames?: StringSchema; // TODO: make type property optional, as it it implied here
};

export type SchemaProperties = {
  [key: string]: Schema;
};
