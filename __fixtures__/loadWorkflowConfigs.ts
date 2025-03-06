import { jest } from "@jest/globals";

export const loadWorkflowConfigs =
  jest.fn<typeof import("../src/loadWorkflowConfigs.js").loadWorkflowConfigs>();
