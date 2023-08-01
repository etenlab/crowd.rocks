import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface ICreateMockAlbProps {
  domain?: string;
}

export function getAlb(scope: Construct, props?: ICreateMockAlbProps) {
  const mockVpc = new ec2.Vpc(scope, `MockVpc`);

  return new elbv2.ApplicationLoadBalancer(scope, 'MockAlb', {
    vpc: mockVpc,
    internetFacing: true,
  });
}

export function fromLookup(scope: Construct): any {
  return getAlb(scope);
}
