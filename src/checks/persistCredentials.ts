import { WorkflowConfig } from "../parseWorkflowConfig.js";
import { Check } from "./index.js";

export const persistCredentialsCheck: Check = async (configs) => {
  return Object.entries(configs).flatMap(([workflowPath, workflowConfig]) =>
    getWarningsForWorkflow(workflowPath, workflowConfig),
  );
};

function getWarningsForWorkflow(
  workflowPath: string,
  workflowConfig: WorkflowConfig,
): string[] {
  return Object.entries(workflowConfig.jobs).flatMap(([jobName, job]) => {
    return job.steps
      ?.map((step, i) => {
        if (
          typeof step.uses !== "string" ||
          (step.uses !== "actions/checkout" &&
            !step.uses.startsWith("actions/checkout@v")) ||
          step.with?.["persist-credentials"] === false
        ) {
          return null;
        }
        return `Workflow [${workflowPath}] uses actions/checkout in job [${jobName}] step [${i}] with persist-credentials not set to false.`;
      })
      .filter((warning) => warning !== null);
  });
}
