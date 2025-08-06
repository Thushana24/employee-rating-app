import privateRoute from "@/app/api/auth/helpers/privateRoute";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import handleError from "@/app/api/auth/helpers/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: organizationId } = await params;
  return privateRoute(
    request,
    {
      organizationId,
      permissions: ["USER:*:*", "USER:ASSIGN:ASSIGNED"],
    },
    async () => {
      try {
        const supervisors = await prisma.organizationMember.findMany({
          where: {
            organizationId,
            role: "SUPERVISOR",
          },
          select: {
            id: true,
            role: true,
            status: true,
            User: {
              omit: {
                password: true,
              },
            },
          },
        });

        return NextResponse.json({
          success: true,
          data: supervisors,
        });
      } catch (error) {
        return handleError(error, "Failed to fetch employees");
      }
    }
  );
}
