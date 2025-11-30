#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ApiStack } from "../lib/api-stack";
import { DatabaseStack } from "../lib/database-stack";
import "source-map-support/register";

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION || "us-east-2",
};

const dbStack = new DatabaseStack(app, "DatabaseStack", { env });

new ApiStack(app, "ApiStack", {
  env,
  vpc: dbStack.vpc,
  dbSecret: dbStack.dbSecret,
  dbEndpoint: dbStack.db.dbInstanceEndpointAddress,
});
