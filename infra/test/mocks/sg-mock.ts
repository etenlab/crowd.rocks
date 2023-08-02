import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface ICreateMockSgProps {
  securityGroupName?: string;
}

export function getSg(scope: Construct, props?: ICreateMockSgProps) {
  const mockVpc = new ec2.Vpc(
    scope,
    `MockSgVpc-${Math.random().toString(36).substring(4)}`,
  );

  return new ec2.SecurityGroup(
    scope,
    `MockSg-${Math.random().toString(36).substring(4)}`,
    {
      securityGroupName: props?.securityGroupName || 'MockSg',
      vpc: mockVpc,
    },
  );
}

export function fromLookupById(scope: Construct): any {
  return getSg(scope);
}
