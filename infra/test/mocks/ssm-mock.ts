import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export interface ICreateMockSSMProps {
  paramValue?: string;
  paramName?: string;
}

export function getSsmParam(scope: Construct, props?: ICreateMockSSMProps) {
  return new ssm.StringParameter(
    scope,
    `mockSsm-${Math.random().toString(36).substring(4)}`,
    {
      stringValue: props?.paramValue || 'test-value',
      description: 'Test SSM param',
      parameterName: props?.paramName || 'test-name',
    },
  );
}

export function valueFromLookup(scope: Construct): any {
  return getSsmParam(scope);
}
