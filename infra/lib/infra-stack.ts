import * as CDK from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdkpipelines from "aws-cdk-lib/pipelines";

export class InfraStack extends CDK.Stack {
  constructor(scope: Construct, id: string, props?: CDK.StackProps) {
    super(scope, id, props);

    // CDK changes are automatically released when merged into GH
    const pipeline = new cdkpipelines.CodePipeline(this, "CodePipeline", {
      pipelineName: "CI",
      synth: new cdkpipelines.ShellStep("CDK Synth", {
        input: cdkpipelines.CodePipelineSource.gitHub(
          "tatethurston/squid",
          "main"
        ),
        commands: ["cd infra", "npm ci", "npm run build", "npx cdk synth"],
      }),
    });
  }
}
