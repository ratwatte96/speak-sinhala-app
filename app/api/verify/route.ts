import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Invalid verification link" }),
      {
        status: 400,
      }
    );
  }

  try {
    // Find the user with the token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 400,
        }
      );
    }

    // Mark the user as verified and remove the token
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null },
    });

    return new Response(
      JSON.stringify({ message: "Email verified successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
