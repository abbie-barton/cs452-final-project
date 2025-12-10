import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CorsHttpMethod, HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";

import { AnimalsApi } from "../constructs/AnimalsApi";
import { ImagesApi } from "../constructs/ImagesApi";
import { MedicalRecordsApi } from "../constructs/MedicalRecordApi";

interface ApiStackProps extends StackProps {
  vpc: IVpc;
  dbSecret: ISecret;
  dbEndpoint: string;
}

export class ApiStack extends Stack {
  public readonly httpApi: HttpApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // --------------------------------------------------
    // HTTP API
    // --------------------------------------------------
    this.httpApi = new HttpApi(this, "animal-shelter", {
      corsPreflight: {
        allowOrigins: ["http://localhost:3000"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    // --------------------------------------------------
    // S3 bucket
    // --------------------------------------------------
    const imageBucket = new Bucket(this, "AnimalImageBucket", {
      cors: [
        {
          allowedOrigins: ["http://localhost:3000"],
          allowedMethods: [
            HttpMethods.GET,
            HttpMethods.PUT,
            HttpMethods.POST,
            HttpMethods.DELETE,
            HttpMethods.HEAD,
          ],
          allowedHeaders: ["*"],
        },
      ],
    });

    // --------------------------------------------------
    // API Constructs
    // --------------------------------------------------
    new AnimalsApi(this, "AnimalsApi", {
      api: this.httpApi,
      vpc: props.vpc,
      dbSecret: props.dbSecret,
      dbEndpoint: props.dbEndpoint,
    });

    new ImagesApi(this, "ImagesApi", {
      api: this.httpApi,
      vpc: props.vpc,
      dbSecret: props.dbSecret,
      dbEndpoint: props.dbEndpoint,
      bucket: imageBucket,
    });

    new MedicalRecordsApi(this, "MedicalRecordsApi", {
      api: this.httpApi,
      vpc: props.vpc,
      dbSecret: props.dbSecret,
      dbEndpoint: props.dbEndpoint,
    });
  }
}
