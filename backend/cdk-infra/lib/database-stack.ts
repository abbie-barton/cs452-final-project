import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  DatabaseInstance,
  DatabaseInstanceEngine,
  MysqlEngineVersion,
} from "aws-cdk-lib/aws-rds";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Port,
  Vpc,
  SubnetType,
} from "aws-cdk-lib/aws-ec2";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class DatabaseStack extends Stack {
  public readonly vpc: Vpc;
  public readonly db: DatabaseInstance;
  public readonly dbSecret: Secret;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // CREATE THE VPC
    this.vpc = new Vpc(this, "AnimalVpc", {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "public",
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: "private",
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    // Secrets Manager VPC Endpoint
    new ec2.InterfaceVpcEndpoint(this, "SecretsManagerEndpoint", {
      vpc: this.vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
    });

    // S3 VPC Endpoint (to allow private lambdas to reach S3)
    new ec2.GatewayVpcEndpoint(this, "S3Endpoint", {
      vpc: this.vpc,
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      ],
    });

    // Secret for DB credentials
    this.dbSecret = new Secret(this, "AnimalDbSecret", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "admin" }),
        excludeCharacters: "\"@/\\ '",
        generateStringKey: "password",
      },
    });

    // RDS Instance
    this.db = new DatabaseInstance(this, "AnimalDB", {
      engine: DatabaseInstanceEngine.mysql({
        version: MysqlEngineVersion.VER_8_0,
      }),
      vpc: this.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      publiclyAccessible: false,
      credentials: {
        username: "admin",
        password: this.dbSecret.secretValueFromJson("password"),
      },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      allocatedStorage: 20,
      databaseName: "animal_shelter",
    });

    this.db.connections.allowFromAnyIpv4(Port.tcp(3306)); // dev only
  }
}
