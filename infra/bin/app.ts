#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CommonStack } from '../lib/stacks/common-stack';
import { StorageStack } from '../lib/stacks/storage-stack';
import { getConfig } from './getConfig';
import { ApiServiceStack } from '../lib/stacks/api-service-stack';
import { FrontendStack } from '../lib/stacks/frontend-stack';

enum TAGS {
  PROJECT = 'project',
  ENVIRONMENT = 'environment',
}

const app = new cdk.App();
const config = getConfig(app);

/** Common resources */
const commonStack = new CommonStack(app, `${config.environment}CommonStack`, {
  env: {
    account: config.awsAccountId,
    region: config.awsRegion,
  },
  appPrefix: config.appPrefix,
  cidr: config.vpcCidr,
  envName: config.environment,
  natGatewaysCount: config.natGatewaysCount,
  vpcSsmParam: config.vpcSsmParam,
  albArnSsmParam: config.albArnSsmParam,
  albListenerSsmParam: config.albListenerSsmParam,
  ecsExecRoleSsmParam: config.defaultEcsExecRoleSsmParam,
  ecsTaskRoleSsmParam: config.defaultEcsTaskRoleSsmParam,
  ecsClusterName: config.ecsClusterName,
  albSecurityGroupSsmParam: config.albSecurityGroupSsmParam,
  envSubdomain: config.envSubdomain,
  dns: config.dns,
});
cdk.Tags.of(commonStack).add(TAGS.PROJECT, 'crowd');

/** Database */
const databaseStack = new StorageStack(
  app,
  `${config.environment}DatabaseStack`,
  {
    env: {
      account: config.awsAccountId,
      region: config.awsRegion,
    },
    appPrefix: config.appPrefix,
    envName: config.environment,
    vpcSsmParam: config.vpcSsmParam,
    isPubliclyAccessible: config.dbPublicAccess,
    dbCredentialSecret: config.dbCredentialSecret,
    dbSecurityGroupSsmParam: config.dbSecurityGroupSsmParam,
    publicFilesBucketName: config.publicFilesBucketName,
  },
);

/** API service */
const { apiService } = config;
const apiServiceStack = new ApiServiceStack(
  app,
  `${config.environment}ApiServiceStack`,
  {
    env: {
      account: config.awsAccountId,
      region: config.awsRegion,
    },
    envName: config.environment,
    appPrefix: config.appPrefix,
    albArnSsmParam: config.albArnSsmParam,
    albSecurityGroupSsmParam: config.albSecurityGroupSsmParam,
    albListenerSsmParam: config.albListenerSsmParam,
    dbSecurityGroupSsmParam: config.dbSecurityGroupSsmParam,
    vpcSsmParam: config.vpcSsmParam,
    ecsExecRoleSsmParam: config.defaultEcsExecRoleSsmParam,
    ecsTaskRoleSsmParam: config.defaultEcsTaskRoleSsmParam,
    ecsClusterName: config.ecsClusterName,
    rootDomainName: apiService.rootdomain,
    subdomain: apiService.subdomain,
    dockerPort: apiService.dockerPort,
    dockerLabels: apiService.dockerLabels,
    command: apiService.command,
    albPort: apiService.albPort,
    routingPriority: apiService.priority,
    serviceName: apiService.serviceName,
    dockerImageUrl: apiService.dockerImageUrl,
    cpu: apiService.cpu || 512,
    memory: apiService.memory || 1024,
    serviceTasksCount: apiService.taskCount || 1,
    healthCheckPath: apiService.healthCheckPath || '/',
    environmentVars: [
      {
        AWS_REGION: config.awsRegion,
      },
      {
        REACT_APP_SERVER_URL: `https://${apiService.rootdomain}`,
      },
      {
        EMAIL_SERVER: `https://${apiService.rootdomain}`,
      },
      {
        PORT: String(apiService.dockerPort),
      },
    ],
    secrets: [
      {
        taskDefSecretName: 'CR_DB_USER',
        secretsManagerSecretName: config.dbCredentialSecret,
        secretsMangerSecretField: 'username',
      },
      {
        taskDefSecretName: 'CR_DB_PASSWORD',
        secretsManagerSecretName: config.dbCredentialSecret,
        secretsMangerSecretField: 'password',
      },
      {
        taskDefSecretName: 'CR_DB',
        secretsManagerSecretName: config.dbCredentialSecret,
        secretsMangerSecretField: 'dbname',
      },
      {
        taskDefSecretName: 'CR_DB_URL',
        secretsManagerSecretName: config.dbCredentialSecret,
        secretsMangerSecretField: 'host',
      },
      {
        taskDefSecretName: 'CR_DB_PORT',
        secretsManagerSecretName: config.dbCredentialSecret,
        secretsMangerSecretField: 'port',
      },
    ],
  },
);

/** API docs */
const { docsApp } = config;
const docsStack = new FrontendStack(app, `${config.environment}DocsAppStack`, {
  env: {
    account: config.awsAccountId,
    region: config.awsRegion,
  },
  appPrefix: config.appPrefix,
  envName: config.environment,
  domainName: docsApp.domainName,
  appId: docsApp.appId,
  enabled: docsApp.enabled,
  createCustomDomain: docsApp.createCustomDomain,
});

/** Tags */
cdk.Tags.of(app).add(TAGS.ENVIRONMENT, config.environment);
cdk.Tags.of(databaseStack).add(TAGS.PROJECT, 'crowd');
cdk.Tags.of(apiServiceStack).add(TAGS.PROJECT, 'crowd');
cdk.Tags.of(docsStack).add(TAGS.PROJECT, 'crowd');
