#	[IBP ] Node / Heroku Buildpack Backend
This is express backend application that implements all CRUD API endpoints using the provided data.

## Dependencies
- [nodejs 5+](https://nodejs.org)
- [postgres 9.5](http://www.postgresql.org)
- [express 4+](http://expressjs.com/)
- [heroku][https://www.heroku.com]
- [eslint][http://eslint.org/]
- postman chrome extension for verification https://www.getpostman.com


## Configuration
Edit configuration in `config/default.json` and
custom environment variables names in `config/custom-environment-variables.json`,
for example it will read **DATABASE_URL** as url of database from heroku.


Following variables can be configured:
- `authSecret` the secret for auth
- `port` the port to listen
- `logLevel` the log level `debug` or `info`
- `version` the version of api
- `dbConfig` the configurations for database and contains url, pool size and pool idle timeout.

## Database restore
Please follow this article [restore](http://www.postgresql.org/docs/9.5/static/backup-dump.html#BACKUP-DUMP-RESTORE)
or  [restore on heroku](https://devcenter.heroku.com/articles/heroku-postgres-import-export)
to restore dump file in `test_files\games.psql`.

I actually create sample module to reset database easily you can just configure databae url rightly, start application
 and run reset request in demo folder in postman.


## Heroku deployment

You will need to install [Heroku Toolbelt](https://toolbelt.heroku.com/) for this step if you don't already have it installed.

In the main project folder, run the following commands:
```bash
	heroku login
	git init
	git add -A
	git commit -m "init"
	heroku create
	heroku addons:create heroku-postgresql:hobby-dev
	git push heroku master or  git push heroku HEAD:master if you have not committed local changes to master branch
	heroku logs -t
	heroku open
```

## Local Deployment
I recommend you to deploy codes to heroku directly.

Please make sure to configure url of database rightly in `config/default.json` or use environment variable **DATABASE_URL**.

- Install dependencies `npm i`
- run lint check `npm run lint`
- Start app `npm start`


## Setup postman
You can paste **api.yaml** to  [swagger editor](http://editor.swagger.io/) to verify endpoints.

Load postman collection/environment from `postman` directory.
Currently exist below environment variables
- `URL` the base API url  for local testing use `http://localhost:3000` or heroku app url
- `TOKEN` sample super role token
- `ADMIN_TOKEN` sample admin role token
- `USER_TOKEN` sample user role token
- `NOROLES_TOKEN` sample user without roles token
- `INVALID_TOKEN` sample invalid token

##modular
It will use `src/app-routes.js` to load modules.You can put modules in **src/modules**, root directory of module need to exist  **routes.js** and need controllers codes exist in **controllers** folder.

Currently exist crud module and sample module, if you delete entire directory from **src/modules**, then related modules will not load into express application.



##Authentication & Authorization
It will use  [passport](http://passportjs.org/) and it could support social feature to login as twitter, facebook easily.

It will use `src/app-passport.js` to load passport strategies in **src/passports**, you can define `auth:{name of passport strategy}` in `routes.js` of module.
You can also define `access:[role1,role2]`, the user role name is from `src/constants.js`.

It will check Authentication & Authorization in `src/app-routes.js` to secure your APIs.


