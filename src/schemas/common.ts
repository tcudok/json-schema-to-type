export type SchemaCommon = {
  $id?: string;
  $ref?: string;
  $schema?: string;
  $comment?: string;
  //
  // enum?: Schema[];
  // const?: Schema;

  // Schema annotations https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
  title?: string;
  description?: string;
  readOnly?: boolean;
  writeOnly?: boolean;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
  // if?: Schema;
  // then?: Schema;
  // else?: Schema;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
  // allOf?: Schema[];
  // anyOf?: Schema[];
  // oneOf?: Schema[];
  // not?: Schema;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
  format?: string;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
  contentMediaType?: string;
  contentEncoding?: string;

  // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
  // definitions?: {
  //   [key: string]: Schema;
  // };
};
