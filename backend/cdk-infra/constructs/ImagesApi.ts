import { Construct } from "constructs";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { IVpc, ISecurityGroup, SubnetType } from "aws-cdk-lib/aws-ec2";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Bucket } from "aws-cdk-lib/aws-s3";

export interface ImagesApiProps {
  api: HttpApi;
  vpc: IVpc;
  dbSecret: ISecret;
  dbEndpoint: string;
  bucket: Bucket;
  securityGroup?: ISecurityGroup;
}

export class ImagesApi extends Construct {
  constructor(scope: Construct, id: string, props: ImagesApiProps) {
    super(scope, id);

    const commonLambdaConfig = {
      runtime: Runtime.NODEJS_18_X,
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: props.securityGroup ? [props.securityGroup] : undefined,
      environment: {
        BUCKET_NAME: props.bucket.bucketName,
        DB_HOST: props.dbEndpoint,
        DB_NAME: "animal_shelter",
        DB_PORT: "3306",
        DB_SECRET_NAME: props.dbSecret.secretName,
      },
    };

    const uploadLambda = new NodejsFunction(this, "UploadAnimalImagesLambda", {
      ...commonLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/images/uploadAnimalImages.ts"),
      handler: "main",
    });

    const deleteLambda = new NodejsFunction(this, "DeleteAnimalImagesLambda", {
      ...commonLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/images/deleteAnimalImages.ts"),
      handler: "main",
    });

    // Permissions
    props.bucket.grantPut(uploadLambda);
    props.bucket.grantRead(uploadLambda);
    props.dbSecret.grantRead(uploadLambda);

    props.bucket.grantDelete(deleteLambda);
    props.dbSecret.grantRead(deleteLambda);

    // Integrations
    const uploadIntegration = new HttpLambdaIntegration("UploadAnimalImagesIntegration", uploadLambda);
    const deleteIntegration = new HttpLambdaIntegration("DeleteAnimalImagesIntegration", deleteLambda);

    // Routes
    props.api.addRoutes({
      path: "/animals/{id}/images",
      methods: [HttpMethod.POST],
      integration: uploadIntegration,
    });

    props.api.addRoutes({
      path: "/animals/{id}/images",
      methods: [HttpMethod.DELETE],
      integration: deleteIntegration,
    });
  }
}
