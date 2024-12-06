import type { EmailConfig } from "@auth/core/providers/email";
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import { Theme } from "@auth/core/types";
import { convexAuth } from "@convex-dev/auth/server";

async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  expires: Date;
  provider: EmailConfig;
  token: string;
  theme: Theme;
  request: Request;
}) {
  const { identifier: email, url, provider } = params;

  if (!provider.from) {
    throw new Error("From address not provided");
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: provider.from,
      to: email,
      subject: "Seu link para o Dev na Gringa",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu link para o Dev na Gringa</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .content {
      background-color: #f8fafc;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
      border: 1px solid #e2e8f0;
    }
    .button {
      display: inline-block;
      background-color: #2dd4bf;
      color: #0f172a;
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      margin: 24px 0;
      text-align: center;
    }
    .footer {
      color: #64748b;
      font-size: 14px;
      text-align: center;
    }
    h1 {
      color: #0f172a;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h1>Olá! 👋</h1>
      <p>Clique no botão abaixo para entrar no Dev na Gringa. Este link é válido apenas por 24 horas e pode ser usado apenas uma vez.</p>

      <a href="${url}" class="button">
        Entrar no Dev na Gringa →
      </a>

      <p>Se você não solicitou este email, pode ignorá-lo com segurança.</p>
    </div>

    <div class="footer">
      <p>Dev na Gringa • oi@nagringa.dev</p>
    </div>
  </div>
</body>
</html>`,
      text: `Olá!

Clique no link abaixo para entrar no Dev na Gringa. Este link é válido apenas por 24 horas e pode ser usado apenas uma vez.

${url}

Se você não solicitou este email, pode ignorá-lo com segurança.

Dev na Gringa • oi@nagringa.dev`,
    }),
  });
}

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Resend({
      from: "Dev na Gringa <oi@nagringa.dev>",
      sendVerificationRequest,
    }),
    Google,
  ],
});
