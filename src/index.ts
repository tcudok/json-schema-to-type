export const jsonSchema = <
  T extends Schema<TTypeName, TProps>,
  TTypeName extends SchemaTypeName,
  TProps extends SchemaProperties
>(
  x: T,
) => x;

export type Schema<
  TTypeName extends SchemaTypeName = SchemaTypeName,
  TProperties extends SchemaProperties = SchemaProperties
> = {
  type?: TTypeName;
  description?: string;
  properties?: TProperties;
  required?: (keyof TProperties)[];
  default?: DefaultType<TTypeName>;
};

export type SchemaType = object | string | number | boolean;

export type SchemaTypeName =
  | 'object'
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'array' // TODO: mapping
  | 'null'; // TODO: mapping

export type SchemaProperties = {
  [key: string]: Schema;
};

export type JsonSchemaType<T extends Schema> = MarkOptionalProperties<
  { [K in keyof T['properties']]: PropertyType<T['properties'][K]> },
  T
>;

type DefaultType<T extends SchemaTypeName> = T extends 'object'
  ? {}
  : T extends 'string'
  ? string
  : T extends 'integer' | 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : never;

type PropertyType<T extends Schema> = T['type'] extends 'object'
  ? JsonSchemaType<T>
  : T['type'] extends 'string'
  ? string
  : T['type'] extends 'integer' | 'number'
  ? number
  : T['type'] extends 'boolean'
  ? boolean
  : never;

type MarkOptionalProperties<
  T extends JsonSchemaType<TDef>,
  TDef extends Schema
> = Pick<T, Extract<keyof T, RequiredProperties<TDef>>> &
  Partial<Pick<T, Exclude<keyof T, RequiredProperties<TDef>>>>;

type RequiredProperties<TDef extends Schema> = {
  [P in keyof TDef['properties']]: P extends ArrayElement<TDef['required']>
    ? P
    : never
}[keyof TDef['properties']];

type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;
