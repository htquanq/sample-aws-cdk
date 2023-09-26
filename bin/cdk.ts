#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import { BuildConfig } from "../lib/utils/buildConfig"
import { profile } from 'console';

const app = new cdk.App();

function ensureString(object: { [name: string]: any }, propName: string ): string
{
    if(!object[propName] || object[propName].trim().length === 0)
        throw new Error(propName +" does not exist or is empty");

    return object[propName];
}

function getConfig() {
  let env = app.node.tryGetContext('config');
  if (!env) 
    throw new Error("Context variable is missing on CDK command. Pass in as `-c config=XXX`");
  let unparsedEnv = app.node.tryGetContext(env);

  let buildConfig: BuildConfig = {
    AWSAccountID: ensureString(unparsedEnv, 'accountId'),
    AWSProfileName: ensureString(unparsedEnv, 'awsProfile'),
    AWSProfileRegion: ensureString(unparsedEnv, 'region'),
    vpcId: ensureString(unparsedEnv, 'vpcId'),
    environment: ensureString(unparsedEnv, 'environment')
  }

  return buildConfig
}

function main() {
  let buildConfig: BuildConfig = getConfig()
  new CdkStack(app, 'htquanqTestStack', buildConfig, {
    bucketName: 'htquanq-cdk-bucket',
    commonTags: [{ key: 'Environment', value: buildConfig.environment }],
    ipRange: "8088-8100",
    env: {
      account: buildConfig.AWSAccountID,
      region: buildConfig.AWSProfileRegion
    }
  });
  app.synth();
}

main()
