# Bon Iver Ticket Scraper

Bon Iver played the [Playhouse Square on March 29, 2019 in Cleveland](http://www.playhousesquare.org/events/detail/bon-iver). It sold out. I wrote a script using puppeteer and deployed it to [Google Cloud](https://cloud.google.com/). Every 15 minutes, check the Playhouse Square website, if (good) tickets become available, then send me a text message.

## Account Dependencies

- Twilio
- Google App Cloud

## CLI Dependencies

- [yarn](https://yarnpkg.com/en/)
- [gcloud](https://cloud.google.com/sdk/gcloud/)

## Development

1. Duplicate `.env-sample` as `.env`
2. `yarn install`
3. `node app`

Access server at http://localhost:8080

## Deploy

```
npm run deploy
```
