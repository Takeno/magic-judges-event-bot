# Magic Judge Events Bot

This is a simple Discord Bot to get notified when applications are open for events you like.

It parses https://apps.magicjudges.org/events using filters defined in `config.json`, and publish it on Discord.

![Italian Discord Server](./resources/screenshot.png)


## Requirements
1. You need [Node.js](https://nodejs.org)
1. You need [Discord WebHook url](https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
1. [Configure](#configuration) it
1. Run it with `npm start`


## Available scripts
### `npm run build`
Each file in `src` is transpiled in `lib` directory using `babel`. It's required for production.

### `npm start`
Bot starts in production mode. It depends on artifacts of `npm run build` which must be run before.

### `npm run start:dev`
It starts the bot in dev mode, using `babel-node` for runtime transpiling.

### `npm run lint`
It checks for code style validations

### `npm run flow`
It checks for type validations


## Docker commands
`docker-compose` is used to run both redis and lowdb environments in dev mode (using `babel-node`).

`docker-compose -f docker-compose.lowdb.yml run bot` to run the bot using lowdb as database.<br />
`docker-compose -f docker-compose.redis.yml run bot` to run the bot using redis as database.

## How it works

On start, the script makes requests to [AppJudges' events](https://apps.magicjudges.org/events) with defined filters. It parses the contents and converts them in Event objects.

Each Event is searched inside internal database to avoid post duplications. New events will be sent to Discord using Webhook url, then will be saved in database.

## Configuration

In order to get only events you want, you must create a `config.json` file with the filters you need. Use `config.sample.json` as model.

### Events
```json
{
    "events":[{
        "types": ["GRAND_PRIX", "PRO_TOUR"]
    }, {
        "countries": ["ITALY_AND_MALTA"]
    }]
}
```

The `events` key refers to an array of requests. Each request is a combination of `types` and `countries`.

In example given, we want all GP and PT **and** all events in Italy. It will make two requests to JudgeApps to get these informations.

If we want get notified about PPTQ in USA - North, USA - Northeast and USA - Northwest, we need this config:

```json
{
    "events": [{
        "types": ["PPTQ"],
        "countries": ["USA_NORTH", "USA_NORTHEAST", "USA_NORTHWEST"]
    }]
}
```

### Discord Webhook

To publish content on Discord channel, you need the [Discord Webhook Url](https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks). Once you have it, there are two ways to use it:
1. Define `DISCORD_WEBHOOK` key in `config.json`
```json
{
    "DISCORD_WEBHOOK": "https://discordapp.com/api/webhooks/[...]"
}
```
2. Define `DISCORD_WEBHOOK` as environment variable:
```sh
$ DISCORD_WEBHOOK=https://discordapp.com/api/webhooks/[...] npm start

# or

$ export DISCORD_WEBHOOK=https://discordapp.com/api/webhooks/[...]
$ npm start
```

### Language
You can choose the output language by adding a `language` key to your `config.json` file:
```json
{
    "language": "it"
}
```

The default language is English. Available languages at this time are:
| Language | Code |
| -------- | ---- |
| English | `en` |
| Italian | `it` |

Help on translations is warmly welcome. Translating this tool in your own language is very quick, since it's made of just a couple sentences.

### Persistency
To avoid posting double, we need to save what events are already sent.
There are two db providers:
1. `lowdb` which will save events on a json file
2. `redis` which will save events on a redis server

`lowdb` is the default provider. To use Redis, you have to use some environment variables:

```bash
$ export DB=redis
$ export REDIS_URL=<redis server>
```

### Dry run

To test your configuration, you can run bot in DRY_RUN mode. In this way, you'll get only info about what will be published.

```sh
$ DRY_RUN=1 npm start

Posting  { id: '8677',
  name: 'Grand Prix Houston 2018',
  url: 'https://apps.magicjudges.org/events/8677/',
  location: 'Houston, Texas, United States',
  eventDate: 'Jan. 26, 2018-Jan. 28, 2018',
  applicationClose: '2017-11-10',
  applicationCloseRemaining: '3 weeks, 4 days' }
```

You can also set the logger level to `debug` instead of the default `info`, by adding an additional environment variable. This way, you will also see a log of the actual text that would be sent to Discord:
```sh
$ DRY_RUN=1 LOGGER=debug npm start

Posting  { id: '8677',
  name: 'Grand Prix Houston 2018',
  url: 'https://apps.magicjudges.org/events/8677/',
  location: 'Houston, Texas, United States',
  eventDate: 'Jan. 26, 2018-Jan. 28, 2018',
  applicationClose: '2017-11-10',
  applicationCloseRemaining: '3 weeks, 4 days' }

DRY_RUN selected.
Posted event infos:
Description:
**Date:** Jan. 26, 2018-Jan. 28, 2018
**Location:** Houston, Texas, United States
**Applications close:** 2017-11-10
Content:
Applications are open for **Grand Prix Houston 2018**! Applications will close in: *3 weeks, 4 days*
```

## Running on Heroku

```bash
$ heroku create
$ heroku addons:create rediscloud:30
$ heroku config:set NPM_CONFIG_PRODUCTION=false
$ heroku config:set DRY_RUN=1
$ heroku config:set DB=redis
$ heroku config:set DISCORD_WEBHOOK=<discord webhook>
# Copy REDISCLOUD url from:
$ heroku config
# Paste it in REDIS_URL:
$ heroku config:set REDIS_URL=<rediscloud url>
$ git push heroku master
# To see logs:
$ heroku logs

# Add scheduler
$ heroku addons:add scheduler
# Set scheduler with your frequency
$ heroku addons:open scheduler
```