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
  TProps extends ObjectSchemaProperties = ObjectSchemaProperties,
> = {
  type: 'object';
  properties?: TProps;
  required?: readonly (keyof TProps)[];

  // TODO: these might affect the final type, investigate:
  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
  // patternProperties?: {
  //   [key: string]: JsonSchemaDefinition;
  // };
  // additionalProperties?: JsonSchemaDefinition;
  // dependencies?: {
  //   [key: string]: JsonSchemaDefinition | string[];
  // };
};

export type ObjectSchemaProperties = {
  [key: string]: any;
};

export type ArraySchema<TItems> = {
  type: 'array';

  items?: TItems; // TODO: tuple support

  // TODO: these might affect the final type, investigate:
  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
  // additionalItems?: boolean; // JsonSchema | boolean;
  // contains?: JsonSchema;
};

export type NullSchema = {
  type: 'null';
};
