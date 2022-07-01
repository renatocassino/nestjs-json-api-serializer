<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<p align="center">
  A lib to NestJS to serializer JSON following the <a href="https://jsonapi.org/">JSON Api</a> pattern.
</p>

## Installation

Run in your terminal

```bash
$ npm install --save nestjs-json-api-serializer
```

or via yarn

```bash
$ yarn add nestjs-json-api-serializer
```

## Getting started

```ts
import {
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { JsonApiInterceptor } from 'nestjs-json-api-serializer';

@Controller('v1/cats')
export class CatsController {
  
  @UseInterceptors(JsonApiInterceptor)
  @Get()
  async index() {
    return {
      data: [ /* my array of objects */ ],
    };
  }
}
```

When you make a curl to `http://localhost/v1/cats` the `JsonApiInterceptor` will change your payload following the JSON Api pattern.

```json
{
  "data": [
    {
      "id": 2,
      "attributes": {
        "color": "orange",
        "name": "Shadow",
        "genre": "male"
      },
      "relations": {
        "power": {
          "id": 33,
          "attributes": {
            "powerName": "meow"
          }
        }
      }
    },
    {
      "id": 12,
      "attributes": {
        "color": "brown",
        "name": "british",
        "genre": "female"
      },
      "relations": {
        "power": {
          "id": 34,
          "attributes": {
            "powerName": "purr"
          }
        }
      }
    }
  ]
}
```

### Fields

Following the [JSON Api fields pattern](https://jsonapi.org/format/#document-resource-object-fields), if you pass a queryString called `fields` you can get only fields listed.

Example: `http://localhost:3000/v1/cats?fields=color,name` the result should be:

```json
{
  "data": [
    {
      "id": 2,
      "attributes": {
        "color": "orange",
        "name": "Shadow"
      }
    },
    {
      "id": 12,
      "attributes": {
        "color": "brown",
        "name": "british"
      }
    }
  ]
}
```
