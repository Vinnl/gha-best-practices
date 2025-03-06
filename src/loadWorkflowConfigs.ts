import * as glob from "@actions/glob";
import { parseWorkflowConfig, WorkflowConfig } from "./parseWorkflowConfig.js";
import { readFile } from "fs/promises";

export async function loadWorkflowConfigs(): Promise<
  Record<string, WorkflowConfig>
> {
  const globber = await glob.create(".github/workflows/*.yml");
  const filePaths = await globber.glob();
  const entries = await Promise.all(
    filePaths.map(async (filePath) => {
      const contents = await readFile(filePath, "utf8");
      const parsedConfig = await parseWorkflowConfig(contents);
      return [
        filePath.substring(filePath.lastIndexOf(".github")),
        parsedConfig,
      ] as const;
    }),
  );

  return Object.fromEntries(entries);
}
