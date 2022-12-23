import * as CDK from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import { SecretValue } from "aws-cdk-lib";

class CIPipeline extends CDK.Stack {
  constructor(scope: Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props);

    const pipeline = new codepipeline.Pipeline(this, "CI", {
      pipelineName: "CI",
    });

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new actions.GitHubSourceAction({
      actionName: "GitHubSource",
      output: sourceOutput,
      owner: "tatethurston",
      repo: "squid",
      branch: "main",
      oauthToken: SecretValue.secretsManager("github_token"),
    });
    pipeline.addStage({ stageName: "source", actions: [sourceAction] });

    const project = new codebuild.PipelineProject(this, "Build App", {
      projectName: "Build App",
    });
    const buildOutput = new codepipeline.Artifact("Source Code");
    const buildAction = new actions.CodeBuildAction({
      actionName: "CodeBuild",
      type: actions.CodeBuildActionType.BUILD,
      input: sourceOutput,
      outputs: [buildOutput],
      project,
    });
  }
}

export class AppStack extends CDK.Stack {
  constructor(scope: Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, "Handler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromBucket(),
      handler: "index.default",
    });

    const api = new apigateway.LambdaRestApi(this, "APIGateway", {
      handler,
      proxy: true,
    });
  }
}
