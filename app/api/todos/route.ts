import prisma from "../../../lib/prisma";

export async function GET(req: any) {
  const users = await prisma.todo.findMany();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: any) {
  const { description, done } = await req.json();
  const newUser = await prisma.todo.create({
    data: { description, done },
  });
  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
