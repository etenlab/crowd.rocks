import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export const importSg = (
  scope: Construct,
  sgSsmParam: string,
  sgCfnId?: string,
): ec2.ISecurityGroup => {
  const cfnId = sgCfnId || sgSsmParam;
  const sgId = ssm.StringParameter.valueFromLookup(scope, sgSsmParam);

  return ec2.SecurityGroup.fromLookupById(scope, cfnId, sgId);
};
