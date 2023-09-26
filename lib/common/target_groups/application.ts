import * as loadbalancer from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface ApplicationTargetGroupProps extends cdk.StackProps {
  port: number,
  name: string,
  targetType: string,
  vpc?: string
  deregistrationDelay?: number,
  targets?: [],
  protocol?: string
}

export class ApplicationTargetGroup extends Construct {
  constructor(scope: Construct, id: string, props?: ApplicationTargetGroupProps){
    super(scope,id)
  }
}