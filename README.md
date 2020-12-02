### Overview

- This is a simple console program to fetch all songs from Genius API that belongs to an artist.

### How it works
- Given an artist name, the program authenticates with Gennius API based on the user-supplied token.
- Then it fetches for artistId based on artist name, then fetches all songs that belongs to that id.
- If there is error, the program retries 5 times and wait for 2 seconds between each attempt. The request module is wrapped under [Bottleneck](https://github.com/SGrondin/bottleneck) which allows more rate limiting control ability if needed.

### How to run
- Prerequisite: Node >= 15.3.0 (this is needed for some advanced syntax such as optional chaining)
- Go to [Genius API](https://docs.genius.com/#/authentication-h1), obtain your own token put it in `.env` file (see `.env.example` for reference). The credential will be loaded into runtime using [dotenv](https://github.com/motdotla/dotenv) package.
- This can be run directly if Node requirements is satisfied: `npm test && npm start <your artist name>` (artist will default to Linkin Park - my favorite band if not provided).
- Or it can be run via Docker as well: `docker-compose up --build` (edit your artist name in Dockerfile last line)
- Settings such as pagination etc.. can be configured in config/ folder. It's possible to config a proxy as well.
- The API is mocked and tested using [msw](https://mswjs.io/) and [jest](https://jestjs.io/).