import 'source-map-support/register';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface EcsExecRoleProps {
  /** Name of the deployed environment */
  envName: string;
}

/** Creates a default execution role used by all ESC services to launch tasks */
export class EcsExecutionRole extends Construct {
  private ecsExecRole: iam.Role;

  constructor(scope: Construct, id: string, props: EcsExecRoleProps) {
    super(scope, id);

    this.ecsExecRole = new iam.Role(this, 'EcsExecutionRole', {
      roleName: `${props.envName}-default-ecs-execution-role`,
      description: 'Role used by ECS to manage tasks',
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    const defaultEcsExecutionPolicy = new iam.Policy(
      this,
      'EcsExecutionPolicy',
      {
        policyName: `${props.envName}-default-ecs-execution-policy`,
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'secretsmanager:DescribeSecret',
              'secretsmanager:GetSecretValue',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            resources: ['*'],
          }),
        ],
      },
    );

    defaultEcsExecutionPolicy.attachToRole(this.ecsExecRole);
  }

  public getRole(): iam.Role {
    return this.ecsExecRole;
  }

  public getRoleArn(): string {
    return this.ecsExecRole.roleArn;
  }
}
