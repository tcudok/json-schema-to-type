import {
  ArraySchema,
  BooleanSchema,
  IntegerSchema,
  NullSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from './schema';

export type JsonSchemaToType<T> = {
  0: JsonSchemaToType<MultiTypeSchemaToSingleTypeSchemas<T>>;
  1: SchemaToType<T>;
  2: never;
}[T extends MultiTypeSchema ? 0 : T extends SingleTypeSchema ? 1 : 2];

type MultiTypeSchemaToSingleTypeSchemas<T> = T extends MultiTypeSchema<
  infer Schemas
>
  ? Schemas extends SingleTypeSchema['type']
    ? { type: Schemas } & Pick<T, Exclude<keyof T, 'type' | 'default'>>
    : never
  : never;

type SingleTypeSchema =
  | StringSchema
  | NumberSchema
  | IntegerSchema
  | BooleanSchema
  | ObjectSchema<any>
  | ArraySchema<any>
  | NullSchema;

type MultiTypeSchema<
  T extends SingleTypeSchema['type'] = SingleTypeSchema['type']
> = {
  type: readonly T[];
};

type SchemaToType<T> = T extends StringSchema
  ? string
  : T extends NumberSchema
  ? number
  : T extends IntegerSchema
  ? number
  : T extends BooleanSchema
  ? boolean
  : T extends ObjectSchema<any>
  ? ObjectSchemaToType<T>
  : T extends ArraySchema<any>
  ? ArraySchemaToType<T>
  : T extends NullSchema
  ? null
  : never;

type ObjectSchemaToType<T extends ObjectSchema<any>> = ApplyRequired<
  { [K in keyof T['properties']]: JsonSchemaToType<T['properties'][K]> },
  T
>;

type ArraySchemaToType<T> = T extends ArraySchema<infer ItemsSchema>
  ? {
      0: JsonSchemaToType<ItemsSchema>[];
      1: unknown[];
    }[ItemsSchema extends SingleTypeSchema | MultiTypeSchema<any> ? 0 : 1]
  : never;

type ApplyRequired<T, TDef> = TDef extends ObjectSchema
  ? Pick<T, Extract<keyof T, RequiredProperties<TDef>>> &
      Partial<Pick<T, Exclude<keyof T, RequiredProperties<TDef>>>>
  : T;

type RequiredProperties<T extends ObjectSchema<any>> = {
  [P in keyof T['properties']]: P extends ElementOf<T['required']>
    ? P
    : undefined extends T['properties'][P]['default']
    ? never
    : P
}[keyof T['properties']];

type ElementOf<T> = T extends readonly (infer E)[] ? E : never;


