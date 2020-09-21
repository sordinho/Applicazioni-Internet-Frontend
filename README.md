# ApplicazioniInternetFrontend

This is the frontend Angular application developed for the AI course 2020

## Backend

The backend is a Spring Boot application.

[Repository](https://github.com/anphetamina/AI-project-backend)

## Docker

### Run a complete docker image

There are 2 already compiled docker images. The main difference is the presence of a predefined DB with some users and usefull data.

- Have a look at this file [SQLData](/src/main/resources/data.sql)

#### Pulling from dockerHub

- `docker pull sordinho/ai-project-db` for the full db version
- `docker pull sordinho/ai-project` for an empty db version

### Building from sources
It is possible to build the docker image from sources. Have a look at the backend instructions [HERE](https://github.com/anphetamina/AI-project-backend)

## Angular Informations

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.9.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
