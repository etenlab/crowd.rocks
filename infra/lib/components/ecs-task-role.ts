import 'source-map-support/register';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface EcsTaskRoleProps {
  /** Name of the deployed environment */
  envName: string;
}

/** Creates a default task role used by all ESC services to run application */
export class EcsTaskRole extends Construct {
  private ecsTaskRole: iam.Role;

  constructor(scope: Construct, id: string, props: EcsTaskRoleProps) {
    super(scope, id);

    const defaultEcsTaskPolicy = new iam.Policy(this, 'EcsTaskPolicy', {
      policyName: `${props.envName}-default-ecs-task-policy`,
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ssm:GetParameter'],
          resources: [`arn:aws:ssm:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:*`],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'secretsmanager:GetSecretValue',
            'secretsmanager:DescribeSecret',
            'secretsmanager:ListSecretVersionIds',
          ],
          resources: [
            `arn:aws:secretsmanager:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:*`,
          ],
        }),
      ],
    });

    this.ecsTaskRole = new iam.Role(this, 'EcsTaskRole', {
      roleName: `${props.envName}-default-ecs-task-role`,
      description:
        'Role application running on ECS use to access AWS resources.',
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    defaultEcsTaskPolicy.attachToRole(this.ecsTaskRole);
  }

  public getRole(): iam.Role {
    return this.ecsTaskRole;
  }

  public getRoleArn(): string {
    return this.ecsTaskRole.roleArn;
  }
}
