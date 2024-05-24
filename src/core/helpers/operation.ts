import { GlobalEntities } from '@core/data/types/query/global.entities';
import { throwError } from '@core/settings/base/errors/base.error';

export const catcher = async (promise: () => any, service?: GlobalEntities) => {
  try {
    const result = await promise();

    return result;
  } catch (error) {
    const showError = process.env.NODE_ENV === 'develop';

    const status = error.status ?? 500;

    const method = error.config?.method ?? 'NOT PROVIDED';
    const data = error.message ?? 'NOT PROVIDED';
    const date = new Date().toISOString();

    console.log(
      `🚀 ~ catcher: error ~ Status: ${status} ~ Method: ${method} ~ ... ${date} ... ||==> service: ${
        service ?? 'NOT PROVIDED'
      }\nReason: ${JSON.stringify(data)}`,
    );

    if (showError) console.log(`Stack was: ${error.stack}`);

    throwError(error.message, status);
  }
};
