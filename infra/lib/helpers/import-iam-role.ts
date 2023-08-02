import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as iam from 'aws-cdk-lib/aws-iam';

export const importIamRole = (
  scope: Construct,
  roleArnSsmParam: string,
  roleCfnId: string,
): iam.IRole => {
  const executionRoleArn = ssm.StringParameter.fromStringParameterName(
    scope,
    `${roleCfnId}SSM`,
    roleArnSsmParam,
  ).stringValue;

  return iam.Role.fromRoleArn(scope, roleCfnId, executionRoleArn);
};
