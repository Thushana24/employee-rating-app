import { LoginUserSchema, RegisterUserSchema } from "@/schemas/user.schema";
import { User } from "@prisma/client";
import z from "zod";

export type UserWithToken = User & { token: string };

export type RegisterInput = z.infer<typeof RegisterUserSchema>;

export type LoginInput = z.infer<typeof LoginUserSchema>;
