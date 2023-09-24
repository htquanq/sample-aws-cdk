#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
const app = new cdk.App();
new CdkStack(app, 'htquanqTestStack', {
  bucketName: 'htquanq-cdk-bucket',
  commonTags: [{ key: 'Environment', value: 'demo' }],
  ipRange: "8088-8100",
  env: {
    account: "756007437776",
    region: "ap-southeast-1",
  }
});

app.synth();