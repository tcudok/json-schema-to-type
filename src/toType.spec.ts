import Ajv, { ErrorObject } from 'ajv';
import { assert, IsExactType } from 'conditional-type-checks';
import { JsonSchemaToType } from './toType';

test('string schema', () => {
  const schema = {
    type: 'string',
  } as const;

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, string>>(true);
});

test('number schema', () => {
  const schema = {
    type: 'number',
  } as const;

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, number>>(true);
});

test('integer schema', () => {
  const schema = {
    type: 'integer',
  } as const;

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, number>>(true);
});

test('boolean schema', () => {
  const schema = {
    type: 'boolean',
  } as const;

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, boolean>>(true);
});

describe('object schema', () => {
  test('empty', () => {
    const schema = {
      type: 'object',
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, {}>>(true);
  });

  test('properties', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'string',
        },
        bar: {
          type: 'number',
        },
      },
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, { foo?: string; bar?: number }>>(true);
  });

  test('required properties', () => {
    const schema = {
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
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, { foo: string; bar?: number }>>(true);
  });

  test('nested properties', () => {
    const schema = {
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
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, { port: number; static?: { from: string } }>>(
      true,
    );
  });

  test('default values', () => {
    const schema = {
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
    } as const;

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
    const schema = {
      type: 'array',
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, unknown[]>>(true);
  });

  test('with items of type string', () => {
    const schema = {
      type: 'array',
      items: { type: 'string' },
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, string[]>>(true);
  });

  test('with items of type object with no properties', () => {
    const schema = {
      type: 'array',
      items: { type: 'object' },
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, object[]>>(true);
  });

  test('with items of type object with properties', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: { foo: { type: 'string' }, bar: { type: 'number' } },
        required: ['foo'] as ['foo'], // TODO: this shouldn't be necessary...
      },
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, ({ foo: string; bar?: number })[]>>(true);
  });

  test('with items of type array with no item type', () => {
    const schema = {
      type: 'array',
      items: { type: 'array' },
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, unknown[][]>>(true);
  });

  test('with items of type array with number item type', () => {
    const schema = {
      type: 'array',
      items: { type: 'array', items: { type: 'number' } },
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, number[][]>>(true);
  });

  test('with items of multi-type item type', () => {
    const schema = {
      type: 'array',
      items: { type: ['number', 'string'] },
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, (string | number)[]>>(true);
  });
});

test('null schema', () => {
  const schema = {
    type: 'null',
  } as const;

  type Data = JsonSchemaToType<typeof schema>;

  assert<IsExactType<Data, null>>(true);
});

describe('multi-type schema', () => {
  test('with simple types', () => {
    const schema = {
      type: ['string', 'number', 'integer', 'boolean', 'null'],
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, string | number | boolean | null>>(true);
  });

  test('with array as one of types', () => {
    const schema = {
      type: ['array', 'number'],
      items: { type: 'string' },
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, number | string[]>>(true);
  });

  test('with object as one of types', () => {
    const schema = {
      type: ['object', 'number'],
      properties: {
        foo: { type: 'string' },
        bar: { type: 'number' },
      },
    } as const;

    type Data = JsonSchemaToType<typeof schema>;

    assert<IsExactType<Data, number | { foo?: string; bar?: number }>>(true);
  });
});

test('works with AJV', () => {
  const schema = {
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
  } as const;

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

  type ValidationResult<T> =
    | { success: true; data: JsonSchemaToType<T> }
    | { success: false; errors: ErrorObject[] };

  function validate<T extends object>(
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

test('README snippet', () => {
  const schema = {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      age: {
        type: 'integer',
      },
      address: {
        type: 'object',
        properties: {
          addressLine1: {
            type: 'string',
          },
          addressLine2: {
            type: 'string',
          },
          postCode: {
            type: 'string',
          },
        },
        required: ['addressLine1', 'postCode'],
      },
      phoneNumbers: {
        type: 'array',
        items: {
          type: ['string', 'object'],
          properties: {
            areaCode: { type: 'number' },
            localNumber: { type: 'number' },
          },
          required: ['localNumber'],
        },
      },
    },
    required: ['firstName', 'lastName', 'phoneNumbers'],
  } as const;

  type Actual = JsonSchemaToType<typeof schema>;

  type Expected = {
    firstName: string;
    lastName: string;
    age?: number;
    address?: {
      addressLine1: string;
      addressLine2?: string;
      postCode: string;
    };
    phoneNumbers: (string | { areaCode?: number; localNumber: number })[];
  };

  assert<IsExactType<Actual, Expected>>(true);
});
