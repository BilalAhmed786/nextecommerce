// types.d.ts
declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client/core';
  interface UploadLinkOptions {
    uri?: string;
    headers?: Record<string, string>;
    credentials?: 'include' | 'same-origin' | 'omit';
    fetchOptions?: any;
    fetch?: WindowOrWorkerGlobalScope['fetch'];
  }

  export function createUploadLink(options?: UploadLinkOptions): ApolloLink;
}
