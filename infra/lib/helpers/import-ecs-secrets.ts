import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export interface FargateServiceSecret {
  taskDefSecretName: string;
  secretsManagerSecretName: string;
  secretsMangerSecretField?: string;
  createNewSecret?: boolean;
}

export const importEcsSecrets = (
  scope: Construct,
  secretsToImport: FargateServiceSecret[],
) => {
  const secrets: { [key: string]: ecs.Secret } = {};

  secretsToImport.forEach((secret) => {
    const secretsManagerSecret = secret.createNewSecret
      ? new secretsmanager.Secret(scope, `${secret.taskDefSecretName}Secret`, {
          secretName: secret.secretsManagerSecretName,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          generateSecretString: {
            excludeUppercase: false,
            includeSpace: false,
            excludePunctuation: true,
            excludeLowercase: false,
            excludeNumbers: false
          }

        })
      : secretsmanager.Secret.fromSecretPartialArn(
          scope,
          `${secret.taskDefSecretName}Secret`,
          `arn:aws:secretsmanager:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:secret:${secret.secretsManagerSecretName}`,
        );

    secrets[secret.taskDefSecretName] = ecs.Secret.fromSecretsManager(
      secretsManagerSecret,
      secret.secretsMangerSecretField,
    );
  });

  return secrets;
};
