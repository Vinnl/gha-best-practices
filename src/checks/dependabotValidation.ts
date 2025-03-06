import { WorkflowConfig } from "../parseWorkflowConfig.js";
import { Check } from "./index.js";

export const dependabotValidationCheck: Check = async (configs) => {
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
      .map((step, i) => {
        if (typeof step.if !== "string") {
          return null;
        }
        // Split the if statements on whitespace:
        const conditionParts = step.if.split(/\s/);
        if (
          !conditionParts.some(
            (part) =>
              part === "'dependabot[bot]'" || part === '"dependabot[bot]"',
          ) ||
          !conditionParts.some((part) => part === "github.actor")
        ) {
          return null;
        }
        return `Workflow [${workflowPath}] has a check for Dependabot for the job [${jobName}], step [${i}], but it validates the actor, not the user. Use \`github.event.pull_request.user.login\` instead of \`github.actor\`.`;
      })
      .filter((warning) => warning !== null);
  });
}
