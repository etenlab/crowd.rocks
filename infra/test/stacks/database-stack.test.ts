import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { StorageStack } from '../../lib/stacks/storage-stack';
import * as VpcMock from '../mocks/vpc-mock';
import * as SsmMock from '../mocks/ssm-mock';

const stackParams = {
  envName: 'qa',
  appPrefix: 'test',
  vpcSsmParam: 'test-vpc-ssm',
  isPubliclyAccessible: true,
  dbCredentialSecret: 'db-credential-secret',
  dbSecurityGroupSsmParam: 'db-sg-ssm',
  publicFilesBucketName: 'test-files-bucket',
};

ec2.Vpc.fromLookup = VpcMock.fromLookup;
ssm.StringParameter.valueFromLookup = SsmMock.valueFromLookup;

describe('DatabaseStack', () => {
  test('Creates database cluster with public access', () => {
    const app = new cdk.App();

    const databaseStack = new StorageStack(app, 'DatabaseStack', stackParams);

    const template = Template.fromStack(databaseStack);

    template.hasResourceProperties(
      'AWS::RDS::DBCluster',
      Match.objectLike({
        CopyTagsToSnapshot: true,
        DatabaseName: 'eildb1',
        DBClusterIdentifier: 'qa-aurora-cluster',
        DBClusterParameterGroupName: 'default.aurora-postgresql14',
        DeletionProtection: true,
        Engine: 'aurora-postgresql',
        EngineVersion: '14.5',
        MasterUsername: 'postgres',
        MasterUserPassword: {
          'Fn::Join': [
            '',
            [
              '{{resolve:secretsmanager:',
              {
                Ref: Match.anyValue(),
              },
              ':SecretString:password::}}',
            ],
          ],
        },
        Port: 5432,
        ServerlessV2ScalingConfiguration: {
          MaxCapacity: 4,
          MinCapacity: 0.5,
        },
        StorageEncrypted: true
      }),
    );

    template.hasResourceProperties(
      'AWS::RDS::DBInstance',
      Match.objectLike({
        DBClusterIdentifier: {
          Ref: Match.anyValue()
        },
        DBInstanceClass: 'db.serverless',
        PromotionTier: 0,
        Engine: 'aurora-postgresql',
        PubliclyAccessible: true
      }),
    );

    template.hasResourceProperties(
      'AWS::EC2::SecurityGroup',
      Match.objectLike({
        GroupName: 'qa-aurora-cluster-sg',
        SecurityGroupEgress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow all outbound traffic by default',
            IpProtocol: '-1',
          },
        ],
        SecurityGroupIngress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow database connection from anywhere',
            FromPort: 5432,
            IpProtocol: 'tcp',
            ToPort: 5432,
          },
        ],
      }),
    );

    template.hasResourceProperties(
      'AWS::SecretsManager::SecretTargetAttachment',
      Match.objectLike({ TargetType: 'AWS::RDS::DBCluster' }),
    );

    template.hasResourceProperties(
      'AWS::SSM::Parameter',
      Match.objectLike({
        Type: 'String',
        Name: stackParams.dbSecurityGroupSsmParam,
      }),
    );
  });

  test('Creates private database cluster', () => {
    const params = { ...stackParams, isPubliclyAccessible: false };

    const app = new cdk.App();

    const databaseStack = new StorageStack(app, 'DatabaseStack', params);

    const template = Template.fromStack(databaseStack);

    template.hasResourceProperties(
      'AWS::RDS::DBInstance',
      Match.objectLike({
        DBInstanceClass: 'db.serverless',
        // DBInstanceIdentifier: 'qa-aurora-clusterinstance1',
        Engine: 'aurora-postgresql',
        PubliclyAccessible: false,
      }),
    );
  });
});
