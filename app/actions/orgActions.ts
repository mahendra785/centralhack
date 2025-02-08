import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";
import { CreateOrganizationType } from "@/lib/validation/schema";

export async function createOrg(body: CreateOrganizationType) {
    const session = await auth();
    const user = session?.user;
    if (!user) {
       //do something
    }
    const org = await prisma.organization.create({
        data: {
            name: body.name,
            description: body.description || "",
            domain: body.domain,
        }
    });
    return {
        status: "success",
        message: "Organization created successfully",
        data: org
    };
}

export async function getOrg(id: string) {
    const org = await prisma.organization.findUnique({
        where: { id }
    });
    if (!org) {
        return {
            status: "error",
            message: "Organization not found"
        };
    }
    return {
        status: "success",
        message: "Organization found",
        data: org
    };
}

export async function getOrgMembers(id: string) {
    const org = await prisma.organization.findUnique({
        where: { id },
        include: {
            members: true
        }
    });

    if (!org) {
        return {
            status: "error",
            message: "Organization not found"
        };
    }
    
    return {
        status: "success",
        message: "Organization members",
        data: org.members
    };
}

export async function leaveOrg(orgId: string) {
    const session = await auth();
    if (!session?.user) {
        return {
            status: "error",
            message: "User not found"
        };
    }

    const org = await prisma.organization.findUnique({
        where: { id: orgId },
        include: {
            members: true
        }
    });

    if (!org) {
        return {
            status: "error",
            message: "Organization not found"
        };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        return {
            status: "error",
            message: "User not found"
        };
    }

    if (user.organizationId !== orgId) {
        return {
            status: "error",
            message: "User is not a member of this organization"
        };
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { organizationId: null }
    });

    return {
        status: "success",
        message: "User left organization",
        data: user
    };
}
