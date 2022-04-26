## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

#running migrations
$ npm run migration:run
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## GraphQL commands
```graphql
query getUserRewards($date: Date!, $userId: ID!) {
  userRewards(userId: $userId, date: $date) {
    expiresAt
    availableAt
    redeemedAt
  }
}
  
mutation redeemReward($date: Date!, $userId: ID!) {
  redeemReward(date:$date, userId:$userId) {
    redeemedAt
    expiresAt
    availableAt
  }
}
```

## License

[MIT licensed](LICENSE).
