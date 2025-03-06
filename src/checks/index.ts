import { WorkflowConfig } from "../parseWorkflowConfig.js";

export type Check = (
  workflowConfigs: Record<string, WorkflowConfig>,
) => Promise<string[]>;
