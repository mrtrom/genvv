# genvv

This is a tool to create environment files by collecting data from various apis as source for variables and values.

_It needs a file with the list of variables to set._

## Installation

```
$ npm install -g @alltherooms/genvv
```

## Usage

This is a quick example about it. Let's say we need to set a variable `FOO=bar` in our application environment. Steps are:

1. Create values in AWS Parameter Store or AWS Secrets Manager

2. Ensure the host **from which your application is deployed** has access to it through AWS credentials or IAM role, and it has the correct policies applied.

3. Create a file with a list of environment variables to set during deploy. Example:

```env
# All variables will get a value from a source.
# Comment lines are removed.
DATABASE_HOST
DATABASE_PASS
MY_VAR
SOMETHING_KEY="default-value"
```

4. It will then get the values for the variables and put the `.env` file in the host where our application runs.

**NOTE:** You can get credential locally if you run the same comand:
```shell
genvv --env-vars my-env-vars > .env
```

### Providers

The default providers are AWS Parameter Store and AWS Secrets Manager.

Provider order is important, for example in `[vp1, vp2]`, values from vp1 will take precedence.

The function signature of a provider is:

```
async (keys: Array<string>, config: Object) => Object
```

```
$ npm install -g genvv
$ genvv --version
v0.0.1
$ genvv --help
Usage:
  genvv [OPTIONS] --env-vars [FILE]

General options:
  --help           Print this help info and exit.
  --version        Print version of this command and exit.

Runtime options:
  --region         AWS region to use. E.g.: us-east-1.

Output options:
  --add-export     Add "export" before each ENV var.

See <https://github.com/mrtrom/genvv> for more complete docs.
Please report bugs to <https://github.com/mrtrom/genvv/issues>.
```