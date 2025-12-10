import { Construct } from "constructs";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { IVpc, ISecurityGroup, SubnetType } from "aws-cdk-lib/aws-ec2";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";

export interface AnimalsApiProps {
  api: HttpApi;
  vpc: IVpc;
  dbSecret: ISecret;
  dbEndpoint: string;
  securityGroup?: ISecurityGroup; // optional
}

export class AnimalsApi extends Construct {
  constructor(scope: Construct, id: string, props: AnimalsApiProps) {
    super(scope, id);

    const baseLambdaConfig = {
      runtime: Runtime.NODEJS_18_X,
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS }, // Lambdas run in private subnets
      securityGroups: props.securityGroup ? [props.securityGroup] : undefined,
      environment: {
        DB_HOST: props.dbEndpoint,
        DB_NAME: "animal_shelter",
        DB_PORT: "3306",
        DB_SECRET_NAME: props.dbSecret.secretName,
        BUCKET_NAME: "apistack-animalimagebucketf793f00e-iqta9ospvrrf",
      },
    };

    const createTablesLambda = new NodejsFunction(this, "CreateTablesLambda", {
      ...baseLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/tables/createTables.ts"),
      handler: "main",
    });
    props.dbSecret.grantRead(createTablesLambda);

    const createTablesIntegration = new HttpLambdaIntegration(
      "CreateTablesIntegration",
      createTablesLambda
    );

    props.api.addRoutes({
      path: "/animals/create-tables",
      methods: [HttpMethod.POST],
      integration: createTablesIntegration,
    });

    const createAnimalLambda = new NodejsFunction(this, "CreateAnimalLambda", {
      ...baseLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/animals/createAnimal.ts"),
      handler: "main",
    });
    props.dbSecret.grantRead(createAnimalLambda);

    const getAnimalsLambda = new NodejsFunction(this, "GetAnimalsLambda", {
      ...baseLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/animals/getAnimals.ts"),
      handler: "main",
    });
    props.dbSecret.grantRead(getAnimalsLambda);

    const updateAnimalLambda = new NodejsFunction(this, "UpdateAnimalLambda", {
      ...baseLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/animals/updateAnimal.ts"),
      handler: "main",
    });
    props.dbSecret.grantRead(updateAnimalLambda);

    const deleteAnimalLambda = new NodejsFunction(this, "DeleteAnimalLambda", {
      ...baseLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/animals/deleteAnimal.ts"),
      handler: "main",
    });
    props.dbSecret.grantRead(deleteAnimalLambda);

    deleteAnimalLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:DeleteObject"],
        resources: [`arn:aws:s3:::apistack-animalimagebucketf793f00e-iqta9ospvrrf/*`],
      })
    );

    // Integrations
    const createIntegration = new HttpLambdaIntegration(
      "CreateAnimalIntegration",
      createAnimalLambda
    );
    const getIntegration = new HttpLambdaIntegration(
      "GetAnimalsIntegration",
      getAnimalsLambda
    );
    const updateIntegration = new HttpLambdaIntegration(
      "UpdateAnimalIntegration",
      updateAnimalLambda
    );
    const deleteIntegration = new HttpLambdaIntegration(
      "DeleteAnimalIntegration",
      deleteAnimalLambda
    );

    // Routes
    props.api.addRoutes({
      path: "/animals/{id}",
      methods: [HttpMethod.GET],
      integration: getIntegration,
    });
    props.api.addRoutes({
      path: "/animals",
      methods: [HttpMethod.GET],
      integration: getIntegration,
    });
    props.api.addRoutes({
      path: "/animals",
      methods: [HttpMethod.POST],
      integration: createIntegration,
    });
    props.api.addRoutes({
      path: "/animals/{id}",
      methods: [HttpMethod.PUT],
      integration: updateIntegration,
    });
    props.api.addRoutes({
      path: "/animals/{id}",
      methods: [HttpMethod.DELETE],
      integration: deleteIntegration,
    });
  }
}
