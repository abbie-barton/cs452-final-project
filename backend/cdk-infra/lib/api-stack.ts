import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CorsHttpMethod,
  HttpApi,
} from "aws-cdk-lib/aws-apigatewayv2";
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

    // ==============================================================
    // 1️⃣ HTTP API WITH PROPER CORS (VERCEL + LOCALHOST)
    // ==============================================================

    this.httpApi = new HttpApi(this, "animal-shelter", {
      corsPreflight: {
        allowOrigins: [
          "http://localhost:3000",
          "https://cs452-final-project.vercel.app",
          "*"   // optional — remove if you want to restrict later
        ],
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

    // ==============================================================
    // 2️⃣ S3 BUCKET WITH PROPER CORS
    // ==============================================================

    const imageBucket = new Bucket(this, "AnimalImageBucket", {
      cors: [
        {
          allowedOrigins: [
            "http://localhost:3000",
            "https://cs452-final-project.vercel.app",
            "*" // optional
          ],
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

    // ==============================================================
    // 3️⃣ API CONSTRUCTS
    // ==============================================================

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
