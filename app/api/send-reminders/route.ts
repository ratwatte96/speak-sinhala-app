import prisma from "@/lib/prisma";
import { sendEmail } from "@/utils/email";
import { errorWithFile } from "@/utils/logger";
import { getQuizCompletionPercentage } from "@/utils/random";
import { NextResponse } from "next/server";
import rateLimit from "express-rate-limit";

//! fix ip allow listing
// const GITHUB_META_URL = "https://api.github.com/meta";
// let githubIpRanges = new Set();

// async function updateGitHubIPs() {
//   try {
//     console.log("Fetching latest GitHub IPs...");
//     const res = await fetch(GITHUB_META_URL);
//     const data = await res.json();

//     if (data.actions) {
//       githubIpRanges = new Set(data.actions);
//       console.log("Updated GitHub IPs:", Array.from(githubIpRanges));
//     } else {
//       console.warn("GitHub API returned no action IPs, keeping old IP list.");
//     }
//   } catch (error) {
//     console.error("Failed to update GitHub IPs:", error);
//   }
// }

// // Run once at startup and then every hour
// updateGitHubIPs();
// setInterval(updateGitHubIPs, 60 * 60 * 1000);

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

  //   const clientIp =
  //     req.headers.get("x-forwarded-for") || req.socket.remoteAddress;

  //   if (!githubIpRanges.has(clientIp)) {
  //     console.warn(`Blocked request from unauthorized IP: ${clientIp}`);
  //     return Response.json({ error: "Unauthorized IP" }, { status: 403 });
  //   }

  //   const authHeader = req.headers.get("authorization");
  //   const SECRET_TOKEN = process.env.GITHUB_ACTIONS_SECRET;

  //   if (!authHeader || authHeader !== `Bearer ${SECRET_TOKEN}`) {
  //     console.warn(`Unauthorized access attempt from IP: ${clientIp}`);
  //     return Response.json({ error: "Unauthorized" }, { status: 401 });
  //   }

  try {
    const users = await prisma.user.findMany({
      where: { emailReminders: true },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!users.length) {
      return NextResponse.json({ message: "No users opted in for reminders." });
    }

    await Promise.all(
      users.map(async (user) => {
        const readPercentage = Math.floor(
          await getQuizCompletionPercentage(user.id)
        );

        const emailText = `
Hello ${user.username}!

🎯 Daily Sinhala Learning Reminder

Your Progress:
📚 Reading Progress: ${readPercentage}%
🗣️ Speaking Progress: Coming Soon!

Remember: Just 5 minutes of practice each day can make a big difference in learning Sinhala.

Ready to continue your learning journey?
➡️ Click here to start today's lesson: ${process.env.API_URL}

Keep up the great work!

Best regards,
Learn Sinhala Team
`;

        return sendEmail({
          to: user.email,
          subject: "Learn Sinhala: Time for Your Daily Practice! 🇱🇰",
          text: emailText,
        });
      })
    );

    return NextResponse.json({
      message: `Emails sent to ${users.length} users.`,
    });
  } catch (error) {
    errorWithFile(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
