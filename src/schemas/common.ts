export type SchemaCommon = {
  $id?: string;
  $ref?: string;
  $schema?: string;
  $comment?: string;

  // enum?: JsonSchema[];
  // const?: JsonSchema;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
  title?: string;
  description?: string;
  readOnly?: boolean;
  writeOnly?: boolean;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
  // if?: JsonSchema;
  // then?: JsonSchema;
  // else?: JsonSchema;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
  // allOf?: JsonSchema[];
  // anyOf?: JsonSchema[];
  // oneOf?: JsonSchema[];
  // not?: JsonSchema;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
  format?: string;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
  contentMediaType?: string;
  contentEncoding?: string;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
  // definitions?: {
  //   [key: string]: JsonSchema;
  // };
};
