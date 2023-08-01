import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export const importAlbListener = (
  scope: Construct,
  albListenerArnSsmParam: string,
): elbv2.IApplicationListener => {
  const albListenerArn = ssm.StringParameter.valueFromLookup(
    scope,
    albListenerArnSsmParam,
  );

  return elbv2.ApplicationListener.fromLookup(scope, 'AlbListener', {
    listenerArn: albListenerArn
  });
};
