import { z } from "zod";

import { orgNodeSchema } from "./org-tree.schema";

export const orgNodePatchSchema = z.object({
  type: z.literal("node.updated"),
  node: orgNodeSchema,
});

export type OrgNodePatch = z.infer<typeof orgNodePatchSchema>;
