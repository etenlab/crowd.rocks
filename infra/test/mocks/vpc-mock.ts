import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface ICreateMockVpcProps {
  cidr?: string;
  maxAzs?: number;
  subnetConfiguration?: [
    {
      cidrMask: number;
      name: string;
      subnetType: ec2.SubnetType;
    },
  ];
  natGateways?: number;
}

export function getVpc(scope: Construct, props?: ICreateMockVpcProps) {
  return new ec2.Vpc(
    scope,
    `mockVpc-${Math.random().toString(36).substring(4)}`,
    {
      ipAddresses: ec2.IpAddresses.cidr(props?.cidr || '10.0.0.0/16'),
      maxAzs: props?.maxAzs || 2,
      subnetConfiguration: props?.subnetConfiguration || [
        {
          cidrMask: 26,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 26,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
      natGateways: props?.natGateways || 1,
    },
  );
}

export function fromLookup(scope: Construct): any {
  return getVpc(scope);
}
