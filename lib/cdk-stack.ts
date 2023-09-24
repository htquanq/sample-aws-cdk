import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {Construct} from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as loadbalancing from 'aws-cdk-lib/aws-elasticloadbalancingv2';
export interface CdkStackProps extends cdk.StackProps {
  bucketName: string,
  commonTags: any,
  ipRange: string
}

export class CdkStack extends cdk.Stack{
  constructor(scope: Construct, id: string, props?: CdkStackProps){
    super(scope, id, props);

    const vpcId = this.node.tryGetContext('vpcid');
    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcId: vpcId
    })

    const pubsubnets = vpc.selectSubnets({subnetType: ec2.SubnetType.PUBLIC});
    const beginPort = Number(props?.ipRange.split("-")[0])
    const endPort = Number(props?.ipRange.split("-")[1])
    let tmp = Array();
    let portRange = range(endPort-beginPort+1, beginPort)
    for (let i = 0; i < portRange.length;i+=5) {
      const newItems = portRange.slice(i,i+5)
      tmp.push(newItems)
    }

    for (let i = 0; i < tmp.length; i++) {
      // create ecs fargate service
      // create target group and add targets
      for (let a = 0; a < tmp[i].length; a++) {
        const targetGroup = new loadbalancing.NetworkTargetGroup(this, `targetGroup${tmp[i][a]}`, {
          port: tmp[i][a],
          targetGroupName: `targetGroup${tmp[i][a]}`,
          targetType: loadbalancing.TargetType.IP,
          vpc: vpc
        })
      }
    }

    function range(size: number, startAt = 0) {
        return [...Array(size).keys()].map(i => i + startAt);
    }
    
    new cdk.CfnOutput(this, 'publicsubnets', {
      value: pubsubnets.subnetIds.toString(),
    });
  }
}