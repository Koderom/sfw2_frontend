# Sakai19

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Configurar n8n local
$env:EDITOR_BASE_URL="https://a19e431b4e3d.ngrok-free.app/"
verificar: Get-ChildItem Env:EDITOR_BASE_URL
$env:WEBHOOK_URL="https://a19e431b4e3d.ngrok-free.app/"
Get-ChildItem Env:WEBHOOK_URL

## para realizar cambios en el servidor
cd ~/sfw2_frontend
git pull
npm install
sudo ng build --configuration production
sudo systemctl restart nginx

docker exec -it seguimiento-backend npm run build
docker-compose down -v
docker-compose up --build -d

https://n8n-service-axadhhayhpdpdbhz.centralus-01.azurewebsites.net/webhook/b727a688-7624-4054-943e-39ab560693cd
https://n8n-service-axadhhayhpdpdbhz.centralus-01.azurewebsites.net/webhook/b727a688-7624-4054-943e-39ab560693cd