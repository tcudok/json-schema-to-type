import { SchemaCommon } from './common';
import { Schema } from '..';

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
  // properties?: {
  //   [key: string]: JSONSchema7Definition;
  // };
  // patternProperties?: {
  //   [key: string]: JSONSchema7Definition;
  // };
  // additionalProperties?: JSONSchema7Definition;
  // dependencies?: {
  //   [key: string]: JSONSchema7Definition | string[];
  // };
  // propertyNames?: JSONSchema7Definition;
};

export type SchemaProperties = {
  [key: string]: Schema;
};
