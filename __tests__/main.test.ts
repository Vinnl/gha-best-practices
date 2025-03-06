/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from "@jest/globals";
import * as core from "../__fixtures__/core.js";
import { loadWorkflowConfigs } from "../__fixtures__/loadWorkflowConfigs.js";

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule("@actions/core", () => core);
jest.unstable_mockModule("../src/loadWorkflowConfigs.js", () => ({
  loadWorkflowConfigs,
}));

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import("../src/main.js");

describe("main.ts", () => {
  it("Stores warnings as output", async () => {
    loadWorkflowConfigs.mockResolvedValueOnce({
      "empty-workflow.yaml": {
        name: "Empty workflow",
        jobs: {},
      },
      "terribly-invalid-workflow.yaml": {
        name: "Terribly invalid workflow",
        permissions: {
          contents: "write",
        },
        jobs: {
          "job-with-invalid-steps": {
            steps: [
              {
                uses: "actions/checkout@v4",
                if: "github.actor == 'dependabot[bot]'",
              },
            ],
          },
        },
      },
    });
    await run();

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      "warnings",
      expect.objectContaining({ length: 4 }),
    );
  });

  it("Sets a failed status", async () => {
    // Clear the wait mock and return a rejected promise.
    loadWorkflowConfigs
      .mockClear()
      .mockRejectedValueOnce(new Error("Could not load workflow configs"));

    await run();

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      "Could not load workflow configs",
    );
  });
});
