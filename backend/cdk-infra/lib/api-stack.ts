import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
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

    this.httpApi = new HttpApi(this, "animal-shelter");

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

    const createAnimalIntegration = new HttpLambdaIntegration(
      "CreateAnimalIntegration",
      createAnimalLambda
    );

    this.httpApi.addRoutes({
      path: "/animals",
      methods: [HttpMethod.POST],
      integration: createAnimalIntegration,
    });
  }
}
