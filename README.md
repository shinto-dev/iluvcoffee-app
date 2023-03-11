## Setup

**Create project**
```shell
nest new iluvcoffee-app
```

**Create resource coffees**
```shell
nest g resource coffees
```
Then we can choose the transport layer (REST, graphQL schema first, graphQL code first, gRPC) etc
```
? What transport layer do you use? REST API
? Would you like to generate CRUD entry points? Yes
CREATE src/coffees/coffees.controller.spec.ts (586 bytes)
CREATE src/coffees/coffees.controller.ts (936 bytes)
CREATE src/coffees/coffees.module.ts (261 bytes)
CREATE src/coffees/coffees.service.spec.ts (467 bytes)
CREATE src/coffees/coffees.service.ts (637 bytes)
CREATE src/coffees/dto/create-coffee.dto.ts (32 bytes)
CREATE src/coffees/dto/update-coffee.dto.ts (177 bytes)
CREATE src/coffees/entities/coffee.entity.ts (23 bytes)
UPDATE package.json (1978 bytes)
UPDATE src/app.module.ts (320 bytes)
✔ Packages installed successfully.
```
**Create resource users**
```shell
nest g resource users
```

## Use config module
To install the config module
```shell
npm i @nestjs/config
```
Then we can use the config module in the app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```
Then we can create a .env file in the root of the project. 

## Hashing passwords
To install the bcrypt module
```shell
npm i bcrypt
npm i @types/bcrypt -D
```

## Validate and Transform request
To install the class-validator module
```shell
npm i class-validator class-transformer
```

## Protecting routes with guard

```shell
nest g guard iam/authentication/guards/access-token
```

### Adding public routes
In any application, there are always certain endpoints that should remain public. Take for example the “signIn” endpoint that lets users log in to the system, unless it’s public, no one would be able to access it and actually “log in”.


## Invalidating tokens
To install the redis module
```shell
npm i ioredis
npm i @types/redis -D
```
