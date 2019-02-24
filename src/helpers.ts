import { JsonSchema, ObjectSchemaProperties } from './schema';

export const asJsonSchema = <
  T extends JsonSchema<TProps>,
  TProps extends ObjectSchemaProperties
>(
  x: T,
): T => x;
