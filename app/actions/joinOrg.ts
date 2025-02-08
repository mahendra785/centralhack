import { auth } from "@/app/(auth)/auth"
import { prisma } from "@/lib/prisma"

export async function joinOrg(orgId: string, orgPassword: string) {
    try {
        const session = await auth()
        
        if (!session?.user) {
            return {
                error: "You must be logged in to join an organization"
            }
        }

        // Check if user is already in an organization
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { organizationId: true }
        })

        if (user?.organizationId) {
            return {
                error: "You are already a member of an organization"
            }
        }

        // Verify organization exists
        const organization = await prisma.organization.findUnique({
            where: { id: orgId }
        })

        if (!organization) {
            return {
                error: "Organization not found"
            }
        }

        if (orgPassword !== organization.domain) {
            return {
                error: "Invalid organization password"
            }
        }

        // Add user to organization
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                organizationId: orgId,
                Role: 'MEMBER'  // Default role for new members
            }
        })

        return {
            success: true,
            message: "Successfully joined organization"
        }
    } catch (error) {
        console.error('Error joining organization:', error)
        return {
            error: "Failed to join organization"
        }
    }
}