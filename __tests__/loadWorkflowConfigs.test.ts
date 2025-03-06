import { loadWorkflowConfigs } from "../src/loadWorkflowConfigs.js";

describe("loadWorkflowConfigs", () => {
  it("Returns workflows", async () => {
    const workflows = await loadWorkflowConfigs();

    expect(Object.entries(workflows)).toHaveLength(5);
  });
});
