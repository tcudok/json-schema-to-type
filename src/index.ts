export const jsonSchema = <
  T extends Schema<TProps>,
  TProps extends SchemaProperties
>(
  x: T,
): T => x;

// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface SchemaArray extends Array<Schema> {}

export type Schema<
  TProps extends SchemaProperties = SchemaProperties,
  TItems extends SchemaArray = SchemaArray
> =
  | StringSchema
  | NumberSchema
  | IntegerSchema
  | BooleanSchema
  | ObjectSchema<TProps>
  | ArraySchema<TItems>
  | NullSchema
  | MultiTypeSchema;

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
  default?: SingleTypeSchemaTypeToType<T>;
  examples?: SingleTypeSchemaTypeToType<T>;
} & UnionToIntersection<StripType<TypeNameToSchema<T>>>;

type StripType<T> = T extends SingleTypeSchema
  ? Pick<T, Exclude<keyof T, 'type' | 'default' | 'examples'>>
  : never;

// https://stackoverflow.com/a/50375286/1515409
type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

type TypeNameToSchema<T extends SingleTypeSchema['type']> = T extends 'string'
  ? StringSchema
  : T extends 'number'
  ? NumberSchema
  : T extends 'boolean'
  ? BooleanSchema
  : never;

type SchemaCommon = {
  $id?: string;
  $ref?: string;
  $schema?: string;
  $comment?: string;
  //
  // type?: JSONSchema7TypeName | JSONSchema7TypeName[];
  // enum?: JSONSchema7Type[];
  // const?: JSONSchema7Type;

  // Schema annotations https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
  title?: string;
  description?: string;
  readOnly?: boolean;
  writeOnly?: boolean;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
   */
  // if?: JSONSchema7Definition;
  // then?: JSONSchema7Definition;
  // else?: JSONSchema7Definition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
   */
  // allOf?: JSONSchema7Definition[];
  // anyOf?: JSONSchema7Definition[];
  // oneOf?: JSONSchema7Definition[];
  // not?: JSONSchema7Definition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
   */
  format?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
   */
  contentMediaType?: string;
  contentEncoding?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
   */
  // definitions?: {
  //   [key: string]: JSONSchema7Definition;
  // };
};

type StringSchema = SchemaCommon & {
  type: 'string';
  default?: string;
  examples?: string;

  maxLength?: number;
  minLength?: number;
  pattern?: string;
};

type NumberSchema = SchemaCommon & {
  type: 'number';
  default?: number;
  examples?: number;

  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
};

type IntegerSchema = SchemaCommon & {
  type: 'integer';
  default?: number;
  examples?: number;

  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
};

type BooleanSchema = SchemaCommon & {
  type: 'boolean';
  default?: boolean;
  examples?: boolean;
};

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
type ArraySchema<TItems extends SchemaArray = SchemaArray> = SchemaCommon & {
  type: 'array';
  default?: TItems;
  examples?: TItems;

  items?: TItems; // TODO: allow single Schema if all items are of the same type

  // additionalItems?: JSONSchema7Definition;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  // contains?: JSONSchema7;
};

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
type ObjectSchema<
  TProps extends SchemaProperties = SchemaProperties
> = SchemaCommon & {
  type: 'object';
  properties: TProps;
  required?: (keyof TProps)[];
  default?: {};
  examples?: {};

  maxProperties?: number;
  minProperties?: number;
  // properties?: {
  //   [key: string]: JSONSchema7Definition;
  // };
  // patternProperties?: {
  //   [key: string]: JSONSchema7Definition;
  // };
  // additionalProperties?: JSONSchema7Definition;
  // dependencies?: {
  //   [key: string]: JSONSchema7Definition | string[];
  // };
  // propertyNames?: JSONSchema7Definition;
};

type NullSchema = {
  type: 'null';
};

export type SchemaProperties = {
  [key: string]: Schema;
};

export type SchemaToType<T extends Schema> = T extends MultiTypeSchema
  ? SingleTypeSchemaTypeToType<MultiTypeSchemaTypeNames<T>>
  : T extends SingleTypeSchema
  ? SingleTypeSchemaToType<T>
  : never;

type MultiTypeSchemaTypeNames<T> = T extends MultiTypeSchema<infer Types>
  ? Types
  : never;

type SingleTypeSchemaTypeToType<
  T extends SingleTypeSchema['type']
> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : never;

type SingleTypeSchemaToType<T> = T extends ObjectSchema<any>
  ? ApplyRequired<
      { [K in keyof T['properties']]: SchemaToType<T['properties'][K]> },
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
    : undefined extends TDef['properties'][P]['default']
    ? never
    : P
}[keyof TDef['properties']];

type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[]
  ? ElementType
  : never;
