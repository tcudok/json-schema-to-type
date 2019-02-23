export const jsonSchema = <
  T extends Schema<TProps>,
  TProps extends SchemaProperties
>(
  x: T,
): T => x;

export type Schema<TProps extends SchemaProperties = SchemaProperties> =
  | StringSchema
  | NumberSchema
  | ObjectSchema<TProps>;

type StringSchema = {
  type: 'string';
  default?: string;
};

type NumberSchema = {
  type: 'number';
  default?: number;
};

type ObjectSchema<TProps extends SchemaProperties = SchemaProperties> = {
  type: 'object';
  properties: TProps;
  required?: (keyof TProps)[];
  default?: {};
};

export type SchemaProperties = {
  [key: string]: Schema;
};

export type JsonSchemaType<T extends Schema> = T extends ObjectSchema<any>
  ? ApplyRequired<
      { [K in keyof T['properties']]: JsonSchemaType<T['properties'][K]> },
      T
    >
  : T extends StringSchema
  ? string
  : T extends NumberSchema
  ? number
  : never;

type ApplyRequired<T, TDef> = TDef extends ObjectSchema
  ? Pick<T, Extract<keyof T, RequiredProperties<TDef>>> &
      Partial<Pick<T, Exclude<keyof T, RequiredProperties<TDef>>>>
  : T;

type RequiredProperties<TDef extends ObjectSchema<any>> = {
  [P in keyof TDef['properties']]: P extends ArrayElement<TDef['required']>
    ? P
    : never
}[keyof TDef['properties']];

type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;
