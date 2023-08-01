import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';

export interface ICreateMockHzProps {
  domain?: string;
}

export function getHostedZone(scope: Construct, props?: ICreateMockHzProps) {
  return new route53.PublicHostedZone(scope, 'MockHz', {
    zoneName: props?.domain || 'example.com',
    comment: 'Mock hosted zone',
  });
}

export function fromLookup(scope: Construct): any {
  return getHostedZone(scope);
}
