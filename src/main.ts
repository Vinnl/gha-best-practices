import * as core from "@actions/core";
import { loadWorkflowConfigs } from "./loadWorkflowConfigs.js";
import { persistCredentialsCheck } from "./checks/persistCredentials.js";
import { githubTokenPermissionsCheck } from "./checks/githubTokenPermissions.js";
import { Check } from "./checks/index.js";
import { dependabotValidationCheck } from "./checks/dependabotValidation.js";

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const configs = await loadWorkflowConfigs();

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(
      `Detected the following workflow configs: ${JSON.stringify(Object.keys(configs), null, 2)}`,
    );

    const checks: Check[] = [
      persistCredentialsCheck,
      githubTokenPermissionsCheck,
      dependabotValidationCheck,
    ];
    const warnings = (
      await Promise.all(checks.map((check) => check(configs)))
    ).flat();

    // Set outputs for other workflow steps to use
    core.setOutput("warnings", warnings);

    if (warnings.length > 0) {
      core.setFailed(warnings.join("\n"));
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message);
  }
}
