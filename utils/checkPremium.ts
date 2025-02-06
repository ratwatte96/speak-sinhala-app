import prisma from "@/lib/prisma";

export async function updatePremiumStatus(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return false;

  // If premium has expired, update it
  if (user.premiumEndDate && user.premiumEndDate < new Date()) {
    await prisma.user.update({
      where: { id: userId },
      data: { isPremium: false, premiumEndDate: null },
    });
    return false;
  }

  return user.isPremium;
}
