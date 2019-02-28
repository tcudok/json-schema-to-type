import Ajv, { ErrorObject } from 'ajv';
import { assert, IsExactType } from 'conditional-type-checks';
import { asJsonSchema } from './helpers';
import { JsonSchema } from './schema';
import { JsonSchemaToType } from './toType';

test('string schema', () => {
  const schema = asJsonSchema({
    type: 'string',
  });

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, string>>(true);
});

test('number schema', () => {
  const schema = asJsonSchema({
    type: 'number',
  });

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, number>>(true);
});

test('integer schema', () => {
  const schema = asJsonSchema({
    type: 'integer',
  });

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, number>>(true);
});

test('boolean schema', () => {
  const schema = asJsonSchema({
    type: 'boolean',
  });

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, boolean>>(true);
});

describe('object schema', () => {
  test('empty', () => {
    const schema = asJsonSchema({
      type: 'object',
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, {}>>(true);
  });

  test('properties', () => {
    const schema = asJsonSchema({
      type: 'object',
      properties: {
        foo: {
          type: 'string',
        },
        bar: {
          type: 'number',
        },
      },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, { foo?: string; bar?: number }>>(true);
  });

  test('required properties', () => {
    const schema = asJsonSchema({
      type: 'object',
      properties: {
        foo: {
          type: 'string',
        },
        bar: {
          type: 'number',
        },
      },
      required: ['foo'],
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, { foo: string; bar?: number }>>(true);
  });

  test('nested properties', () => {
    const schema = asJsonSchema({
      type: 'object',
      properties: {
        port: {
          type: 'number',
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

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, { port: number; static?: { from: string } }>>(
      true,
    );
  });

  test('default values', () => {
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
            qux: {
              type: ['number', 'string'],
              default: 'test',
            },
          },
        },
      },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<
      IsExactType<
        Data,
        { foo: string; bar: { baz: number; qux: number | string } }
      >
    >(true);
  });
});

describe('array schema', () => {
  test('no items schema', () => {
    const schema = asJsonSchema({
      type: 'array',
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, unknown[]>>(true);
  });

  test('with items of type string', () => {
    const schema = asJsonSchema({
      type: 'array',
      items: { type: 'string' },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, string[]>>(true);
  });

  test('with items of type object with no properties', () => {
    const schema = asJsonSchema({
      type: 'array',
      items: { type: 'object' },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, object[]>>(true);
  });

  test('with items of type object with properties', () => {
    const schema = asJsonSchema({
      type: 'array',
      items: {
        type: 'object',
        properties: { foo: { type: 'string' }, bar: { type: 'number' } },
        required: ['foo'] as ['foo'], // TODO: this shouldn't be necessary...
      },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, ({ foo: string; bar?: number })[]>>(true);
  });

  test('with items of type array with no item type', () => {
    const schema = asJsonSchema({
      type: 'array',
      items: { type: 'array' },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, unknown[][]>>(true);
  });

  test('with items of type array with number item type', () => {
    const schema = asJsonSchema({
      type: 'array',
      items: { type: 'array', items: { type: 'number' } },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, number[][]>>(true);
  });

  test('with items of multi-type item type', () => {
    const schema = asJsonSchema({
      type: 'array',
      items: { type: ['number', 'string'] },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, (string | number)[]>>(true);
  });
});

test('null schema', () => {
  const schema = asJsonSchema({
    type: 'null',
  });

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, null>>(true);
});

describe('multi-type schema', () => {
  test('with simple types', () => {
    const schema = asJsonSchema({
      type: ['string', 'number', 'integer', 'boolean', 'null'],
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, string | number | boolean | null>>(true);
  });

  test('with array as one of types', () => {
    const schema = asJsonSchema({
      type: ['array', 'number'],
      items: { type: 'string' },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, number | string[]>>(true);
  });

  test('with object as one of types', () => {
    const schema = asJsonSchema({
      type: ['object', 'number'],
      properties: {
        foo: { type: 'string' },
        bar: { type: 'number' },
      },
    });

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, number | { foo?: string; bar?: number }>>(true);
  });
});

test('works with AJV', () => {
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
          qux: {
            type: ['number', 'string'],
            default: 'test',
          },
          quux: {
            type: 'array',
            items: { type: 'string' },
            default: ['ene', 'due'],
          },
        },
      },
    },
  });

  type Data = JsonSchemaToType<typeof schema>;

  assert<
    IsExactType<
      Data,
      {
        foo: string;
        bar: { baz: number; qux: number | string; quux: string[] };
      }
    >
  >(true);

  const data: any = {};

  const result = validate(schema, data);

  expect(result.success).toBe(true);

  if (result.success) {
    expect(result.data.foo).toBe('test');
    expect(result.data.bar.baz).toBe(5);
    expect(result.data.bar.qux).toBe('test');
    expect(result.data.bar.quux).toEqual(['ene', 'due']);
  }

  type ValidationResult<T extends JsonSchema> =
    | { success: true; data: JsonSchemaToType<T> }
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

    return { success: true, data: data as JsonSchemaToType<T> };
  }
});
