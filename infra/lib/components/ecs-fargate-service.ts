import 'source-map-support/register';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * Properties required to create Fargate Service for the application
 */
export interface FargateServiceProps {
  /** Name used to identify the service */
  serviceName: string;

  /** ECS task definition to deploy into service */
  taskDefinition: ecs.FargateTaskDefinition;

  /** ECS cluster owning the service */
  cluster: ecs.ICluster;

  /** Load balancer target group to attach */
  targetGroup: elbv2.ApplicationTargetGroup;

  /** Load balancer security group to an allow access from */
  albSecurityGroup: ec2.ISecurityGroup;

  /** Database security group to allow an access to */
  dbSecurityGroup: ec2.ISecurityGroup;

  /** VPC to deploy the service into */
  vpc: ec2.IVpc;

  /** Desired number of tasks to run into service */
  taskCount: number;

  /** Database port to allow an access to from service */
  dbPort: ec2.Port;

  /** Service port to allow an access to from ALB */
  hostPort: ec2.Port;
}

/**
 * Creates a public load-balanced application Fargate service
 * with access to the Aurora database.
 */
export class EcsFargateService extends Construct {
  private service: ecs.FargateService;

  constructor(scope: Construct, id: string, props: FargateServiceProps) {
    super(scope, id);

    const serviceSg = new ec2.SecurityGroup(
      scope,
      `${props.serviceName}ServiceSg`,
      {
        vpc: props.vpc,
        description: `${props.serviceName} fargate service security group`,
        securityGroupName: `${props.serviceName}-service-sg`,
      },
    );

    serviceSg.addIngressRule(
      props.albSecurityGroup,
      props.hostPort,
      `Allows ALB to ECS connection on port ${props.hostPort.toString()}`,
    );

    props.dbSecurityGroup.addIngressRule(
      serviceSg,
      props.dbPort,
      `Allows ECS to DB connection on port ${props.dbPort.toString()}`,
    );

    const service = new ecs.FargateService(
      scope,
      `${props.serviceName}Service`,
      {
        cluster: props.cluster,
        serviceName: `${props.serviceName}Service`,
        assignPublicIp: true,
        taskDefinition: props.taskDefinition,
        desiredCount: props.taskCount,
        minHealthyPercent: 100,
        maxHealthyPercent: 200,
        securityGroups: [serviceSg],
        vpcSubnets: props.vpc.selectSubnets({
          subnetType: ec2.SubnetType.PUBLIC,
        }),
        healthCheckGracePeriod: cdk.Duration.seconds(60),
      },
    );

    service.attachToApplicationTargetGroup(props.targetGroup);
  }

  public getEcsService(): ecs.FargateService {
    return this.service;
  }
}
