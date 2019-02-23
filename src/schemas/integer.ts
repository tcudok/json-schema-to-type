import { SchemaCommon } from './common';

export type IntegerSchema = SchemaCommon & {
  type: 'integer';
  default?: number;
  examples?: number;

  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
};
