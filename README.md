# json-schema-to-type

A compile-time TypeScript library that can generate the type of a JSON instance from a JSON Schema object type.

## Installation

```bash
npm install -D typed-schema
```

```bash
yarn -D add typed-schema
```

## Usage

```typescript
import { JsonSchemaToType, asJsonSchema } from 'json-schema-to-type';

// `asJsonSchema` casts the type to a type that extends the `JsonSchema` schema, while preserving the granular type information.
// Without it, all the type names would have to be manually cast to string literals (`type: 'string' as 'string'`).
// Shouldn't be needed when `const` assertions land in TS 3.4: https://github.com/Microsoft/TypeScript/pull/29510
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

type Type = JsonSchemaToType<typeof schema>;
```

The resulting type of `Type` will be equivalent to:

```typescript
type Type = {
  firstName: string;
  lastName: string;
  age?: number;
};
```

## Development status

The support for many JSON Schema features is still missing. Things to implement:

- [ ] `array` type
- [ ] `enum` property
- [ ] `const` property
- [ ] `definitions` property
- [ ] `if`, `then`, `else` properties
- [ ] `allOf`, `anyOf`, `oneOf`, `not` properties
- [ ] strongly typed `default` property for objects
- [ ] strongly typed `examples` for objects
- [ ] `patternProperties` property for objects
- [ ] `dependencies` property for objects
- [ ] proper support for `additionalProperties` property for objects
- [ ] proper typing for `propertyNames` property for objects
