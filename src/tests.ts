import { assert, IsExactType } from 'conditional-type-checks';
import { jsonSchema, JsonSchemaType, Schema } from '.';

const schema0 = jsonSchema({
  type: 'string',
  default: 5,
});

const t = (i: Schema) => {};

t(schema0);

const schema1 = jsonSchema({
  properties: {
    firstName: {
      type: 'string',
      description: "The person's first name.",
    },
    lastName: {
      type: 'string',
      description: "The person's last name.",
    },
    age: {
      type: 'integer',
      description: 'Age in years which must be equal to or greater than zero.',
    },
  },
  required: ['firstName', 'lastName'],
});

type Data = JsonSchemaType<typeof schema1>;

assert<
  IsExactType<Data, { firstName: string; lastName: string; age?: number }>
>(true);

const schema2 = jsonSchema({
  properties: {
    port: {
      type: 'number',
      default: '3000',
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

type Test<TBar> = { foo: string; bar?: TBar };

function test<T extends Test<TBar>, TBar>(t: T): T {
  return t;
}

const a = test({ foo: 'test', bar: 5 });
