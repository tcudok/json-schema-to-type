export type JsonSchemaTypeName =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null';

export type JsonSchemaType =
  | ArraySchemaItems[]
  | boolean
  | number
  | null
  | object
  | string;

export interface JsonSchemaArray extends Array<JsonSchemaType> {}

export type JsonSchemaVersion = string;

export type JsonSchemaDefinition = JsonSchema | boolean;

export interface ArraySchemaItemsSchema extends JsonSchema {}

// Based on https://github.com/DefinitelyTyped/DefinitelyTyped/blob/11d758a1193c3bd924f9f4b0b466f6e4d40d1a2f/types/json-schema/index.d.ts#L510,
// with slight modifications to allow to capture the needed type information.
export interface JsonSchema<
  TObjectProperties extends ObjectSchemaProperties = ObjectSchemaProperties,
  TArrayItems extends ArraySchemaItemsSchema = ArraySchemaItemsSchema
> {
  // TODO: type isn't strictly required, if it's not specified we can fallback to unknown
  type: JsonSchemaTypeName | JsonSchemaTypeName[];

  properties?: TObjectProperties;
  required?: (keyof TObjectProperties)[];

  items?: TArrayItems;

  /*
    Properties that don't affect the instance type, copied directly from @types/json-schema

    TODO: Can @types/json-schema be just used directly? Not doing that for now as having a local
          copy makes the development easier for now.
  */

  $id?: string;
  $ref?: string;
  $schema?: JsonSchemaVersion;
  $comment?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
   */
  // enum?: JsonSchemaTypeName[];
  // const?: JsonSchemaTypeName;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
   */
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
   */
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
   */
  // items?: JsonSchemaDefinition | JsonSchemaDefinition[];
  // additionalItems?: JsonSchemaDefinition;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  // contains?: JsonSchema;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
   */
  maxProperties?: number;
  minProperties?: number;
  // properties?: {
  //   [key: string]: JsonSchemaDefinition;
  // };
  // patternProperties?: {
  //   [key: string]: JsonSchemaDefinition;
  // };
  // additionalProperties?: JsonSchemaDefinition;
  dependencies?: {
    [key: string]: JsonSchemaDefinition | string[];
  };
  propertyNames?: JsonSchemaDefinition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
   */
  // if?: JsonSchemaDefinition;
  // then?: JsonSchemaDefinition;
  // else?: JsonSchemaDefinition;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
   */
  // allOf?: JsonSchemaDefinition[];
  // anyOf?: JsonSchemaDefinition[];
  // oneOf?: JsonSchemaDefinition[];
  // not?: JsonSchemaDefinition;

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
  //   [key: string]: JsonSchemaDefinition;
  // };

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
   */
  title?: string;
  description?: string;
  default?: JsonSchemaType;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: JsonSchemaType;
}

export type StringSchema = {
  type: 'string';
};

export type NumberSchema = {
  type: 'number';
};

export type IntegerSchema = {
  type: 'integer';
};

export type BooleanSchema = {
  type: 'boolean';
};

export type ObjectSchema<
  TProps extends ObjectSchemaProperties = ObjectSchemaProperties
> = {
  type: 'object';
  properties?: TProps;
  required?: (keyof TProps)[];
};

export type ObjectSchemaProperties = {
  [key: string]: JsonSchema;
};

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
export type ArraySchema<TItems extends JsonSchema> = {
  type: 'array';

  items?: TItems; // TODO: tuple support

  // TODO: these might affect the final type, investigate:
  // additionalItems?: boolean; // JsonSchema | boolean;
  // uniqueItems?: boolean;
  // contains?: JsonSchema;
};

// // https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface ArraySchemaItems extends Array<JsonSchema> {}

export type NullSchema = {
  type: 'null';
};
