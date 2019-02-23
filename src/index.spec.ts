import { assert, IsExactType } from 'conditional-type-checks';
import { jsonSchema, JsonSchemaType, Schema } from '.';
import Ajv, { ErrorObject } from 'ajv';

it('compiles with simple schemas', () => {
  const schema = jsonSchema({
    type: 'string',
    default: 'test',
  });

  const t = (i: Schema) => {};

  t(schema);
});

it('compiles with object schemas', () => {
  const schema = jsonSchema({
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    },
    required: ['firstName', 'lastName'],
  });

  type Data = JsonSchemaType<typeof schema>;

  assert<
    IsExactType<Data, { firstName: string; lastName: string; age?: number }>
  >(true);
});

it('it compiles with nested object schemas', () => {
  const schema2 = jsonSchema({
    type: 'object',
    properties: {
      port: {
        type: 'number',
        default: 3000,
      },
      static: {
        type: 'object',
        properties: {
          from: {
            type: 'string',
          },
        },
        required: ['from'],
      },
    },
    required: ['port'],
  });

  type Data2 = JsonSchemaType<typeof schema2>;

  assert<IsExactType<Data2, { port: number; static?: { from: string } }>>(true);
});

it('works with AJV', () => {
  const schema = jsonSchema({
    type: 'object',
    properties: {
      foo: {
        type: 'string',
        default: 'test',
      },
      bar: {
        type: 'object',
        default: {},
        properties: {
          baz: {
            type: 'number',
            default: 5,
          },
        },
      },
    },
  });

  type Data = JsonSchemaType<typeof schema>;

  assert<IsExactType<Data, { foo: string; bar: { baz: number } }>>(true);

  const data: any = {};

  const result = validate(schema, data);

  expect(result.success).toBe(true);

  if (result.success) {
    expect(result.data.foo).toBe('test');
    expect(result.data.bar.baz).toBe(5);
  }
});

type ValidationResult<T extends Schema> =
  | { success: true; data: JsonSchemaType<T> }
  | { success: false; errors: ErrorObject[] };

function validate<T extends Schema>(
  schema: T,
  data: unknown,
): ValidationResult<T> {
  const ajv = new Ajv({ useDefaults: true });

  const validate = ajv.compile(schema);

  if (!validate(data)) {
    return { success: false, errors: validate.errors! };
  }

  return { success: true, data: data as JsonSchemaType<T> };
}
