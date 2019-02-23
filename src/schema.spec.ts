import { assert, IsExactType } from 'conditional-type-checks';
import {
  JsonSchemaToInstanceType,
  JsonSchema,
  MultiTypeSchema,
} from './schema';
import Ajv, { ErrorObject } from 'ajv';
import { SchemaProperties } from './schemas';
import { asJsonSchema } from './helpers';

it('compiles with simple schemas', () => {
  const schema = asJsonSchema({
    type: 'string',
    default: 'test',
  });

  type Data = JsonSchemaToInstanceType<typeof schema>;

  assert<IsExactType<Data, string>>(true);
});

it('compiles with multi-type schemas', () => {
  const schema = {
    type: ['string', 'number'] as ['string', 'number'],
    default: 'test',
  };

  type Data = JsonSchemaToInstanceType<typeof schema>;

  assert<IsExactType<Data, string | number>>(true);
});

it('compiles with multi-type schemas when one of the types is object', () => {
  const schema: MultiTypeSchema<'string' | 'object'> = {
    type: ['string', 'object'],
    default: 'test',
  };

  type Data = JsonSchemaToInstanceType<typeof schema>;

  assert<IsExactType<Data, string | object>>(true);
});

it('compiles with object schemas', () => {
  const schema = asJsonSchema({
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

  type Data = JsonSchemaToInstanceType<typeof schema>;

  assert<
    IsExactType<Data, { firstName: string; lastName: string; age?: number }>
  >(true);
});

it('compiles with nested object schemas', () => {
  const schema = asJsonSchema({
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

  type Data = JsonSchemaToInstanceType<typeof schema>;

  assert<IsExactType<Data, { port: number; static?: { from: string } }>>(true);
});

it('works with AJV', () => {
  const schema = asJsonSchema({
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

  type Data = JsonSchemaToInstanceType<typeof schema>;

  assert<IsExactType<Data, { foo: string; bar: { baz: number } }>>(true);

  const data: any = {};

  const result = validate(schema, data);

  expect(result.success).toBe(true);

  if (result.success) {
    expect(result.data.foo).toBe('test');
    expect(result.data.bar.baz).toBe(5);
  }
});

type ValidationResult<T extends JsonSchema> =
  | { success: true; data: JsonSchemaToInstanceType<T> }
  | { success: false; errors: ErrorObject[] };

function validate<T extends JsonSchema>(
  schema: T,
  data: unknown,
): ValidationResult<T> {
  const ajv = new Ajv({ useDefaults: true });

  const validate = ajv.compile(schema);

  if (!validate(data)) {
    return { success: false, errors: validate.errors! };
  }

  return { success: true, data: data as JsonSchemaToInstanceType<T> };
}