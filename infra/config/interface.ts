export interface EnvConfig {
  awsAccountId: string;
  awsRegion: string;
  environment: string;
  appPrefix: string;
  vpcCidr: string;
  natGatewaysCount: number;
  envSubdomain: string;
  ecsClusterName: string;
  publicFilesBucketName: string;
  vpcSsmParam: string;
  defaultEcsExecRoleSsmParam: string;
  defaultEcsTaskRoleSsmParam: string;
  albArnSsmParam: string;
  albSecurityGroupSsmParam: string;
  albListenerSsmParam: string;
  dbSecurityGroupSsmParam: string;
  dbCredentialSecret: string;
  appSecrets: string;
  dbPublicAccess: boolean;
  apiService: FargateServiceConfig;
  dns: DNSConfig[];
}

export interface FargateServiceConfig {
  dockerPort: number;
  rootdomain: string;
  subdomain: string;
  rootDomainCertSsm: string;
  albPort: number;
  serviceName: string;
  dockerImageUrl: string;
  cpu: number;
  memory: number;
  taskCount: number;
  healthCheckPath: string;
  environment: Record<string, string>;
  secrets: Record<string, string>;
  priority: number;
  dockerLabels?: { [key: string]: string };
  command?: string[];
  projectTag: string;
}

export interface DNSConfig {
  existingRootHostedZone: string;
  rootDomainCertSsmParam: string;
}
