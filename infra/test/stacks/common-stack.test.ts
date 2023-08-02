import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Template } from 'aws-cdk-lib/assertions';
import { CommonStack } from '../../lib/stacks/common-stack';

import * as Route53Mock from '../mocks/route53-mock';

route53.HostedZone.fromLookup = Route53Mock.fromLookup;

const stackParams = {
  cidr: '10.0.0.0/16',
  envName: 'test',
  envSubdomain: 'test',
  vpcSsmParam: 'test-vpc-ssm',
  ecsExecRoleSsmParam: 'test-exec-role-ssm',
  ecsTaskRoleSsmParam: 'test-task-role-ssm',
  ecsClusterName: 'test-ecs-cluster',
  albArnSsmParam: 'test-alb-arn-ssm',
  albSecurityGroupSsmParam: 'test-alb-sg-ssm',
  albListenerSsmParam: 'alb-listener-ssm',
  domainCertSsmParam: 'domain-cert-ssm',
  natGatewaysCount: 0,
  appPrefix: 'qa',
  rootDomainCertArn: 'arn:aws:acm:us-east-2:111111111:certificate/000000000',
  dns: [
    {
      existingRootHostedZone: 'example.com',
      rootDomainCertSsmParam: '/test/example.com/root-domain-certificate',
    },
  ],
};

describe('CommonStack', () => {
  test('Creates all required components of common infrastructure', () => {
    const app = new cdk.App();

    const commonStack = new CommonStack(app, 'CommonStack', stackParams);

    const template = Template.fromStack(commonStack);

    template.resourceCountIs('AWS::EC2::VPC', 1);
    template.resourcePropertiesCountIs(
      'AWS::EC2::Subnet',
      { MapPublicIpOnLaunch: true },
      2,
    );
    template.resourcePropertiesCountIs(
      'AWS::EC2::Subnet',
      { MapPublicIpOnLaunch: false },
      4,
    );
    template.resourceCountIs('AWS::EC2::RouteTable', 6);
    template.resourceCountIs('AWS::EC2::SubnetRouteTableAssociation', 6);
    template.resourceCountIs('AWS::EC2::Route', 2);
    template.resourceCountIs('AWS::EC2::InternetGateway', 1);
    template.resourceCountIs('AWS::EC2::VPCGatewayAttachment', 1);
    template.resourceCountIs('AWS::SSM::Parameter', 7);
    template.resourceCountIs('AWS::EC2::SecurityGroup', 1);
    template.resourceCountIs('AWS::ElasticLoadBalancingV2::LoadBalancer', 1);
    template.resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 1);
    template.resourceCountIs('AWS::ECS::Cluster', 1);
    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 2);
  });
});
