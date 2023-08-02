import 'source-map-support/register';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
import { importAlbCertificate } from '../helpers';

/**
 * Properties required to create an Application Load Balancer
 */
export interface AppLoadBalancerProps {
  /** Name of the ALB */
  loadBalancerName: string;

  /** VPC to create ALB into */
  vpc: ec2.IVpc;

  /** List of certificates to associate with this ALB */
  certificateArns: string[];
}

/**
 * Creates internet-facing application load balancer
 */
export class ApplicationLoadBalancer extends Construct {
  private alb: elbv2.ApplicationLoadBalancer;

  private albSecurityGroup: ec2.SecurityGroup;

  private albListener: elbv2.IListener;

  constructor(scope: Construct, id: string, props: AppLoadBalancerProps) {
    super(scope, id);

    const certificates = props.certificateArns.map(importAlbCertificate)

    this.albSecurityGroup = new ec2.SecurityGroup(
      this,
      `${props.loadBalancerName}Sg`,
      {
        vpc: props.vpc,
        description: `${props.loadBalancerName} ALB security group`,
        securityGroupName: `${props.loadBalancerName}-alb-sg`,
      },
    );

    this.alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc: props.vpc,
      internetFacing: true,
      loadBalancerName: props.loadBalancerName,
      securityGroup: this.albSecurityGroup,
      ipAddressType: elbv2.IpAddressType.IPV4,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      idleTimeout: cdk.Duration.seconds(300),
    });

    this.albListener = this.alb.addListener('HTTPSAlbListener', {
      protocol: elbv2.ApplicationProtocol.HTTPS,
      port: 443,
      open: true,
      defaultAction: elbv2.ListenerAction.fixedResponse(404),
      certificates: certificates,
    });
  }

  public getAlb(): elbv2.ApplicationLoadBalancer {
    return this.alb;
  }

  public getAlbListenerArn(): string {
    return this.albListener.listenerArn;
  }

  public getAlbArn(): string {
    return this.alb.loadBalancerArn;
  }

  public getAlbSecurityGroupId(): string {
    return this.albSecurityGroup.securityGroupId;
  }
}
