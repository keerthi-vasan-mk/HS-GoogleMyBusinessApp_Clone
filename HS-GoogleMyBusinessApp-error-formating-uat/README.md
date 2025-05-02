# Introduction

This React application creates three different Hootsuite stream applications for Google My Business. The available streams
are Questions, Reviews, and Posts.

# About

This is the frontend application for the Hootsuite GMB integration. It is rendered inside an iFrame in the main Hootsuite
dashboard and makes use of the Hootsuite SDK (`hsp.js`). Authentication is handled in two parts, with Hootsuite's main
dashboard authenticating the user with their Hootsuite credentials on app load, and Google's API authenticating the user when
they click "Login with Google My Business". This app is compiled differently than most apps, as there are two JavaScript
bundles (`bundle-main-[hash].js` and `bundle-modal-[hash].js`), not only one. This is due to the fact that Hootsuite renders
its modals in a separate iFrame, requiring our app to be split into two "mini" apps. To see how this works, look at the
`commonConfig` variable in `webpack.config.js`, and `server.js`.

This application also renders the Hootsuite GMB Admin dashboard at the `/app/admin` route. This dashboard allows a Hootsuite
administrator to login using a set of FreshWorks provided credentials and see a list of metrics for the whole app, by user,
or locations. It also allows them to send info or warning notifications to the streams.

# Setup Instructions

## Docker Installation Instructions

The application is running on Docker. Follow the instructions below to install with Docker.

### Requirements

- Docker
- Make
- Node (Version 8)

### Configuration

This project uses a `.env` file for setting the build variables. Each environment (dev [local], tests, prod) has different
settings, defined in their respective `.config/.env.[environment]` file.

The `.env` file at the root of the project is the 'active' configuration. Utilizing the Make commands will toggle in the
applicable environment configuration.

The following are the configuration variables that are expected to be set

| Env Var       | Default         | Description                                     |
| ------------- | --------------- | ----------------------------------------------- |
| `PROJECT`     | `hootsuite-gmb` | Used for tagging the images.                    |
| `ACCOUNT_ID`  |                 | AWS Account ID for the project.                 |
| `REGION`      |                 | AWS deployment region.                          |
| `PROFILE`     |                 | AWS profile to use for all deployment commands. |
| `ENVIRONMENT` |                 | Environment to deploy to.                       |
| `BUCKET_NAME` |                 | ECR bucket name.                                |

### Building

All builds (local, production, staging etc.) are available through the Make commands. Local development, however, is best
done by following the steps in Installation.

| Make Command          | Description                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `make local`          | Builds the container based on your local git branch.                                                        |
| `make close-local`    | Closes the local development containers and networks.                                                       |
| `make deploy-dev`     | Builds the container based on the dev settings files. Pushes the containers and deploys them to AWS.        |
| `make deploy-staging` | Builds the container based on the staging settings files. Pushes the containers and deploys them to AWS.    |
| `make deploy-prod`    | Builds the container based on the production settings files. Pushes the containers and deploys them to AWS. |
| `make healthcheck`    | Returns the status to the deployed AWS container.                                                           |

### Installation

- Open a terminal
- Clone the repository:

```
$ git clone git@bitbucket.org:freshworks/hootsuite-gmb-front.git
```

- One-time setup of the configuration files for local development:

```
$ cp .config/.env.example .env
```

- Ensure that you are using Node 8 (10 may work but is not recommended)
- From the `/app` directory:

```
$ npm ci
$ npm run build:local
$ npm run serve
```

This will install the dependencies onto your machine, build the project, and start a local server.

With the project running locally, you now must inject some Hootsuite-generated values to facilitate authentication with a
Hootsuite account. Follow the steps below:

1. Visit the [Hootsuite Dashboard](http://hootsuite.com/dashboard) and login. If you don't have a Hootsuite account, you can
   ask the Web team for access to an existing account or create your own.
2. Open the Network tab in the Developer Console and filter by "login"
3. Refresh the page.
4. If there are no network requests matching "login" then the dashboard may not contain the Google My Business stream(s). You
   should add them now if they aren't there and then refresh the page again. At this point, there should be a matching
   network request.
5. Inspect the payload for one of the matching requests. You should see an object with the following values populated:
   ```
   { pid: "", token: "", ts: "", uid: "" }
   ```
6. Check the initiator column to see which stream initiated the request (`stream-posts`, `stream-reviews`, or `stream-questions`). Using this information, fill out the following URL:

   ```
   http://localhost:3000/app/STREAM-TYPE?stream=STREAM-TYPE&lang=en&timezone=-28800&isSsl=1&theme=classic&i=19810861&pid=PID&uid=UID&ts=TS&token=TOKEN

   ```

   or open `GenerateUrl.ts` follow the directions to obtain the { pid: "", token: "", ts: "", uid: "" } and copy/paste those values into the app object of `GenerateUrl`

   run `npm run generateURL`

the url will print out in your console

7. Add 'http://localhost:3000' as the url in index.html (only for use in local devleopment - do not commit)

8. Open this URL in a browser. Your local app should now be ready for local development.

This process must be repeated every time you would like to authenticate the application for local development.

### Testing

To run the unit tests, issue the following commands from within the Docker container:

```
$ npm run test
```

### Deployment

With the proper `.env` config values, a deployment to Staging should work
simply by using the following command

```
$ make deploy-staging
```

However, due to the fact that Production is hosted on the client's AWS account,
which includes 2-factor authentication, the Make command for a Production
deployment will not work without further configuration and setup.

For full details on the Production deployment process, please review [this
page](https://sites.google.com/a/freshworks.io/developers/projects/hootsuite-gmb).

```

```
