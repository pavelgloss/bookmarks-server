
## Installation

```bash
$ npm install
```

## pre-deploy.sh
- Check Current Branch: Ensures you are in the main branch.
- Warn About Uncommitted Changes: Notifies if there are uncommitted changes, but proceeds without stashing or committing them.- Force Push: git push origin main:deploy --force will push all committed changes to the remote deploy branch, overwriting it.
- This script ensures that only committed changes in your local main branch are pushed to the remote deploy branch, without affecting any uncommitted or unstaged changes.

## Running and building the app in prod

```bash
# prod
$ npm run build
$ npm start

## which is same as 
node dist/main.js

on droplet run

pm2 start dist/main.js


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database
* Using NeDB from https://www.npmjs.com/package/@seald-io/nedb for in-memory document storage (with same api as mongoDB)

## Swagger
* localhost:3000/api



## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Pavel Gloss](https://www.linkedin.com/in/pavelgloss/)

## License

TBD
