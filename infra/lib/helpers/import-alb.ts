import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export const importAlb = (
  scope: Construct,
  albArnSsmParam: string,
  albCfnId?: string,
): elbv2.IApplicationLoadBalancer => {
  const cfnId = albCfnId || albArnSsmParam;
  const albArn = ssm.StringParameter.valueFromLookup(scope, albArnSsmParam);

  return elbv2.ApplicationLoadBalancer.fromLookup(scope, cfnId, {
    loadBalancerArn: albArn,
  });
};
