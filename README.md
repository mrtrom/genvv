# genvv

This is a tool that helps creating environment files by collecting data from various apis (providers) as source for variables and values.

## Installation

```
$ npm install -g genvv
```

### Providers

The default providers for AWSare AWS Parameter Store and AWS Secrets Manager.

Right now `genvv` supports:
- AWS Parameter Store
- AWS Secrets Manager
- Heroku (config vars)


Provider order is important, for example in `[p1, p2]`, values from p1 will take precedence.

## Usage

This is a quick example about it. Let's say we need to set a variable `FOO=bar` in our application environment:

### AWS

Ensure the host **from which your application is deployed** has access to it through AWS credentials or IAM role, and it has the correct policies applied.

#### Parameter Store & Secrets Manager

Create a file with a list of environment variables to set during deploy. Example:

```env
# All variables will get a value from a provider source.
# Comment lines are removed.
DATABASE_HOST # From Parameter Store
DATABASE_PASSWORD # From Parameter Store
DEFAULT_VARIABLE="default-value"
db/data-postgres # From Secrets Manager
```

Execute like:

```shell
genvv --aws --region=us-east-1 --env-vars my-env-vars-file > .env
```

It will then get the values for the variables and put the `.env` file in the host where our application runs.

### Heroku

For Heroku we need the **app name** and the [**API token**](https://help.heroku.com/PBGP6IDE/how-should-i-generate-an-api-key-that-allows-me-to-use-the-heroku-platform-api)

Execute like:

```shell
genvv --heroku --heroku-token=[your-token]--heroku-app-name=[app-name] > .env
```

It will then get the values for the variables and put the `.env` file in the host where our application runs.


```
$ npm install -g genvv
$ genvv --version
v0.0.1
$ genvv --help
  Usage:
    genvv [OPTIONS] --env-vars [FILE]
  
  General options:
    --help                Print this help info and exit
    --version             Print version of this command and exit
  
  Runtime options:
    --aws                 Specifies we're gonna use AWS providers
    --heroku              Specifies we're gonna use Heroku providers

    AWS Options:
      --region            AWS region to use. E.g.: us-east-1
      --env-vars          Environment variables (file location) to look for in AWS providers
    
    Heroku Options:
      --heroku-token      API Token
      --heroku-app-name   App name from where we're getting the config variables
  
  Output options:
    --add-export     Add "export" before each ENV var
  
  See <https://github.com/mrtrom/genvv> for more complete docs
  Please report bugs to <https://github.com/mrtrom/genvv/issues>
```