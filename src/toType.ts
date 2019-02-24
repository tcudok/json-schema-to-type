import { JsonSchema } from './schema';
import {
  StringSchema,
  NumberSchema,
  IntegerSchema,
  BooleanSchema,
  ObjectSchema,
  ArraySchema,
  NullSchema,
} from './typeSchemas';

export type JsonSchemaToType<T extends JsonSchema> = T extends MultiTypeSchema
  ? SingleTypeSchemaTypeNameToType<MultiTypeSchemaTypeNames<T>>
  : T extends SingleTypeSchema
  ? SingleTypeSchemaToType<T>
  : never;

type SingleTypeSchema =
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
  default?: SingleTypeSchemaTypeNameToType<T>;
  examples?: SingleTypeSchemaTypeNameToType<T>;
} & UnionToIntersection<StripTypeSpecificProperties<TypeNameToSchema<T>>>;

type StripTypeSpecificProperties<T> = T extends SingleTypeSchema
  ? Pick<T, Exclude<keyof T, 'type' | 'default' | 'examples'>>
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

type SingleTypeSchemaTypeNameToType<
  T extends SingleTypeSchema['type']
> = T extends 'string'
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

type SingleTypeSchemaToType<T> = T extends StringSchema
  ? string
  : T extends NumberSchema
  ? number
  : T extends IntegerSchema
  ? number
  : T extends BooleanSchema
  ? boolean
  : T extends ObjectSchema<any>
  ? ObjectSchemaToType<T>
  : T extends NullSchema
  ? null
  : never;

type ObjectSchemaToType<T> = T extends ObjectSchema<any>
  ? ApplyRequired<
      { [K in keyof T['properties']]: JsonSchemaToType<T['properties'][K]> },
      T
    >
  : never;

type ApplyRequired<T, TDef> = TDef extends ObjectSchema
  ? Pick<T, Extract<keyof T, RequiredProperties<TDef>>> &
      Partial<Pick<T, Exclude<keyof T, RequiredProperties<TDef>>>>
  : T;

type RequiredProperties<TDef extends ObjectSchema<any>> = {
  [P in keyof TDef['properties']]: P extends ArrayElement<TDef['required']>
    ? P
    : undefined extends TDef['properties'][P]['default']
    ? never
    : P
}[keyof TDef['properties']];

type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;
