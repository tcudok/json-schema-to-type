import { JsonSchema, ObjectSchemaProperties, ArraySchemaItem } from './schema';

export const asJsonSchema = <
  T extends JsonSchema<TProps, TItems>,
  TProps extends ObjectSchemaProperties,
  TItems extends ArraySchemaItem
>(
  x: T,
): T => x;
