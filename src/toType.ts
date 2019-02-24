import {
  ArraySchema,
  BooleanSchema,
  IntegerSchema,
  JsonSchema,
  NullSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from './schema';

export type JsonSchemaToType<T extends JsonSchema> = T extends MultiTypeSchema
  ? TypeNameToType<MultiTypeSchemaTypeNames<T>>
  : T extends SingleTypeSchema
  ? SchemaToType<T>
  : never;

export type SingleTypeSchema =
  | StringSchema
  | NumberSchema
  | IntegerSchema
  | BooleanSchema
  | ObjectSchema<any>
  | ArraySchema<any>
  | NullSchema;

export type MultiTypeSchema<
  T extends SingleTypeSchema['type'] = SingleTypeSchema['type']
> = {
  type: T[];
  default?: TypeNameToType<T>;
} & UnionToIntersection<StripTypeSpecificProperties<TypeNameToSchema<T>>>;

type StripTypeSpecificProperties<T> = T extends SingleTypeSchema
  ? Pick<T, Exclude<keyof T, 'type' | 'default'>>
  : never;

// https://stackoverflow.com/a/50375286/1515409
type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

type MultiTypeSchemaTypeNames<T> = T extends MultiTypeSchema<infer Types>
  ? Types
  : never;

type TypeNameToSchema<T extends SingleTypeSchema['type']> = T extends 'string'
  ? StringSchema
  : T extends 'number'
  ? NumberSchema
  : T extends 'integer'
  ? IntegerSchema
  : T extends 'boolean'
  ? BooleanSchema
  : T extends 'object'
  ? ObjectSchema<any>
  : T extends 'array'
  ? ArraySchema<any>
  : T extends 'null'
  ? NullSchema
  : never;

type TypeNameToType<T extends SingleTypeSchema['type']> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'integer'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends 'object'
  ? object
  : T extends 'array'
  ? []
  : T extends 'null'
  ? null
  : never;

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

type ShallowSchemaToType<T> = T extends StringSchema
  ? string
  : T extends NumberSchema
  ? number
  : T extends IntegerSchema
  ? number
  : T extends BooleanSchema
  ? boolean
  : T extends NullSchema
  ? null
  : never;

type ObjectSchemaToType<T extends ObjectSchema<any>> = ApplyRequired<
  { [K in keyof T['properties']]: JsonSchemaToType<T['properties'][K]> },
  T
>;

type ArraySchemaToType<T> = T extends ArraySchema<infer Item>
  ? Item extends SingleTypeSchema
    ? TypeNameToType<Item['type']>[]
    : Item extends MultiTypeSchema<any>
    ? TypeNameToType<MultiTypeSchemaTypeNames<Item>>[]
    : unknown[]
  : never;

type ApplyRequired<T, TDef> = TDef extends ObjectSchema
  ? Pick<T, Extract<keyof T, RequiredProperties<TDef>>> &
      Partial<Pick<T, Exclude<keyof T, RequiredProperties<TDef>>>>
  : T;

type RequiredProperties<T extends ObjectSchema<any>> = {
  [P in keyof T['properties']]: P extends ArrayElement<T['required']>
    ? P
    : undefined extends T['properties'][P]['default']
    ? never
    : P
}[keyof T['properties']];

type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;
