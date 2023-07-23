import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';

import { EcsFargateService, FargateTaskDefinition } from '../components';
import {
  importEcsSecrets,
  FargateServiceSecret,
  importVpc,
  importAlb,
  importSg,
  importHostedZone,
  importIamRole,
  importAlbListener,
} from '../helpers';

export interface ApiServiceStackProps extends cdk.StackProps {
  /** Name of the application assigned to logical id of CloudFormation components */
  readonly appPrefix: string;

  /** Name of the deployed environmend */
  readonly envName: string;

  /** Name used to identify the deployed service */
  readonly serviceName: string;

  /** SSM param name storing VPC id */
  readonly vpcSsmParam: string;

  /** Registered root domain name */
  readonly rootDomainName: string;

  /** Subdomain of the root domain used to access the app */
  readonly subdomain: string;

  /** SSM param name storing shared ALB ARN */
  readonly albArnSsmParam: string;

  /** SSM param name storing shared ALB security group ARN */
  readonly albSecurityGroupSsmParam: string;

  /** SSM param name storing HTTPS ALB listener ARN */
  readonly albListenerSsmParam: string;

  /** SSM param name storing shared database security group ARN */
  readonly dbSecurityGroupSsmParam: string;

  /** SSM param name storing default ECS execution role ARN */
  readonly ecsExecRoleSsmParam: string;

  /** SSM param name storing default ECS task role ARN */
  readonly ecsTaskRoleSsmParam: string;

  /** Name of the ECS cluster to deploy the service */
  readonly ecsClusterName: string;

  /** Port exposed by the service Docker container */
  readonly dockerPort: number;

  /** ALB port used to access the service */
  readonly albPort: number;

  /** Service healthcheck URL. Defaults to "/" */
  readonly healthCheckPath?: string;

  /** Docker image used to deploy the service */
  readonly dockerImageUrl: string;

  /** Service CPU setting in MiB */
  readonly cpu: number;

  /** Service memory setting in MiB */
  readonly memory: number;

  /** The desired number of tasks running in the service */
  readonly serviceTasksCount: number;

  /** List of Secrets Manager secrets to supply to the service */
  readonly secrets: FargateServiceSecret[];

  /** List of environment variables to supply to the service */
  readonly environmentVars: Record<string, string>[];

  /** Priority of this ALB target group */
  readonly routingPriority: number;

  /** Optional list of container docker labels */
  readonly dockerLabels?: { [key: string]: string };

  /** Optional command that is passed to the container. */
  readonly command?: string[];
}

/**
 * Creates infrastructure for the backend service including:
 *
 * 1. ECS task definition and service
 * 2. ALB target group and listener
 * 3. Route53 record
 */
export class ApiServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiServiceStackProps) {
    super(scope, id, props);

    const vpc = importVpc(this, props.vpcSsmParam);
    const secrets = importEcsSecrets(this, props.secrets);
    const alb = importAlb(this, props.albArnSsmParam, `${props.appPrefix}Alb`);
    const albSg = importSg(
      this,
      props.albSecurityGroupSsmParam,
      `${props.appPrefix}AlbSg`,
    );
    const albListener = importAlbListener(this, props.albListenerSsmParam)

    const dbSg = importSg(
      this,
      props.dbSecurityGroupSsmParam,
      `${props.appPrefix}DbSg`,
    );
    const rootHostedZone = importHostedZone(
      this,
      props.rootDomainName,
      `${props.appPrefix}RootHz`,
    );
    const execRole = importIamRole(
      this,
      props.ecsExecRoleSsmParam,
      `${props.appPrefix}ExecRole`,
    );
    const taskRole = importIamRole(
      this,
      props.ecsTaskRoleSsmParam,
      `${props.appPrefix}TaskRole`,
    );

    const cluster = ecs.Cluster.fromClusterAttributes(
      this,
      `${props.appPrefix}EcsCluster`,
      { clusterName: props.ecsClusterName, vpc, securityGroups: [] },
    );

    /** Configure service environment variables */
    const environment: Record<string, string> = {
      ENV: props.envName,
      SERVICE: props.serviceName,
    };

    props.environmentVars.forEach((envVar) => {
      Object.entries(envVar).forEach(([key, value]) => {
        const varName = key as string;
        environment[varName] = value.toString();
      });
    });

    /** Create Fargate task definition */
    const taskDefinition = new FargateTaskDefinition(
      this,
      `${props.serviceName}FargateTaskDef`,
      {
        serviceName: props.serviceName,
        dockerImageUrl: props.dockerImageUrl,
        ecsDefExecRole: execRole,
        ecsDefTaskRole: taskRole,
        cpu: props.cpu,
        memory: props.memory,
        containerDefinition: {
          name: props.serviceName,
          essential: true,
          dockerLabels: props.dockerLabels,
          command: props.command,
          portMappings: [
            {
              hostPort: props.dockerPort,
              containerPort: props.dockerPort,
              protocol: ecs.Protocol.TCP,
            },
          ],
          secrets,
          environment,
        },
      },
    );

    /** Create ALB target group */
    const targetGroup = new elbv2.ApplicationTargetGroup(
      this,
      `${props.serviceName}AlbTargetGroup`,
      {
        targetGroupName: `${props.serviceName}-target-group`,
        targetType: elbv2.TargetType.IP,
        protocol: elbv2.ApplicationProtocol.HTTP,
        port: props.albPort,
        vpc,
        deregistrationDelay: cdk.Duration.seconds(30),
        healthCheck: {
          path: props.healthCheckPath || '/',
          port: 'traffic-port',
        },
      },
    );

    /** Create load balanced ECS Fargate service */
    const fargateService = new EcsFargateService(
      this,
      `${props.serviceName}FargateService`,
      {
        serviceName: props.serviceName,
        taskDefinition: taskDefinition.getFargateTaskDefinition(),
        cluster,
        targetGroup,
        albSecurityGroup: albSg,
        dbSecurityGroup: dbSg,
        vpc,
        taskCount: props.serviceTasksCount,
        hostPort: ec2.Port.tcp(props.albPort),
        dbPort: ec2.Port.tcp(5432),
      },
    );

    albListener.addAction(`${props.serviceName}AlbAction`, {
      priority: props.routingPriority,
      conditions: [elbv2.ListenerCondition.hostHeaders([`${props.subdomain}.${props.rootDomainName}`])],
      action: elbv2.ListenerAction.forward([targetGroup]),
    })

    /** Create Route53 record for service subdomain */
    const route53Record = new route53.ARecord(
      this,
      `${props.serviceName}ARecord`,
      {
        zone: rootHostedZone,
        recordName: props.subdomain,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.LoadBalancerTarget(alb),
        ),
      },
    );

    new cdk.CfnOutput(this, `${props.appPrefix}ApiUrl`, {
      exportName: `${props.serviceName}-api-url`,
      value: `https://${props.subdomain}.${props.rootDomainName}`,
    });
  }
}
