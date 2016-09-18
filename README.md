# [IBP ] Node / Heroku buildpack backend for Mailgun service
- This is express backend application that is based on earlier backend which implemented all CRUD API endpoints using the provided data.
- *Added functionality: using Mailgun to send/track emails.*
- sample heroku backend is on http://glacial-cove-96986.herokuapp.com
- added readme entities, which are neccessary for running this app in this submission are **emphasized**

## **Files added**
- `IBP.email.postman_collection.json` : latest postman collection
- `IBP.email.postman_environment.json` : latest postman environment
- `src/modules/email/..` : email module
- `test_files/sql/email.sql` : sql file to setup email module
- `.eslintrc` : eslintrc, change rules if you think some are not proper
- `.gitignore` : basic gitignore file for node_modules

## Dependencies
- runs on node.js v5.11.1 / node.js v6
- [postgres 9.5](http://www.postgresql.org)
- [express 4+](http://expressjs.com/)
- [heroku][https://www.heroku.com]
- [eslint][http://eslint.org/]
- postman chrome extension for verification https://www.getpostman.com

## **Important: Mailgun configuration**
- sign up for mailgun https://mailgun.com/signup
- provide email, name, password. payment info not needed yet
- note: unless you add domain in mailgun configuration, you can only send to email address provided above, so for testing **you should register to mailgun and use your email address to receive emails**
- after registration goto https://mailgun.com/app/account/settings
- copy `Private API Key` to `config/default.json -> mailConfig.mailgunKey` (or environment variable)
- key is in format `key-........`
  ![http://i.imgur.com/DGFWrmE.png](http://i.imgur.com/DGFWrmE.png)
- goto https://mailgun.com/app/domains
  ![http://imgur.com/R69LQHB](http://i.imgur.com/R69LQHB.png)
- copy `Domain Name` to `config/default.json -> mailConfig.mailgunDomain` (or environment variable)

## Configuration
- Edit configuration in `config/default.json` and
- custom environment variables names in `config/custom-environment-variables.json`,
- for example it will read **DATABASE_URL** as url of database from heroku.

Following variables can be configured:
- `authSecret` the secret for auth
- `port` the port to listen
- `logLevel` the log level `debug` or `info`
- `version` the version of api
- `dbConfig` the configurations for database and contains url, pool size and pool idle timeout.

## Heroku deployment

- You will need to install [Heroku Toolbelt](https://toolbelt.heroku.com/) for this step if you don't already have it installed.

- In the main project folder, run the following commands:

        heroku login
        git init
        git add .
        git commit -m "init"
        heroku create
        heroku addons:create heroku-postgresql:hobby-dev
        git push heroku master
        heroku logs -t
        heroku open


## Local Deployment

- for development it is very handy to have buildpack deployed to your local machine.
- Please make sure to configure url of database rightly in `config/default.json` or use environment variable **DATABASE_URL**.
  - current default `db_url: postgres://test:test@localhost:5432/test`
  - so, you should have postgres running on port `5432` of your `localhost`
  - with database name `test`
  - which is given access to user `test`
  - who can log in with password `test`
- Install dependencies `npm i`
- run lint check `npm run lint`
- Start app `npm start`

## Database restore (existing functionality)
- Please follow this article [restore](http://www.postgresql.org/docs/9.5/static/backup-dump.html#BACKUP-DUMP-RESTORE)
- or  [restore on heroku](https://devcenter.heroku.com/articles/heroku-postgres-import-export) to restore dump file in `test_files\games.psql`.
- I actually create sample module to reset database easily you can just configure databae url rightly, start application and run reset request in demo folder in postman.

- manually restore required database dump by above guides, or **launch postman(after deployed to heroku), goto demo -> reset, click send**

## **Email Database Setup**

- all email data will go to table `emails`
- after you did database restore above,
- execute `test_files/sql/email.sql` on heroku postgres.

            $ cat test_files/sql/email.sql | heroku pg:psql
            ---> Connecting to DATABASE_URL
            SET
            SET
            SET
            SET
            SET
            SET
            SET
            SET
            SET
            SET
            DROP TABLE
            CREATE TABLE
            GRANT
            GRANT


## Test and Coverage
  - Follow *Database restore* to input test data
  - Make sure `test_files/sql/email.sql` has been executed
  - Make sure `test_files/sql/demo.sql` has been executed
  - Adjust some test data in `test/test-helper.js`
    - EX `emailIdDelivered`, this is email id which has delivered successful.
      If We use email id just sent, we may get `404 Not Found` error
      or not delivered response, both make test fail.
      So we need input a successful delivered email id manually.
  - Run test `npm run test`
  - Report Coverage
    - `npm install -g istanbul`
    - `npm run coverage`

        ...
        2016-09-13T20:33:46.340Z - debug: undefined
        POST /api/v1/reset 200 162.002 ms - -
            ✓ reset (163ms)


          84 passing (9s)

        =============================================================================
        Writing coverage object [/home/stevenfrog/temp/TC-StartPack-Nodejs-test-coverage/Topcoder-StarterPac
        k_Node-Backend/coverage/coverage.json]
        Writing coverage reports at [/home/stevenfrog/temp/TC-StartPack-Nodejs-test-coverage/Topcoder-Starte
        rPack_Node-Backend/coverage]
        =============================================================================

        =============================== Coverage summary ===============================
        Statements   : 92.44% ( 1369/1481 )
        Branches     : 64.62% ( 221/342 )
        Functions    : 100% ( 134/134 )
        Lines        : 92.35% ( 1352/1464 )
        ================================================================================



## Setup postman
- Load postman collection:

  - endpoints: IBP.email.postman_collection.json
  - environment: IBP.email.postman_environment.json

- postman environment variables:

  - `URL` the base API url  for local testing use `http://localhost:3000` or heroku app url
  - `TOKEN` sample super role token
  - `ADMIN_TOKEN` sample admin role token
  - `USER_TOKEN` sample user role token
  - `NOROLES_TOKEN` sample user without roles token
  - `INVALID_TOKEN` sample invalid token
  - `mailId` id assigned to email, after you sucessfully sent/queued an email you'll be assigned one
  - `address` email address to send/receive, because mailgun doesn't support mailing to outside or mailing to many receivers unless you own a domain, this address will be used as sender/receiver. so use your address to verify a mail is sent to you. use the mail address you used in registering to mailgun
  - `b64image` topcoder logo encoded in base64 to test image attachment functionality

## **Email Postman verification**

- added mail folder to postman collection
- ![http://i.imgur.com/7Cob7hO.png](http://i.imgur.com/7Cob7hO.png)
- send email
- ![http://i.imgur.com/zMnqUPa.png](http://i.imgur.com/zMnqUPa.png)
- get email
- ![http://i.imgur.com/uXyQNmi.png](http://i.imgur.com/uXyQNmi.png)
- get delivery status
- ![http://i.imgur.com/cTA3E1Z.png](http://i.imgur.com/cTA3E1Z.png)
- delete email (this deletes mail from heroku backend, does not cancel actual mail)

## **Email API**
- check `api/emailApi.yaml` for swagger definition.
- POST `/emails` endpoint to send an email
- to set custom headers:


        "headers": [
          "x-test-header:1234" <== {{headerName}}:{{headerValue}}
        ]


- to schedule a mail to be sent in the future, set `delivery_time` in ISO 8601 date format.
- for attachments, `content_bytes` should be string in base64 of original binary data.

        "attachments": [{
            "file_name": "blank.txt",
            "file_type": "text",
            "content_bytes": "IAo="
        }]

- after a successful POST to `/emails` endpoint, an email ID will be assigned, sample response:

        200 Ok
        {
          "result": {
            "success": true,
            "code": 200
          },
          "id": 3
        }

- use above `id` to track delivery status, by `/emails/{id}/deliveryStatus` endpoint.

## On Mailgun Api

- If you set multiple mail receivers, their api doesn't support tracking properly
- Mailgun explicitly states (https://documentation.mailgun.com/api-events.html) that their event api isn't updated right on time, and users are required to throw away the result reported from the mailgun api and repeat the request on their discretion. so, for tracking, it's possible that in some cases 1) mail is sent (it is in my inbox) 2) but their event api isn't updated.

## Additional functionality

- `GET /emails/stats` endpoint for tracking Mailgun usage for past 1 month.

## Module system for future developers

- structure modules in each folder, `src/modules/<module name>`
- put controllers for each module in `src/modules/<module name>/controllers`
- put services for each module in `src/modules/<module name>/services`
- a module should have `routes.js` on top, `src/modules/<module name>/routes.js`. declare routes to controllers in this file.
- use relative imports, e.g ) `const service = require('../services/fooService');` to load services from controllers within a module, or import between services within a module.
- currently existing modules: `crud`, `sample`, `mail`
- how the modules are loaded: `src/app-routes.js` will glob `src/modules/*/routes.js` and load them.
- remove a module from application by deleting a module directory.

## Authentication & Authorization

- It will use  [passport](http://passportjs.org/) and it could support social feature to login as twitter, facebook easily.
- It will use `src/app-passport.js` to load passport strategies in **src/passports**, you can define `auth:{name of passport strategy}` in `routes.js` of module.
- You can also define `access:[role1,role2]`, the user role name is from `src/constants.js`.
- It will check Authentication & Authorization in `src/app-routes.js` to secure your APIs.
