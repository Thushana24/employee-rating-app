import { CriteriaSchema } from "@/schemas/criteria.schema";
import { CreateOrganizationSchema } from "@/schemas/organization.schema";
import { InviteUserSchema } from "@/schemas/user.schema";
import z from "zod";

export type OrganizationInput = z.infer<typeof CreateOrganizationSchema>;
export type InviteInput = z.infer<typeof InviteUserSchema>;
export type CriteriaInput = z.infer<typeof CriteriaSchema>;
export type InviteResponse = {
  data: {
    userId: string;
    email: string;
    role: string;
    status: "INVITED";
    organization: {
      id: string;
      name: string;
    };
    inviteSent: boolean;
  };
  success: true;
};
