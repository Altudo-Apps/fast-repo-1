import {
  createGraphQLClientFactory,
  // GraphQLRequestClientFactory,
  // RetryStrategy,
  SitecoreClient,
  //SitecoreClientInit,
} from '@sitecore-content-sdk/nextjs/client';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import { ExtendedGraphQLLayoutService } from './layout/extended-graphql-layout-service';
import { ExtendedGraphQLEditingService } from './layout/extended-graphql-editing-service';

const defaultSiteName =
  scConfig.defaultSite || (Array.isArray(sites) && sites.length > 0 ? sites[0].name : undefined);

const graphQLEditingService = new ExtendedGraphQLEditingService({
  clientFactory: createGraphQLClientFactory({
    api: scConfig.api,
    retries: scConfig.retries.count,
    retryStrategy: scConfig.retries.retryStrategy,
  }),
  defaultSiteName,
});

const graphQLLayoutService = new ExtendedGraphQLLayoutService({
  clientFactory: createGraphQLClientFactory({
    api: scConfig.api,
    retries: scConfig.retries.count,
    retryStrategy: scConfig.retries.retryStrategy,
  }),
});

const client = new SitecoreClient({
  //sites,
  ...scConfig,
  custom: {
    layoutService: graphQLLayoutService,
    editingService: graphQLEditingService,
  },
});

export default client;
