import prisma from "@/lib/prisma";
import { sendEmail } from "@/utils/email";
import rateLimit from "express-rate-limit";

const GITHUB_META_URL = "https://api.github.com/meta";
let githubIpRanges = new Set();

async function updateGitHubIPs() {
  try {
    console.log("Fetching latest GitHub IPs...");
    const res = await fetch(GITHUB_META_URL);
    const data = await res.json();

    if (data.actions) {
      githubIpRanges = new Set(data.actions);
      console.log("Updated GitHub IPs:", Array.from(githubIpRanges));
    } else {
      console.warn("GitHub API returned no action IPs, keeping old IP list.");
    }
  } catch (error) {
    console.error("Failed to update GitHub IPs:", error);
  }
}

// Run once at startup and then every hour
updateGitHubIPs();
setInterval(updateGitHubIPs, 60 * 60 * 1000);

//! fix rate limiting
// const limiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 5,
//   message: { error: "Too many requests, please try again later." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

export async function POST(req: any) {
  //   const rateLimitResponse = limiter(req);
  //   if (rateLimitResponse) return rateLimitResponse;

  const clientIp =
    req.headers.get("x-forwarded-for") || req.socket.remoteAddress;

  if (!githubIpRanges.has(clientIp)) {
    console.warn(`Blocked request from unauthorized IP: ${clientIp}`);
    return Response.json({ error: "Unauthorized IP" }, { status: 403 });
  }

  const authHeader = req.headers.get("authorization");
  const SECRET_TOKEN = process.env.GITHUB_ACTIONS_SECRET;

  if (!authHeader || authHeader !== `Bearer ${SECRET_TOKEN}`) {
    console.warn(`Unauthorized access attempt from IP: ${clientIp}`);
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      where: { emailReminders: true },
      select: { email: true },
    });

    if (!users.length) {
      return Response.json({ message: "No users opted in for reminders." });
    }

    await Promise.all(
      users.map((user) =>
        sendEmail({
          to: user.email,
          subject: "Learn Sinhala: Keep Practicing",
          text: `5 minutes a day is all you need to get better at Sinhala. ${process.env.API_URL}`,
        })
      )
    );

    return Response.json({ message: `Emails sent to ${users.length} users.` });
  } catch (error) {
    console.error("Error sending emails:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
