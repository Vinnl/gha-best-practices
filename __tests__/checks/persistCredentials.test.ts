import { persistCredentialsCheck } from "../../src/checks/persistCredentials.js";
import { WorkflowConfig } from "../../src/parseWorkflowConfig.js";

const emptyWorkflowConfig: WorkflowConfig = {
  name: "Empty workflow",
  jobs: {},
};
const validWorkflowConfig: WorkflowConfig = {
  name: "Valid workflow",
  jobs: {
    "build-and-test": {
      steps: [
        {
          uses: "actions/checkout@v3",
          with: {
            "persist-credentials": false,
          },
        },
      ],
    },
  },
};
const invalidWorkflowConfig: WorkflowConfig = {
  name: "Workflow with two invalid usages of @actions/checkout",
  jobs: {
    "explicitly-set-to-true": {
      steps: [
        {
          uses: "actions/checkout@v3",
          with: {
            "persist-credentials": true,
          },
        },
      ],
    },
    "persist-credentials-not-set": {
      steps: [
        {
          uses: "actions/checkout@v3",
        },
      ],
    },
  },
};

describe("persistCredentialsCheck", () => {
  it("returns no errors for valid workflows", async () => {
    await expect(
      persistCredentialsCheck({
        "empty-config.yaml": emptyWorkflowConfig,
        "valid-config.yaml": validWorkflowConfig,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("returns errors for invalid workflows", async () => {
    await expect(
      persistCredentialsCheck({
        "empty-config.yaml": emptyWorkflowConfig,
        "valid-config.yaml": validWorkflowConfig,
        "invalid-config.yaml": invalidWorkflowConfig,
      }),
    ).resolves.toStrictEqual([
      "Workflow [invalid-config.yaml] uses actions/checkout in job [explicitly-set-to-true] step [0] with persist-credentials not set to false.",
      "Workflow [invalid-config.yaml] uses actions/checkout in job [persist-credentials-not-set] step [0] with persist-credentials not set to false.",
    ]);
  });
});
