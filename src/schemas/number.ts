import { SchemaCommon } from './common';

export type NumberSchema = SchemaCommon & {
  type: 'number';
  default?: number;
  examples?: number;

  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
};
