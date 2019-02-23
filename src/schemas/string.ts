import { SchemaCommon } from './common';

export type StringSchema = SchemaCommon & {
  type: 'string';
  default?: string;
  examples?: string[];

  maxLength?: number;
  minLength?: number;
  pattern?: string;
};
