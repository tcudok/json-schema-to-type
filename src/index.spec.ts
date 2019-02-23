import { assert, IsExactType } from 'conditional-type-checks';
import { jsonSchema, JsonSchemaType, Schema } from '.';

it('compiles with simple schemas', () => {
  const schema = jsonSchema({
    type: 'string',
    default: '5',
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
