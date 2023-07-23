import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { ApiServiceStack } from '../../lib/stacks/api-service-stack';

import * as Route53Mock from '../mocks/route53-mock';
import * as VpcMock from '../mocks/vpc-mock';
import * as SsmMock from '../mocks/ssm-mock';
import * as AlbMock from '../mocks/alb-mock';
import * as AlbListenerMock from '../mocks/alb-listener-mock';
import * as SgMock from '../mocks/sg-mock';

route53.HostedZone.fromLookup = Route53Mock.fromLookup;
ec2.Vpc.fromLookup = VpcMock.fromLookup;
ssm.StringParameter.valueFromLookup = SsmMock.valueFromLookup;
elbv2.ApplicationLoadBalancer.fromLookup = AlbMock.fromLookup;
elbv2.ApplicationListener.fromLookup = AlbListenerMock.fromLookup;
ec2.SecurityGroup.fromLookupById = SgMock.fromLookupById;

const stackParams = {
  envName: 'qa',
  appPrefix: 'test',
  vpcSsmParam: 'test-vpc-ssm',
  domainCertSsmParam: 'domain-cert-ssm',
  rootDomainName: 'example.com',
  subdomain: 'api',
  albArnSsmParam: 'alb-arn-ssm',
  albSecurityGroupSsmParam: 'alb-sg-ssm',
  albListenerSsmParam: 'alb-listener-ssm',
  dbSecurityGroupSsmParam: 'db-sg-ssm',
  ecsExecRoleSsmParam: 'ecs-exec-role-ssm',
  ecsTaskRoleSsmParam: 'ecs-task-role-ssm',
  ecsClusterName: 'qa-cluster',
  dockerPort: 4002,
  albPort: 3002,
  healthCheckPath: '/status',
  serviceName: 'test-api',
  dockerImageUrl: 'test-image:1.0',
  command: ['test command'],
  cpu: 256,
  memory: 512,
  serviceTasksCount: 3,
  routingPriority: 2,
  secrets: [
    {
      taskDefSecretName: 'DB_PASSWORD',
      secretsManagerSecretName: '/qa/db/credentials',
      secretsMangerSecretField: 'password',
    },
  ],
  environmentVars: [{ PORT: '3002' }],
};

describe('ApiServiceStack', () => {
  const app = new cdk.App();

  const apiServiceStack = new ApiServiceStack(
    app,
    'ApiServiceStack',
    stackParams,
  );
  const template = Template.fromStack(apiServiceStack);

  test('Creates correct ECS task definition', () => {
    template.hasResourceProperties(
      'AWS::ECS::TaskDefinition',
      Match.objectLike({
        ContainerDefinitions: [
          {
            Environment: [
              {
                Name: 'ENV',
                Value: 'qa',
              },
              {
                Name: 'SERVICE',
                Value: 'test-api',
              },
              {
                Name: 'PORT',
                Value: '3002',
              },
            ],
            Essential: true,
            Image: 'test-image:1.0',
            Name: 'test-api',
            Command: ['test command'],
            PortMappings: [
              {
                ContainerPort: 4002,
                HostPort: 4002,
                Protocol: 'tcp',
              },
            ],
            Secrets: [
              {
                Name: 'DB_PASSWORD',
                ValueFrom: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:aws:secretsmanager:',
                      {
                        Ref: 'AWS::Region',
                      },
                      ':',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':secret:/qa/db/credentials:password::',
                    ],
                  ],
                },
              },
            ],
          },
        ],
        Cpu: '256',
        Family: 'test-api',
        Memory: '512',
        NetworkMode: 'awsvpc',
        RequiresCompatibilities: ['FARGATE'],
      }),
    );
  });
  test('Creates correct ECS service', () => {
    template.hasResourceProperties(
      'AWS::ECS::Service',
      Match.objectLike({
        Cluster: 'qa-cluster',
        DeploymentConfiguration: {
          MaximumPercent: 200,
          MinimumHealthyPercent: 100,
        },
        DesiredCount: 3,
        EnableECSManagedTags: false,
        HealthCheckGracePeriodSeconds: 60,
        LaunchType: 'FARGATE',
        LoadBalancers: [
          {
            ContainerName: 'test-api',
            ContainerPort: 4002,
            TargetGroupArn: {
              Ref: Match.anyValue(),
            },
          },
        ],
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'ENABLED',
          },
        },
        ServiceName: 'test-apiService',
      }),
    );
  });

  test('Creates ALB target group and listener', () => {
    template.hasResourceProperties(
      'AWS::ElasticLoadBalancingV2::TargetGroup',
      Match.objectLike({
        HealthCheckPath: '/status',
        HealthCheckPort: 'traffic-port',
        Name: 'test-api-target-group',
        Port: 3002,
        Protocol: 'HTTP',
        TargetGroupAttributes: [
          {
            Key: 'deregistration_delay.timeout_seconds',
            Value: '30',
          },
          {
            Key: 'stickiness.enabled',
            Value: 'false',
          },
        ],
        TargetType: 'ip',
      }),
    );

    template.hasResourceProperties(
      'AWS::ElasticLoadBalancingV2::ListenerRule',
      Match.objectLike({
        Actions: [
          {
           TargetGroupArn: {
            Ref: Match.anyValue(),
           },
           Type: "forward"
          }
         ],
         Conditions: [
          {
           Field: "host-header",
           HostHeaderConfig: {
            Values: [
             "api.example.com"
            ]
           }
          }
         ],
         ListenerArn: Match.anyValue(),
         "Priority": 2
      }),
    );
  });

  test('Creates Route53 record for the service', () => {
    template.hasResourceProperties(
      'AWS::Route53::RecordSet',
      Match.objectLike({
        Name: 'api.example.com.',
        Type: 'A',
        AliasTarget: {
          DNSName: Match.anyValue(),
          HostedZoneId: Match.anyValue(),
        },
      }),
    );
  });
});
