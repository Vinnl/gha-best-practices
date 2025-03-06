import { dependabotValidationCheck } from "../../src/checks/dependabotValidation.js";
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
      steps: [
        {
          if: "github.event.pull_request.user.login == 'dependabot[bot]'",
        },
        {
          if: true as unknown as string,
        },
        {},
      ],
    },
  },
};
const invalidWorkflowConfig: WorkflowConfig = {
  name: "Invalid workflow",
  jobs: {
    "build-and-test": {
      steps: [
        {
          if: "github.actor == 'dependabot[bot]'",
        },
      ],
    },
  },
};

describe("dependabotValidationCheck", () => {
  it("returns no errors for valid workflows", async () => {
    await expect(
      dependabotValidationCheck({
        "empty-config.yaml": emptyWorkflowConfig,
        "valid-config.yaml": validWorkflowConfig,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("returns errors for invalid workflows", async () => {
    await expect(
      dependabotValidationCheck({
        "empty-config.yaml": emptyWorkflowConfig,
        "valid-config.yaml": validWorkflowConfig,
        "invalid-config.yaml": invalidWorkflowConfig,
      }),
    ).resolves.toStrictEqual([
      "Workflow [invalid-config.yaml] has a check for Dependabot for the job [build-and-test], step [0], but it validates the actor, not the user. Use `github.event.pull_request.user.login` instead of `github.actor`.",
    ]);
  });
});
