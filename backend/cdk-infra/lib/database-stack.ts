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
  SecurityGroup,
} from "aws-cdk-lib/aws-ec2";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";

export class DatabaseStack extends Stack {
  public readonly vpc: Vpc;
  public readonly db: DatabaseInstance;
  public readonly dbSecret: Secret;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPC for database + lambdas
    this.vpc = new Vpc(this, "AnimalVpc", {
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "public",
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: "private",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Store DB credentials securely
    this.dbSecret = new Secret(this, "AnimalDbSecret", {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "admin" }),
        excludeCharacters: "\"@/\\ '",
        generateStringKey: "password",
      },
    });

    // RDS instance
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

    // Allow Lambda(s) to connect to MySQL
    this.db.connections.allowFromAnyIpv4(Port.tcp(3306)); // dev only
  }
}
