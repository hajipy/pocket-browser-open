# pocket-browser-open
This is command line tool for [Pocket](https://getpocket.com/). Open multiple unarchived items at once in Browser.

## Motivation
I add 50+ items to Pocket per day for read at home. 
Opening these items in Browser is takes time and effort.
I want to open and archive these items at once.

## Installation
```sh
yarn add https://github.com/hajipy/pocket-browser-open.git
```

_(Do you need register this to npm registry? Please contact me.)_

## Usage
### 1. Create your Pocket application
[https://getpocket.com/developer/apps/new](https://getpocket.com/developer/apps/new)

- Required permissions are `Modify` and `Retrieve`.
- Select your platform. (I tested this tool on Mac only)

### 2. Set Environment Variable
Set your Pocket consumer token value to `POCKET_CONSUMER_KEY` environment variable and export it.

### 3. Run Tool
```sh
yarn pocket-browser-open
```

Available Options

| Option | Description |
|--------|-------------|
| -h, --host host | Only open items from particular host. |
| -n, --count count | Open items count. (default is 10) |

## License
MIT
