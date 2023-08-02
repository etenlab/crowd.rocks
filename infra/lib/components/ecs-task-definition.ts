import 'source-map-support/register';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

/** Properties required to create task container */
export interface FargateContainerDefinition {
  /** Name used to identify task container */
  name: string;

  /** If essential container fails or stops, all other containers that are part of the task are stopped */
  essential: boolean;

  /** Map of container and host ports to allow the traffic between */
  portMappings: ecs.PortMapping[];

  /** List of task environment variables */
  environment: { [key: string]: string };

  /** List of task secrets */
  secrets: { [key: string]: ecs.Secret };

  /** List of container docker labels */
  dockerLabels?: { [key: string]: string };

  /** The command that is passed to the container. */
  command?: string[]
}

/**
 * Properties required to create Fargate task definition
 */
export interface FargateTaskDefinitionProps {
  /** Name used to identify the deployed service */
  serviceName: string;

  /** Execution role ECS will use to manage the task */
  ecsDefExecRole: iam.IRole;

  /** Task role running app will use to access other AWS resources */
  ecsDefTaskRole: iam.IRole;

  /** Docker image from public registry */
  dockerImageUrl: string;

  /** The name of a family that this task definition is registered to */
  family?: string;

  /** Properties required to create task container */
  containerDefinition: FargateContainerDefinition;

  /** Task CPU setting in MiB */
  cpu?: number;

  /** Task memory setting in MiB */
  memory?: number;
}

/**
 * Creates Fargate task definition
 */
export class FargateTaskDefinition extends Construct {
  private taskDefinition: ecs.FargateTaskDefinition;

  private readonly defaultCpu: number = 256;

  private readonly defaultMemory: number = 512;

  constructor(scope: Construct, id: string, props: FargateTaskDefinitionProps) {
    super(scope, id);

    const cpu = props.cpu || this.defaultCpu;
    const memory = props.memory || this.defaultMemory;
    const taskFamily = props.family || props.serviceName;

    const taskDefinitionProps: ecs.FargateTaskDefinitionProps = {
      executionRole: props.ecsDefExecRole,
      taskRole: props.ecsDefTaskRole,
      cpu,
      family: taskFamily,
      memoryLimitMiB: memory,
    };

    this.taskDefinition = new ecs.FargateTaskDefinition(
      this,
      `${props.serviceName}TaskDefinition`,
      taskDefinitionProps,
    );

    const logGroup = new logs.LogGroup(
      this,
      `${props.containerDefinition.name}ContainerLogGroup`,
      {
        logGroupName: `/ecs/${props.containerDefinition.name}`,
        retention: logs.RetentionDays.ONE_MONTH,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    );

    const containerDefinitionProps: ecs.ContainerDefinitionProps = {
      taskDefinition: this.taskDefinition,
      image: ecs.ContainerImage.fromRegistry(props.dockerImageUrl),
      essential: props.containerDefinition.essential,
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'ecs',
        logGroup,
      }),
      environment: props.containerDefinition.environment,
      secrets: props.containerDefinition.secrets,
      dockerLabels: props.containerDefinition.dockerLabels,
      command: props.containerDefinition.command
    };

    const taskContainer = this.taskDefinition.addContainer(
      props.containerDefinition.name,
      containerDefinitionProps,
    );

    props.containerDefinition.portMappings?.forEach((mapping) => {
      taskContainer.addPortMappings(mapping);
    });
  }

  public getFargateTaskDefinition(): ecs.FargateTaskDefinition {
    return this.taskDefinition;
  }
}
