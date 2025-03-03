import { sendEmail } from "@/utils/email";

export async function POST(req: Request) {
  const { email, verificationToken } = await req.json();

  try {
    const verificationUrl = `${process.env.API_URL}/api/verify?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Learn Sinhala: Verify Your Email",
      text: `Click this link to verify your email: ${verificationUrl}`,
    });

    return new Response(JSON.stringify({ message: "Email sent" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Email sending failed" }), {
      status: 500,
    });
  }
}
