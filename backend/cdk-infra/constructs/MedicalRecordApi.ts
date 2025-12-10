import { Construct } from "constructs";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { IVpc, ISecurityGroup, SubnetType } from "aws-cdk-lib/aws-ec2";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

export interface MedicalRecordsApiProps {
  api: HttpApi;
  vpc: IVpc;
  dbSecret: ISecret;
  dbEndpoint: string;
  securityGroup?: ISecurityGroup; // optional
}

export class MedicalRecordsApi extends Construct {
  constructor(scope: Construct, id: string, props: MedicalRecordsApiProps) {
    super(scope, id);

    const commonLambdaConfig = {
      runtime: Runtime.NODEJS_18_X,
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: props.securityGroup ? [props.securityGroup] : undefined,
      environment: {
        DB_HOST: props.dbEndpoint,
        DB_NAME: "animal_shelter",
        DB_PORT: "3306",
        DB_SECRET_NAME: props.dbSecret.secretName,
      },
    };

    const createLambda = new NodejsFunction(this, "CreateMedicalRecordLambda", {
      ...commonLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/medicalRecords/createRecord.ts"),
      handler: "main",
    });

    const getByAnimalLambda = new NodejsFunction(this, "GetMedicalRecordsByAnimalLambda", {
      ...commonLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/medicalRecords/getRecordsByAnimal.ts"),
      handler: "main",
    });

    const getByIdLambda = new NodejsFunction(this, "GetMedicalRecordsByIdLambda", {
      ...commonLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/medicalRecords/getRecord.ts"),
      handler: "main",
    });

    const updateLambda = new NodejsFunction(this, "UpdateMedicalRecordLambda", {
      ...commonLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/medicalRecords/updateRecord.ts"),
      handler: "main",
    });

    const deleteLambda = new NodejsFunction(this, "DeleteMedicalRecordLambda", {
      ...commonLambdaConfig,
      entry: join(__dirname, "../../src/lambdas/medicalRecords/deleteRecord.ts"),
      handler: "main",
    });

    // Grant secret read permissions
    [createLambda, getByAnimalLambda, getByIdLambda, updateLambda, deleteLambda].forEach(l =>
      props.dbSecret.grantRead(l)
    );

    // Integrations
    const createIntegration = new HttpLambdaIntegration("CreateMedicalRecordIntegration", createLambda);
    const getByAnimalIntegration = new HttpLambdaIntegration("GetMedicalRecordsByAnimalIntegration", getByAnimalLambda);
    const getByIdIntegration = new HttpLambdaIntegration("GetMedicalRecordsByIdIntegration", getByIdLambda);
    const updateIntegration = new HttpLambdaIntegration("UpdateMedicalRecordIntegration", updateLambda);
    const deleteIntegration = new HttpLambdaIntegration("DeleteMedicalRecordIntegration", deleteLambda);

    // Routes
    props.api.addRoutes({ path: "/animals/{animalId}/medical-records", methods: [HttpMethod.POST], integration: createIntegration });
    props.api.addRoutes({ path: "/animals/{animalId}/medical-records", methods: [HttpMethod.GET], integration: getByAnimalIntegration });
    props.api.addRoutes({ path: "/medical-records/{recordId}", methods: [HttpMethod.GET], integration: getByIdIntegration });
    props.api.addRoutes({ path: "/medical-records/{recordId}", methods: [HttpMethod.PUT], integration: updateIntegration });
    props.api.addRoutes({ path: "/medical-records/{recordId}", methods: [HttpMethod.DELETE], integration: deleteIntegration });
  }
}
