import { JsonSchema } from './schema';
import { SchemaProperties } from './schemas';

export const asJsonSchema = <
  T extends JsonSchema<TProps>,
  TProps extends SchemaProperties
>(
  x: T,
): T => x;
