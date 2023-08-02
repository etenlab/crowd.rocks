import { Construct } from 'constructs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

function getAlbListener(scope: Construct) {
  const mockVpc = new ec2.Vpc(scope, `MockVpcAlbListener`);
  const mockAlb = new elbv2.ApplicationLoadBalancer(scope, 'MockAlbForListenerMock', {
    vpc: mockVpc,
    internetFacing: true,
  })
  const mockCert = new acm.Certificate(scope, 'MockCertificate', { domainName: 'mock.com' })
  return new elbv2.ApplicationListener(scope, 'MockAlbListener', {
    protocol: elbv2.ApplicationProtocol.HTTPS,
    loadBalancer: mockAlb,
    defaultAction: elbv2.ListenerAction.fixedResponse(404),
    certificates: [mockCert]
  });
}

export function fromLookup(scope: Construct): any {
  return getAlbListener(scope);
}
