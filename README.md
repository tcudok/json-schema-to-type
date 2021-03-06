[![npm version](https://badge.fury.io/js/json-schema-to-type.svg)](https://badge.fury.io/js/json-schema-to-type)

# json-schema-to-type

A compile-time TypeScript library that can generate the type of a JSON instance from a JSON Schema object type.

Requires TypeScript >=3.4

## Installation

```bash
npm install -D json-schema-to-type
```

```bash
yarn -D add json-schema-to-type
```

## Usage

```typescript
import { JsonSchemaToType } from 'json-schema-to-type';

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

type Type = JsonSchemaToType<typeof schema>;
```

The resulting type of `Type` will be equivalent to:

```typescript
type Type = {
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
```

## Development status

The support for many JSON Schema features is still missing. Things to implement:

- [x] `array` type
  - [x] single schema for all items
    - [x] full support for `array` schemas as item schemas (currently resolves to [][])
    - [x] full support for `object` schemas as item schemas (currently resolves to object[])
  - [ ] multiple items schemas (tuples)
  - [ ] `additionalItems` property
  - [ ] `contains` property
- [x] `object` type
  - [x] required properties
  - [ ] `patternProperties` property
  - [ ] `additionalProperties` property
- [x] multi-type schemas
  - [x] full support for `array` schemas in multi-type schemas (currently resolves to [])
  - [x] full support for `object` schemas in multi-type schemas (currently resolves to object)
- [ ] `enum` property
- [ ] `const` property
- [ ] `definitions` property (investigate `$ref` support)
- [ ] `if`, `then`, `else` properties
- [ ] `allOf`, `anyOf`, `oneOf`, `not` properties
