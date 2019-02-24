import { JsonSchema } from './schema';
import { ObjectSchemaProperties } from './typeSchemas';

export const asJsonSchema = <
  T extends JsonSchema<TProps>,
  TProps extends ObjectSchemaProperties
>(
  x: T,
): T => x;
