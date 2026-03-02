import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Payload = {
  name: string;
  email: string;
  phone?: string;
  date?: string;
  groupSize?: string;
  message: string;
};

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

function safe(v?: string) {
  return (v || "").toString().trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    const name = safe(body.name);
    const email = safe(body.email);
    const phone = safe(body.phone);
    const date = safe(body.date);
    const groupSize = safe(body.groupSize);
    const message = safe(body.message);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // SMTP config (set in .env.local and Vercel env vars)
    const host = requiredEnv("SMTP_HOST");
    const port = Number(requiredEnv("SMTP_PORT"));
    const user = requiredEnv("SMTP_USER");
    const pass = requiredEnv("SMTP_PASS");

    const mailTo = requiredEnv("PRIVATE_HIRE_TO_EMAIL");
    const mailFrom = requiredEnv("PRIVATE_HIRE_FROM_EMAIL");

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const subject = `Private Hire Enquiry — ${name}${groupSize ? ` (Group ${groupSize})` : ""
      }`;

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : `Phone: (not provided)`,
      date ? `Preferred date: ${date}` : `Preferred date: (not provided)`,
      groupSize ? `Group size: ${groupSize}` : `Group size: (not provided)`,
      "",
      "Message:",
      message,
    ].join("\n");

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Server error." },
      { status: 500 }
    );
  }
}