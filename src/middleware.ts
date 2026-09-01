import type {
  AfterResponseMiddleware,
  BeforeRequestMiddleware,
  HttpResponse,
} from 'zapier-platform-core';

const ERROR_MESSAGES: Record<number, [string, string]> = {
  401: ['The API key is invalid, expired, or revoked.', 'AuthenticationError'],
  403: ['This API key does not have permission to perform this operation.', 'PermissionError'],
  404: ['The requested Screpy record could not be found.', 'NotFoundError'],
  409: ['This operation conflicts with the current Screpy state.', 'ConflictError'],
  422: ['Screpy could not validate the supplied fields.', 'ValidationError'],
  503: ['Screpy is temporarily unavailable. Try again later.', 'ServiceUnavailableError'],
};

const retryDelay = (response: HttpResponse): number => {
  const raw = response.getHeader?.('retry-after');
  const seconds = Number(raw);

  return Number.isFinite(seconds) && seconds > 0 ? seconds : 60;
};

export const includeApiKey: BeforeRequestMiddleware = (request, _z, bundle) => {
  if (request.method === 'PATCH' && /\/v1\/projects\/[^/?]+(?:\?.*)?$/.test(request.url)) {
    request.method = 'POST';
  }

  request.headers = {
    Accept: 'application/json',
    ...request.headers,
  };

  if (bundle.authData.api_key) {
    request.headers.Authorization = `Bearer ${bundle.authData.api_key}`;
  }

  return request;
};

export const handleBadResponses: AfterResponseMiddleware = (response, z) => {
  if (response.status === 429) {
    throw new z.errors.ThrottledError(
      'Screpy is receiving too many requests. Zapier will retry this step.',
      retryDelay(response),
    );
  }

  const mapped = ERROR_MESSAGES[response.status];

  if (mapped) {
    throw new z.errors.Error(mapped[0], mapped[1], response.status);
  }

  if (response.status >= 400) {
    throw new z.errors.Error(
      'Screpy could not complete this request. Try again later.',
      'ScrepyRequestError',
      response.status,
    );
  }

  return response;
};

export const befores = [includeApiKey];
export const afters = [handleBadResponses];
