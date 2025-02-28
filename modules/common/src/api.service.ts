import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';

import { IDEAEnvironment } from '../environment';

/**
 * To communicate with an AWS API Gateway istance.
 * Lighter, alternative version of _IDEAAWSAPIService_.
 */
@Injectable({ providedIn: 'root' })
export class IDEAApiService {
  protected _env = inject(IDEAEnvironment);
  private _platform = inject(Platform);

  /**
   * The base URL to which to make requests.
   */
  baseURL: string;
  /**
   * A reference to the current's app version.
   */
  appVersion: string;
  /**
   * A reference to the current's app package (bundle).
   * It can be `undefined` in case the app doesn't have a (mobile) app bundle.
   */
  appBundle: string;

  /**
   * Passed as `Authorization` header.
   */
  authToken: string | (() => Promise<string>);
  /**
   * Passed as `X-API-Key` header.
   */
  apiKey: string;

  /**
   * Some custom headers to set so that they are used in any API request.
   */
  defaultHeaders: Record<string, string | number> = {};

  constructor() {
    this.baseURL = 'https://'.concat([this._env.idea.api?.url, this._env.idea.api?.stage].filter(x => x).join('/'));
    this.appVersion = this._env.idea.app?.version || '?';
    this.appBundle = this._env.idea.app?.bundle;
  }

  /**
   * Execute an online API request.
   * @param path resource path (e.g. `['users', userId]`)
   * @param method HTTP method
   * @param options the request options
   */
  protected async request(
    path: string[] | string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    options: ApiRequestOptions = {}
  ): Promise<any> {
    const url = this.baseURL.concat('/', Array.isArray(path) ? path.join('/') : path);

    const builtInHeaders: any = {};
    if (this.authToken) {
      if (typeof this.authToken === 'function') builtInHeaders.Authorization = await this.authToken();
      else builtInHeaders.Authorization = this.authToken;
    }
    if (this.apiKey) builtInHeaders['X-API-Key'] = this.apiKey;

    const headers: any = { ...builtInHeaders, ...this.defaultHeaders, ...options.headers };

    const searchParams = new URLSearchParams();
    searchParams.append('_v', this.appVersion);
    searchParams.append('_p', this._platform.platforms().join(' '));
    if (this.appBundle) searchParams.append('_b', this.appBundle);
    if (options.params) {
      for (const paramName in options.params) {
        const param = options.params[paramName];
        if (Array.isArray(param)) for (const arrayElement of param) searchParams.append(paramName, arrayElement);
        else searchParams.append(paramName, param as string);
      }
    }

    let body: any = null;
    if (options.body) body = JSON.stringify(options.body);

    const res = await fetch(url.concat('?', searchParams.toString()), { method, headers, body });
    if (res.status === 200) return await res.json();

    let errMessage: string;
    try {
      errMessage = (await res.json()).message;
    } catch (err) {
      errMessage = 'Operation failed';
    }
    throw new Error(errMessage);
  }

  /**
   * GET request.
   */
  async getResource(path: string[] | string, options?: ApiRequestOptions): Promise<any> {
    return await this.request(path, 'GET', options);
  }

  /**
   * POST request.
   */
  async postResource(path: string[] | string, options?: ApiRequestOptions): Promise<any> {
    return await this.request(path, 'POST', options);
  }

  /**
   * PUT request.
   */
  async putResource(path: string[] | string, options?: ApiRequestOptions): Promise<any> {
    return await this.request(path, 'PUT', options);
  }

  /**
   * PATCH request.
   */
  async patchResource(path: string[] | string, options?: ApiRequestOptions): Promise<any> {
    return await this.request(path, 'PATCH', options);
  }

  /**
   * DELETE request.
   */
  async deleteResource(path: string[] | string, options?: ApiRequestOptions): Promise<any> {
    return await this.request(path, 'DELETE', options);
  }
}

/**
 * The options of an API request.
 */
interface ApiRequestOptions {
  /**
   * The additional headers of the request.
   * The headers "Authorization" and "X-API-Key" are included by default, if set.
   * The headers set in `defaultHeaders` are always added to any API request.
   */
  headers?: { [key: string]: string | number | boolean };
  /**
   * The query parameters of the request.
   */
  params?: { [key: string]: string | number | boolean };
  /**
   * The body of the request.
   */
  body?: any;
}
