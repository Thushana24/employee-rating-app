import { User } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { IJWTPayload } from "./generateToken";

interface PermissionCheckOptions{
    user: IJWTPayload,
    organizationId?: string,
    requiredPermissions: string[]
}

export default async function checkPermission({
    user,
    organizationId,
    requiredPermissions
 }:PermissionCheckOptions): Promise<NextResponse|null> {
    if (!organizationId || requiredPermissions.length === 0) {
        return null;
    }

     // Find the organization membership
    const orgMembership = user.organizations.find((org) => {
        org.organizationId === organizationId;
    });

    if (!orgMembership) {
        return NextResponse.json({
            code: "not-organization-member",
            message: "You are not a member of this organization",
        },
            { status: 403 },
        );
    }

    for(const requiredPermission of requiredPermissions) {
        const [requiredResource, requiredAction, requiredScope] = requiredPermission.split(":") as [string, string, string?];
        
        // Check if user has this permission in their org permissions
        const hasPermission = orgMembership.permissions.some((userPermission) => {
            const [userResource, userAction, userScope] = userPermission.split(":") as [string, string, string];

            if (userResource !== "*" && userResource !== requiredResource) {
                return false;
            }

            if(userAction !== "*" && userAction !== requiredAction) {
                return false;
            }

            if(userScope !== "*" && userScope !== requiredScope) {
                return false;
            }

            return true;  
        });

        if (hasPermission) {
            return null;
        }
    }

    // If we get here, no permissions matched
    return NextResponse.json(
    {
    code: "missing-permissions",
    message: "You don't have permission to perform this action",
    },
    { status: 403 },
    );    
}