import { z } from "zod";

export const OrganizationSchema = z.object({
    id: z.string().cuid(),
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    domain: z.string().min(3).max(50),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const CreateOrganizationSchema = OrganizationSchema.pick({
    name: true,
    description: true,
    domain: true,
});

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial();

export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateOrganizationType = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganizationType = z.infer<typeof UpdateOrganizationSchema>;