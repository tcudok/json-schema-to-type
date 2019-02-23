# json-schema-to-instance-type

A compile-time TypeScript library that can generate the type of a JSON instance from a JSON Schema object.

## Installation

```bash
npm install -D typed-schema
```

```bash
yarn -D add typed-schema
```

## Usage

```typescript
import {
  JsonSchemaToInstanceType,
  asJsonSchema,
} from 'json-schema-to-instance-type';

// `asJsonSchema` cast the type to `JsonSchema` type without erasing the granular type information.
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

type Instance = JsonSchemaToInstanceType<typeof schema>;
```

The resulting type of `Instance` will be equivalent to:

```typescript
type Instance = {
  firstName: string;
  lastName: string;
  age?: number;
};
```

## Status

Alpha, the support for many JSON Schema features is still missing:

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
