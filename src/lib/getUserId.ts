import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "./authOptions";
import { Session } from "@/types/Session";

export const getUserId = async (_req: NextRequest): Promise<string> => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  return session.user?.email;
};
