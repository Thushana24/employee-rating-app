import privateRoute from "@/app/api/auth/helpers/privateRoute";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import handleError from "@/app/api/auth/helpers/handleError";
import { UserQuerySchema } from "@/schemas/user.schema";
import getPaginationParams from "../../../helpers/getPaginationParams";
import { getSearchQuery } from "../../../helpers/getSearchQuery";
import { Prisma } from "@prisma/client";

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
        // Split pagination and search schema
        const PaginationSchema = UserQuerySchema.omit({ search: true });
        const SearchSchema = UserQuerySchema.pick({ search: true });

        const { page, size } = getPaginationParams({
          request,
          schema: PaginationSchema,
        });

        const { search: searchText } = getSearchQuery({
          request,
          schema: SearchSchema,
        });

        // Search filter on related User fields
        const searchFilter: Prisma.OrganizationMemberWhereInput = searchText
          ? {
              User: {
                OR: [
                  {
                    firstName: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                  {
                    lastName: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                  {
                    email: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                ],
              },
            }
          : {};

        // Common filter
        const whereClause: Prisma.OrganizationMemberWhereInput = {
          organizationId,
          role: "EMPLOYEE",
          ...searchFilter,
        };

        // Count total employees
        const totalCount = await prisma.organizationMember.count({
          where: whereClause,
        });

        // Fetch paginated employees
        const employees = await prisma.organizationMember.findMany({
          where: whereClause,
          select: {
            id: true,
            role: true,
            status: true,
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          skip: (page - 1) * size,
          take: size,
          orderBy: [
            {
              User: {
                firstName: "asc",
              },
            },
            {
              User: {
                lastName: "asc",
              },
            },
          ],
        });

        // Pagination metadata
        const totalPages = Math.ceil(totalCount / size);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return NextResponse.json({
          success: true,
          data: employees,
          pagination: {
            page,
            size,
            totalCount,
            totalPages,
            hasNextPage,
            hasPrevPage,
          },
        });
      } catch (error) {
        return handleError(error, "Failed to fetch employees");
      }
    }
  );
}
