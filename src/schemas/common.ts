export type SchemaCommon = {
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
