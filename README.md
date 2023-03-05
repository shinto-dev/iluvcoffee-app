## Setup

Create project
```shell
nest new iluvcoffee-app
```

Create resource coffees
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
