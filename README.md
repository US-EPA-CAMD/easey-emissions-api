# EASEY Emissions API TEST
[![GitHub](https://img.shields.io/github/license/US-EPA-CAMD/easey-emissions-api)](https://github.com/US-EPA-CAMD/easey-emissions-api/blob/develop/LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=US-EPA-CAMD_easey-emissions-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=US-EPA-CAMD_easey-emissions-api)
[![Develop Branch Pipeline](https://github.com/US-EPA-CAMD/easey-emissions-api/workflows/Develop%20Branch%20Workflow/badge.svg)](https://github.com/US-EPA-CAMD/easey-emissions-api/actions)<br>
Emissions data API for the EPA CAMD Business Systems EASEY Application
​

The emissions API endpoints return the hourly values for the measured parameters, calculated hourly emissions values, control technologies, unit type, and unit fuel types for the associated unit described in a facility’s monitoring plan.
​
## Getting Started
​
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Set environment variables
- Establish cloud.gov SSH tunnel

**Environment Variables**

You will need to set up the following environment variables in order to access the database. These are to be used for development purposes only.

- EASEY_DB_HOST: localhost
- EASEY_DB_PORT: `LOCAL_PORT` used in the SSH tunnel

Please reach out to an EPA tech lead (see Mike Heese or Jason Whitehead) to get the values for these variables

- EASEY_DB_NAME
- EASEY_DB_PWD
- EASEY_DB_USER
 

**Cloud.gov SSH tunnel**

1. [Log in and set up the command line](https://cloud.gov/docs/getting-started/setup/#set-up-the-command-line) 

2. Target the development org (you will need to be granted permission to access this):
```bash
cf target -o epa-easey -s dev
```
3. Open SSH tunnel
```bash
cf ssh emissions-api -L <LOCAL_PORT>:<DB_HOST>:5432
```
4. Keep the SSH tunnel open while running the application

> NOTE: For more information on cloud.gov, please refer to their [documentation](https://cloud.gov/docs/).

### Installing
1. Open your terminal and navigate to the directory you wish to store this repository.

2. Clone this repository

    ```shell
    # If using SSH
    git clone git@github.com:US-EPA-CAMD/easey-emissions-api.git
    
    # If using HTTPS
    git clone https://github.com/US-EPA-CAMD/easey-emissions-api.git
    ```

3. Navigate to the root project directory

    ```
    cd easey-emissions-api
    ```

4. Install dependencies 
    
    ```
    npm install
    ```
### Run the appication 

From within the `easey-emissions-api` project directory, you can run:

```bash
# Runs the api in the development mode
npm run start:dev
```

Open [http://localhost:8080/api/emissions-mgmt/swagger/](http://localhost:8080/api/emissions-mgmt/swagger/) to view swagger documentation.
> NOTE: The port can be changed by setting the EASEY_EMISSIONS_MGMT_API_PORT environment variable

The page will reload if you make edits via the use of nodemon.<br />
You will also see any lint errors in the console.

```bash
# for production mode
npm run start
```

### Run the tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## API Endpoints

Please refer to the [Emissions Management API Swagger Documentation](https://easey-dev.app.cloud.gov/api/emissions-mgmt/swagger/) for descriptions of the endpoints.

## Built With
​
[NestJS](https://nestjs.com/) - server-side Node.js framework

[Cloud.gov](https://cloud.gov/) - Platform as a Service (PaaS)
​ 
​
## License & Contributing
​
This project is licensed under the MIT License. We encourage you to read this project’s [License](LICENSE), [Contributing Guidelines](CONTRIBUTING.md), and [Code of Conduct](CODE_OF_CONDUCT.md).






