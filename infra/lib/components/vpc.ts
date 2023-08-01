import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

/**
 * Properties required to create a VPC
 */
export interface VpcProps {
  /** CIDR block */
  readonly cidr: string;

  /** VPC name */
  readonly vpcName: string;

  /** Number of Nat Gateways to create. Set to zero if not required. */
  readonly natGatewaysCount: number;
}

/**
 * Creates a VPC to deploy project services
 */
export class ProjectVpc extends Construct {
  private vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VpcProps) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, props.vpcName, {
      ipAddresses: ec2.IpAddresses.cidr(props.cidr),
      maxAzs: 3,
      natGateways: props.natGatewaysCount,
      vpcName: props.vpcName,
      subnetConfiguration: [
        {
          cidrMask: 20,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 20,
          name: 'private-with-nat',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 20,
          name: 'private-isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
  }

  public getVpcId() {
    return this.vpc.vpcId;
  }

  public getVpc() {
    return this.vpc;
  }
}
