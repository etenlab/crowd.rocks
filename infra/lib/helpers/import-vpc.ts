import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export const importVpc = (
  scope: Construct,
  vpcSsmParam: string,
  vpcCfnId?: string,
): ec2.IVpc => {
  const cfnId = vpcCfnId || vpcSsmParam;
  const vpcId = ssm.StringParameter.valueFromLookup(scope, vpcSsmParam);

  return ec2.Vpc.fromLookup(scope, cfnId, {
    vpcId,
  });
};
