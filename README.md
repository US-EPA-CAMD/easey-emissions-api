# EASEY Emissions API
[![GitHub](https://img.shields.io/github/license/US-EPA-CAMD/easey-emissions-api)](https://github.com/US-EPA-CAMD/easey-emissions-api/blob/develop/LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=US-EPA-CAMD_easey-emissions-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=US-EPA-CAMD_easey-emissions-api)
[![Develop Branch Pipeline](https://github.com/US-EPA-CAMD/easey-emissions-api/workflows/Develop%20Branch%20Workflow/badge.svg)](https://github.com/US-EPA-CAMD/easey-emissions-api/actions)<br>
Emissions data API for EASEY.
​

The emissions API endpoints return the hourly values for the measured parameters, calculated hourly emissions values, control technologies, unit type, and unit fuel types for the associated unit described in a facility’s monitoring plan.
​
## Getting Started
​
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
​
### Installing
​
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
<br>

From within the `easey-emissions-api` project directory, you can run:

```bash
# Runs the api in the development mode
npm run start:dev
```

Open [http://localhost:8080/api/emissions-mgmt/swagger/](http://localhost:8080/api/emissions-mgmt/swagger/) to view swagger documentation.

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

**Hourly Apportioned Emissions** 
### ​GET /api/emissions-mgmt/apportioned/hourly

Gets all hourly apportioned emissions data including associated unit characteristics. 

Parameters:

Name | Required | Type | Path/Query
-- | -- | -- | --
page | optional | number | query
perPage | optional | number | query
orderBy | optional | string | query
beginDate | optional | date | query
endDate | optional | date | query
state | optional | string | query
orisCode | optional | number | query
unitType | optional | string | query
unitFuelType | optional | string | query
controlTechnologies | optional | string | query
opHoursOnly | optional | boolean | query

## Built With
​
[NestJS](https://nestjs.com/) - server-side Node.js framework 
​ 
​
## License
​
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details





