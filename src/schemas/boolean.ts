import { SchemaCommon } from './common';

export type BooleanSchema = SchemaCommon & {
  type: 'boolean';
  default?: boolean;
  examples?: boolean[];
};
