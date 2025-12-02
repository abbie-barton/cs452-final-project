import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

interface ApiStackProps extends StackProps {
  vpc: IVpc;
  dbSecret: ISecret;
  dbEndpoint: string;
}

export class ApiStack extends Stack {
  public readonly httpApi: HttpApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

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

    const createAnimalLambda = new NodejsFunction(this, "CreateAnimalLambda", {
      runtime: Runtime.NODEJS_18_X,
      entry: join(__dirname, "../../src/lambdas/animals/createAnimal.ts"),
      handler: "main",
      vpc: props!.vpc,
      environment: {
        DB_HOST: props.dbEndpoint,
        DB_NAME: "animal_shelter",
        DB_PORT: "3306",
        DB_SECRET_NAME: props.dbSecret.secretName,
      },
      bundling: {
        externalModules: [],
      },
    });
    props!.dbSecret.grantRead(createAnimalLambda);

    const getAnimalsLambda = new NodejsFunction(this, "GetAnimalsLambda", {
      runtime: Runtime.NODEJS_18_X,
      entry: join(__dirname, "../../src/lambdas/animals/getAnimals.ts"),
      handler: "main",
      vpc: props.vpc,
      environment: {
        DB_HOST: props.dbEndpoint,
        DB_NAME: "animal_shelter",
        DB_PORT: "3306",
        DB_SECRET_NAME: props.dbSecret.secretName,
      },
      bundling: { externalModules: [] },
    });
    props.dbSecret.grantRead(getAnimalsLambda);

    const updateAnimalLambda = new NodejsFunction(this, "UpdateAnimalLambda", {
      runtime: Runtime.NODEJS_18_X,
      entry: join(__dirname, "../../src/lambdas/animals/updateAnimal.ts"),
      handler: "main",
      vpc: props.vpc,
      environment: {
        DB_HOST: props.dbEndpoint,
        DB_NAME: "animal_shelter",
        DB_PORT: "3306",
        DB_SECRET_NAME: props.dbSecret.secretName,
      },
    });
    props.dbSecret.grantRead(updateAnimalLambda);

    const deleteAnimalLambda = new NodejsFunction(this, "DeleteAnimalLambda", {
      runtime: Runtime.NODEJS_18_X,
      entry: join(__dirname, "../../src/lambdas/animals/deleteAnimal.ts"),
      handler: "main",
      vpc: props.vpc,
      environment: {
        DB_HOST: props.dbEndpoint,
        DB_NAME: "animal_shelter",
        DB_PORT: "3306",
        DB_SECRET_NAME: props.dbSecret.secretName,
      },
    });
    props.dbSecret.grantRead(deleteAnimalLambda);

    const createAnimalIntegration = new HttpLambdaIntegration(
      "CreateAnimalIntegration",
      createAnimalLambda
    );

    const getAnimalsIntegration = new HttpLambdaIntegration(
      "GetAnimalsIntegration",
      getAnimalsLambda
    );

    const updateAnimalIntegration = new HttpLambdaIntegration(
      "UpdateAnimalIntegration",
      updateAnimalLambda
    );

    const deleteAnimalIntegration = new HttpLambdaIntegration(
      "DeleteAnimalIntegration",
      deleteAnimalLambda
    );

    this.httpApi.addRoutes({
      path: "/animals",
      methods: [HttpMethod.GET],
      integration: getAnimalsIntegration,
    });

    this.httpApi.addRoutes({
      path: "/animals",
      methods: [HttpMethod.POST],
      integration: createAnimalIntegration,
    });

    this.httpApi.addRoutes({
      path: "/animals/{id}",
      methods: [HttpMethod.PUT],
      integration: updateAnimalIntegration,
    });

    this.httpApi.addRoutes({
      path: "/animals/{id}",
      methods: [HttpMethod.DELETE],
      integration: deleteAnimalIntegration,
    });

    this.httpApi.addRoutes({
      path: "/animals/{id}",
      methods: [HttpMethod.GET],
      integration: getAnimalsIntegration,
    });
  }
}
