# trackingApi

The Application is written with MVC design in mind.
We have 3 main folders that contain the main parts of the code.

- inside [routes](./routes/trackingRoutes.ts) is where we define the routes relevant to our app and expose the REST Api.
- [service](./service/) is the middleware or controller, where we have the logic to process the requests and give the proper response.
- [repository](./repository/) is where we hacve our ORM setup to communicate with the db.

Other than that we have:

- db folder contains the initilization of the DB instance plus knex migrations and seeds.
- helpers to have any kind og globally accessible method or class throught the app.

- compose.yml is where we define a simple postgres container to create the table and seed the data.

## to run

- make sure you have a new enough node version. I'm using node v20 and npm v10
- make sure you install docker
- install the packages using `npm i`
- run `docker compose up -d` or `npm run install_db` to create and run the DB docker container
- run `npm run init_db` to create the table and seed the data into it
- Finally run `npm start` to have the app running on http://localhost:3000
- Check out the endpoit with swagger doc at http://localhost:3000/documentation

- when done you can use `docker compose down` to remove the db you created

## to test

We have several [unit tests](./tests/unit_tests/) for each service and repository and one [integration test](./tests/integration_tests/)that tests the whole app cycle by creating and seeding an in memory sqlite db and calling the real weatherbit api.

- you can try it by running `npx jest`

## What can be improved next?

- Create two separate DBs for Test and Development env.
- More best practices on typing, and request validation and having creation of request and response schema separately.
- Separate Error Handling outside app.ts
- More usage of doten for env variables.
- Look into best practices for dependency injection.
- Improve the compose file to make it production ready.
  - We could basically have two containers, 1 backend, 1 db and make them talk to each other.
- create a CI/CD process for testing, building, and deploying the production app.
