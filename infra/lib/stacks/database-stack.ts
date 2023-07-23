import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { importVpc } from '../helpers';

/**
 * Properties required to create Aurora database
 */
export interface DatabaseStackProps extends cdk.StackProps {
  /** Name of the application assigned to logical id of CloudFormation components */
  readonly appPrefix: string;

  /** Name of the deployed environmend */
  readonly envName: string;

  /** SSM param name storing VPC id */
  readonly vpcSsmParam: string;

  /** Whether database is accessible outside of VPC */
  readonly isPubliclyAccessible: boolean;

  /** Name of the secret in Secrets Manager to store database credentials */
  readonly dbCredentialSecret: string;

  /** SSM param name to store database security group id */
  readonly dbSecurityGroupSsmParam: string;
}

/**
 * Creates PostgreSQL Aurora cluster with a single database
 */
export class DatabaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const vpc = importVpc(this, props.vpcSsmParam);

    const databaseSg = new ec2.SecurityGroup(
      this,
      `${props.appPrefix}AuroraClusterSG`,
      {
        vpc,
        description: 'Aurora cluster security group',
        securityGroupName: `${props.envName}-aurora-cluster-sg`,
        allowAllOutbound: true,
      },
    );

    if (props.isPubliclyAccessible) {
      databaseSg.addIngressRule(
        ec2.Peer.anyIpv4(),
        ec2.Port.tcp(5432),
        'Allow database connection from anywhere',
      );
    } else {
      databaseSg.addIngressRule(
        ec2.Peer.ipv4(vpc.vpcCidrBlock),
        ec2.Port.tcp(5432),
        'Allow database connection only from VPC',
      );
    }

    const auroraCluster = new rds.DatabaseCluster(
      this,
      `${props.appPrefix}AuroraCluster`,
      {
        clusterIdentifier: `${props.envName}-aurora-cluster`,
        defaultDatabaseName: 'eildb1',
        deletionProtection: true,
        parameterGroup: rds.ParameterGroup.fromParameterGroupName(
          this,
          'DbParamGroup',
          'default.aurora-postgresql14',
        ),
        engine: rds.DatabaseClusterEngine.auroraPostgres({
          version: rds.AuroraPostgresEngineVersion.VER_14_5, // TODO: do we need a newer version (latest is 15.3)
        }),
        storageEncrypted: true,
        vpc,
        vpcSubnets: {
          // subnets: vpc.selectSubnets({
            subnetType: props.isPubliclyAccessible
              ? ec2.SubnetType.PUBLIC
              : ec2.SubnetType.PRIVATE_ISOLATED,
          // }).subnets,
        },
        securityGroups: [databaseSg],
        credentials: rds.Credentials.fromGeneratedSecret('postgres', {
          secretName: props.dbCredentialSecret,
        }),
        serverlessV2MinCapacity: 0.5,
        serverlessV2MaxCapacity: 4,
        writer: rds.ClusterInstance.serverlessV2('writer', {
          publiclyAccessible: props.isPubliclyAccessible,
        }),
      },
    );

    new ssm.StringParameter(this, `${props.appPrefix}DbSecurityGroup`, {
      stringValue: databaseSg.securityGroupId,
      description: 'Database security group',
      parameterName: props.dbSecurityGroupSsmParam,
    });
  }
}
