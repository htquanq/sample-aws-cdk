import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import {Construct} from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as loadbalancing from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as utils from './utils/index';
import {BuildConfig} from "./utils/buildConfig";

export interface CdkStackProps extends cdk.StackProps {
  bucketName: string,
  commonTags: any,
  ipRange: string
}

export class CdkStack extends cdk.Stack{
  constructor(scope: Construct, id: string, buildConfig: BuildConfig, props?: CdkStackProps){
    super(scope, id, props);

    const vpcId: string = buildConfig.vpcId;
    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcId: vpcId
    })

    const pubsubnets = vpc.selectSubnets({subnetType: ec2.SubnetType.PUBLIC});
    const portRange = utils.stringToList(`${props?.ipRange}`)
    for (let i = 0; i < portRange.length; i++) {
      for (let a = 0; a < portRange[i].length; a++) {
      // create target groups
        const targetGroup = new loadbalancing.NetworkTargetGroup(this, `targetGroup${portRange[i][a]}`, {
          port: portRange[i][a],
          targetGroupName: `targetGroup${portRange[i][a]}`,
          targetType: loadbalancing.TargetType.IP,
          vpc: vpc
        });
      }
    }
    
    new cdk.CfnOutput(this, 'publicsubnets', {
      value: pubsubnets.subnetIds.toString(),
    });
  }
}