import { githubTokenPermissionsCheck } from "../../src/checks/githubTokenPermissions.js";
import { WorkflowConfig } from "../../src/parseWorkflowConfig.js";

const emptyWorkflowConfig: WorkflowConfig = {
  name: "Empty workflow",
  permissions: {},
  jobs: {},
};
const validWorkflowConfig: WorkflowConfig = {
  name: "Valid workflow",
  permissions: {},
  jobs: {
    "build-and-test": {
      permissions: {
        contents: "write",
      },
      steps: [],
    },
  },
};
const invalidNoPermissionsWorkflowConfig: WorkflowConfig = {
  name: "Invalid workflow - permissions not restricted globally",
  // permissions: {},
  jobs: {
    "build-and-test": {
      permissions: {
        contents: "write",
      },
      steps: [],
    },
  },
};
const invalidGlobalPermissionsWorkflowConfig: WorkflowConfig = {
  name: "Invalid workflow - global permissions not restricted",
  permissions: {
    contents: "write",
  },
  jobs: {
    "build-and-test": {
      // permissions: {
      //   contents: "write",
      // },
      steps: [],
    },
  },
};

describe("githubTokenPermissionsCheck", () => {
  it("returns no errors for valid workflows", async () => {
    await expect(
      githubTokenPermissionsCheck({
        "empty-config.yaml": emptyWorkflowConfig,
        "valid-config.yaml": validWorkflowConfig,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("returns errors for invalid workflows", async () => {
    await expect(
      githubTokenPermissionsCheck({
        "empty-config.yaml": emptyWorkflowConfig,
        "valid-config.yaml": validWorkflowConfig,
        "invalid-no-permissions-config.yaml":
          invalidNoPermissionsWorkflowConfig,
        "invalid-global-permissions-config.yaml":
          invalidGlobalPermissionsWorkflowConfig,
      }),
    ).resolves.toStrictEqual([
      "Workflow [invalid-no-permissions-config.yaml] has not set the least required privileges for $GITHUB_TOKEN. See https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#defining-access-for-the-github_token-scopes.",
      "Workflow [invalid-global-permissions-config.yaml] has defined non-empty workflow-level permissions for $GITHUB_TOKEN. To ensure least privileges, set the minimal permissions at the job, rather than workflow, level. See https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idpermissions.",
    ]);
  });
});
