import {
  JsonSchema,
  ObjectSchemaProperties,
  ArraySchemaItemsSchema,
} from './schema';

export const asJsonSchema = <
  T extends JsonSchema<TProps, TItems>,
  TProps extends ObjectSchemaProperties,
  TItems extends ArraySchemaItemsSchema
>(
  x: T,
): T => x;
