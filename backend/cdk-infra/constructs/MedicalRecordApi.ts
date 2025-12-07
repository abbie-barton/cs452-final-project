import { Construct } from "constructs";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

interface MedicalRecordsApiProps {
  api: HttpApi;
  vpc: IVpc;
  dbSecret: ISecret;
  dbEndpoint: string;
}

export class MedicalRecordsApi extends Construct {
  constructor(scope: Construct, id: string, props: MedicalRecordsApiProps) {
    super(scope, id);

    const { api, vpc, dbSecret, dbEndpoint } = props;

    const commonEnv = {
      DB_HOST: dbEndpoint,
      DB_NAME: "animal_shelter",
      DB_PORT: "3306",
      DB_SECRET_NAME: dbSecret.secretName,
    };

    // CREATE
    const createMedicalRecordLambda = new NodejsFunction(
      this,
      "CreateMedicalRecordLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(
          __dirname,
          "../../src/lambdas/medicalRecords/createRecord.ts"
        ),
        handler: "main",
        vpc,
        environment: commonEnv,
      }
    );

    // GET (by animal)
    const getMedicalRecordsByAnimalLambda = new NodejsFunction(
      this,
      "GetMedicalRecordsByAnimalLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(
          __dirname,
          "../../src/lambdas/medicalRecords/getRecordsByAnimal.ts"
        ),
        handler: "main",
        vpc,
        environment: commonEnv,
      }
    );

    // GET (by id)
    const getMedicalRecordsByIdLambda = new NodejsFunction(
      this,
      "GetMedicalRecordsByIdLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(__dirname, "../../src/lambdas/medicalRecords/getRecord.ts"),
        handler: "main",
        vpc,
        environment: commonEnv,
      }
    );

    // UPDATE
    const updateMedicalRecordLambda = new NodejsFunction(
      this,
      "UpdateMedicalRecordLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(
          __dirname,
          "../../src/lambdas/medicalRecords/updateRecord.ts"
        ),
        handler: "main",
        vpc,
        environment: commonEnv,
      }
    );

    // DELETE
    const deleteMedicalRecordLambda = new NodejsFunction(
      this,
      "DeleteMedicalRecordLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        entry: join(
          __dirname,
          "../../src/lambdas/medicalRecords/deleteRecord.ts"
        ),
        handler: "main",
        vpc,
        environment: commonEnv,
      }
    );

    // Permissions
    dbSecret.grantRead(createMedicalRecordLambda);
    dbSecret.grantRead(getMedicalRecordsByAnimalLambda);
    dbSecret.grantRead(getMedicalRecordsByIdLambda);
    dbSecret.grantRead(updateMedicalRecordLambda);
    dbSecret.grantRead(deleteMedicalRecordLambda);

    // Integrations
    const createIntegration = new HttpLambdaIntegration(
      "CreateMedicalRecordIntegration",
      createMedicalRecordLambda
    );

    const getByAnimalIntegration = new HttpLambdaIntegration(
      "GetMedicalRecordsByAnimalIntegration",
      getMedicalRecordsByAnimalLambda
    );

    const getByIdIntegration = new HttpLambdaIntegration(
        "GetMedicalRecordsByIdIntegration",
        getMedicalRecordsByIdLambda
    )

    const updateIntegration = new HttpLambdaIntegration(
      "UpdateMedicalRecordIntegration",
      updateMedicalRecordLambda
    );

    const deleteIntegration = new HttpLambdaIntegration(
      "DeleteMedicalRecordIntegration",
      deleteMedicalRecordLambda
    );

    // ---------------- ROUTES ----------------

    // Create a new medical record for an animal
    api.addRoutes({
      path: "/animals/{animalId}/medical-records",
      methods: [HttpMethod.POST],
      integration: createIntegration,
    });

    // Get all medical records for an animal
    api.addRoutes({
      path: "/animals/{animalId}/medical-records",
      methods: [HttpMethod.GET],
      integration: getByAnimalIntegration,
    });

    // Get a medical record by its id
    api.addRoutes({
        path: "/medical-records/{recordId}",
        methods: [HttpMethod.GET],
        integration: getByIdIntegration
    })

    // Update a medical record
    api.addRoutes({
      path: "/medical-records/{recordId}",
      methods: [HttpMethod.PUT],
      integration: updateIntegration,
    });

    // Delete a medical record
    api.addRoutes({
      path: "/medical-records/{recordId}",
      methods: [HttpMethod.DELETE],
      integration: deleteIntegration,
    });
  }
}
