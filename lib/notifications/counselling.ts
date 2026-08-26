type CounsellingNotification = {
  studentName: string;
  email: string;
  phone: string;
  classTarget: string;
  preferredMode: string;
  location: string;
};

type DeliveryResult = { studentConfirmationSent: boolean };

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.COUNSELLING_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  return response.ok;
}

async function sendWhatsAppConfirmation(request: CounsellingNotification) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!accountSid || !authToken || !from) return false;

  const body = new URLSearchParams({
    From: from,
    To: `whatsapp:+91${request.phone}`,
    Body: `Hi ${request.studentName}, we have received your counselling request. Our team will contact you shortly.`,
  });
  const authorization = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  return response.ok;
}

export async function notifyCounsellingRequest(
  request: CounsellingNotification
): Promise<DeliveryResult> {
  const safeName = escapeHtml(request.studentName);
  const safeClassTarget = escapeHtml(request.classTarget);
  const safeMode = escapeHtml(request.preferredMode);
  const safeLocation = escapeHtml(request.location);
  const adminEmail = process.env.COUNSELLING_ADMIN_EMAIL;

  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New counselling request from ${request.studentName}`,
      html: `<h2>New counselling request</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Phone:</strong> ${request.phone}</p><p><strong>Email:</strong> ${escapeHtml(request.email)}</p><p><strong>Class / target:</strong> ${safeClassTarget}</p><p><strong>Preferred mode:</strong> ${safeMode}</p><p><strong>Location:</strong> ${safeLocation}</p>`,
    });
  }

  const whatsappSent = await sendWhatsAppConfirmation(request);
  if (whatsappSent) return { studentConfirmationSent: true };

  const emailSent = await sendEmail({
    to: request.email,
    subject: "We received your counselling request",
    html: `<p>Hi ${safeName},</p><p>We have received your counselling request. Our academic counsellors will contact you shortly.</p><p>Thank you,<br />PrepXpert</p>`,
  });
  return { studentConfirmationSent: emailSent };
}
