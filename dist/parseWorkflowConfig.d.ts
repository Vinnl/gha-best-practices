export type WorkflowConfig = {
    name: string;
    permissions?: Record<string, "read" | "write" | "none">;
    jobs: Record<string, {
        permissions?: Record<string, "read" | "write" | "none">;
        steps: Array<{
            uses?: string;
            with?: Record<string, unknown>;
            if?: string;
        }>;
    }>;
};
export declare function parseWorkflowConfig(rawConfig: string): Promise<WorkflowConfig>;
