import { WorkflowConfig } from "../parseWorkflowConfig.js";
import { Check } from "./index.js";

export const githubTokenPermissionsCheck: Check = async (configs) => {
  return Object.entries(configs).flatMap(([workflowPath, workflowConfig]) =>
    getWarningsForWorkflow(workflowPath, workflowConfig),
  );
};

function getWarningsForWorkflow(
  workflowPath: string,
  workflowConfig: WorkflowConfig,
): string[] {
  const warnings = [] as string[];
  if (!workflowConfig.permissions) {
    warnings.push(
      `Workflow [${workflowPath}] has not set the least required privileges for $GITHUB_TOKEN. See https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defining-access-for-the-github_token-scopes.`,
    );
  } else if (Object.values(workflowConfig.permissions).length !== 0) {
    warnings.push(
      `Workflow [${workflowPath}] has defined non-empty workflow-level permissions for $GITHUB_TOKEN. To ensure least privileges, set the minimal permissions at the job, rather than workflow, level. See https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions.`,
    );
  }
  return warnings;
}
