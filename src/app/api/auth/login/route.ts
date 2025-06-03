import { LoginUserSchema } from "@/schemas/user.schema";
import { NextRequest, NextResponse } from "next/server";
import {verify} from "argon2";
import generateToken, { IJWTPayload } from "../../helpers/generateToken";
import { success } from "zod/v4";
import { error } from "console";
import handleError from "../../helpers/handleError";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = LoginUserSchema.parse(body);

        const user = await prisma?.user.findUnique({
            where: {
                email,
            },
            include: {
                OrganizationMembers: true,
            }
        });

        const invalidCredientialsResponse = NextResponse.json({
            success: false,
            error: {
                code: "INVALID_CREDENTIALS",
                message: "invalid email or password",
            },
        },
            { status: 401 }
        );

        if (!user) {
            return invalidCredientialsResponse;
        }

        const isPasswordValid = await verify(user.password, password);

        if (!isPasswordValid) {
            return invalidCredientialsResponse;
        }

        const token = generateToken<IJWTPayload>({
            id: user.id,
            organizations: user.OrganizationMembers,
        })

        const { password: _, ...userData } = user;

        return NextResponse.json({
            success: true,
            data: {
                user: userData,
                token,
            },
        },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return handleError(error, "failed to authenticate user");
    }
}