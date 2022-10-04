import axios from 'axios';

interface IHerokuConfiguration {
  options?: Record<string, any>;
}

const main = async ({ options }: IHerokuConfiguration) => {
  const token = options?.herokuToken;
  const appName = options?.herokuAppName;

  const { status, data } = await axios.get(
    `https://api.heroku.com/apps/${appName}/config-vars`,
    {
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (status !== 200 || !data) {
    throw new Error('Got unsuccessful response. Please check your token.');
  }

  return data;
};

export default main;
