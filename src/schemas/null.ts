import { SchemaCommon } from './common';

export type NullSchema = SchemaCommon & {
  type: 'null';
};
