# The sun sets 194 times

The sun sets 194 times is an online performative experience.

## Running

The API runs in a docker container, requiring:

- Docker 20.10^

To run it, use the Makefile:

```
make build
make docker-
```

The front-end is a Next.JS application. To install requirements and serve it:

```
cd www/
npm run install
npm run dev
```

## Testing

For the API:

```
make docker-test
```

For the front-end, we use Cypress:

In separate terminal sessions, run:

```
make docker-run
```
```
cd www/
yarn dev
```
```
cd www/
yarn cypress:headless
```

## Environment variables

The `.env` file contains the information required for deployment.


| variable | value |
|----------|-------|
| PORT | The port on which the backend runs. |
| DB_USER | The username to connect to the database with |
| DB_PASSWORD | The password for the database user |
| DB_HOST | The location of the database |
| DB_PORT | The port of the database |
| DB_NAME | The name of the database to connect to. |
| API_MODE | The mode in which to run the API (`test`, `debug`, `production`)
| RUN_FIXTURES | Whether or not to run the fixtures located in `api/models/fixtures` (`true`, `false`) |

There are also secrets that can be provided, in a `.secrets` file.

| variable | value |
|----------|-------|
| MAILGUN_API | The key to connect to Mailgun, in order to send automated emails. |
| ADMIN_KEY | A valid user UUID which bypasses authentication checks, by providing it as a URL `token` query parameter (e.g. `https://api.common-syllabi.org/syllabi/?token=ADMIN_KEY`) |
| AIRTABLE_KEY | The key to the Airtable database holding the content |
| SPACES_API_KEY | The API key to access the DO Spaces instance where the UGC is stored |
| SPACES_API_SECRET | The secret DO Spaces API token |


### Sacrifice variables

| variable | value | default |
|----------|-------|---------|
| SACRIFICE_INTERVAL | How often the sacrifice is attempted | `144h` |
| SACRIFICE_ZONE_RADIUS | How big the sacrifice zone is | `30` |
| SACRIFICE_THRESHOLD | The minimum amount of entrypoints within SACRIFICE_ZONE_RADIUS needed to trigger a sacrifice | `70` |
| SACRIFICE_DELAY | Time between the moment the sacrifice emails are sent, and the actual sacrifice happens | `36h` |


## Resources

- [Echo framework](https://echo.labstack.com/) - for handling HTTP requests
- [GORM](https://gorm.io/) - for handling DB transactions
- [Next-Auth](https://next-auth.js.org/) - for handling JWT session management in the frontend
