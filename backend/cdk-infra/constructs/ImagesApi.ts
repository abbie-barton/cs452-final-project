import { Construct } from "constructs";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Bucket } from "aws-cdk-lib/aws-s3";

interface ImagesApiProps {
  api: HttpApi;
  vpc: IVpc;
  dbSecret: ISecret;
  dbEndpoint: string;
  bucket: Bucket;
}

export class ImagesApi extends Construct {
  constructor(scope: Construct, id: string, props: ImagesApiProps) {
    super(scope, id);

    const { api, vpc, dbSecret, dbEndpoint, bucket } = props;

    const uploadImagesLambda = new NodejsFunction(
      this,
      "UploadAnimalImagesLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(
          __dirname,
          "../../src/lambdas/images/uploadAnimalImages.ts"
        ),
        handler: "main",
        vpc: props.vpc,
        environment: {
          BUCKET_NAME: bucket.bucketName,
          DB_HOST: dbEndpoint,
          DB_NAME: "animal_shelter",
          DB_PORT: "3306",
          DB_SECRET_NAME: dbSecret.secretName,
        },
      }
    );

    const deleteImagesLambda = new NodejsFunction(
      this,
      "DeleteAnimalImagesLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(
          __dirname,
          "../../src/lambdas/images/deleteAnimalImages.ts"
        ),
        handler: "main",
        vpc: props.vpc,
        environment: {
          ANIMAL_IMAGES_BUCKET: bucket.bucketName,
          DB_HOST: dbEndpoint,
          DB_NAME: "animal_shelter",
          DB_PORT: "3306",
          DB_SECRET_NAME: dbSecret.secretName,
        },
      }
    );

    // Permissions
    bucket.grantPut(uploadImagesLambda);
    bucket.grantRead(uploadImagesLambda);
    dbSecret.grantRead(uploadImagesLambda);
    bucket.grantDelete(deleteImagesLambda);
    dbSecret.grantRead(deleteImagesLambda);

    const uploadIntegration = new HttpLambdaIntegration(
      "UploadAnimalImagesIntegration",
      uploadImagesLambda
    );

    const deleteIntegration = new HttpLambdaIntegration(
      "DeleteAnimalImagesIntegration",
      deleteImagesLambda
    );

    api.addRoutes({
      path: "/animals/{id}/images",
      methods: [HttpMethod.DELETE],
      integration: deleteIntegration,
    });

    api.addRoutes({
      path: "/animals/{id}/images",
      methods: [HttpMethod.POST],
      integration: uploadIntegration,
    });
  }
}
