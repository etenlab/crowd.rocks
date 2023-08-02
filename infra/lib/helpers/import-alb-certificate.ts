import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export const importAlbCertificate = (
  certificateArn: string,
): elbv2.ListenerCertificate => {

  return elbv2.ListenerCertificate.fromArn(certificateArn);
};
