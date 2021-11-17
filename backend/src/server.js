const { BACKEND_PORT = 5000 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

const listener = () => console.log(`Listening on Port ${BACKEND_PORT}!`);

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(BACKEND_PORT, listener);
  })
  .catch(console.error);
