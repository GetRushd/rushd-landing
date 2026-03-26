import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let email;
  try {
    ({ email } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  // Validate email at the boundary
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email address' }) };
  }

  try {
    // Add to Resend Audience (requires RESEND_AUDIENCE_ID env var in Netlify dashboard)
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
    }

    // Send branded confirmation email to the subscriber
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "You're on the Inabah waitlist",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#F6FBF1;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6FBF1;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td style="padding-bottom:40px;">
              <span style="font-size:22px;font-weight:800;color:#061B0E;letter-spacing:-0.04em;">Inabah</span>
              <span style="font-size:18px;font-weight:300;color:#061B0E;opacity:0.3;margin-left:8px;">إنابة</span>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background-color:#061B0E;border-radius:28px;padding:48px 40px;">
              <p style="margin:0 0 16px;font-size:13px;font-weight:800;letter-spacing:0.15em;text-transform:uppercase;color:#C9E8BF;">You're on the list</p>
              <h1 style="margin:0 0 20px;font-size:36px;font-weight:800;line-height:1.1;color:#ffffff;letter-spacing:-0.03em;">
                Prayer comes first.<br />
                <span style="color:#C9E8BF;font-style:italic;font-weight:300;">Always.</span>
              </h1>
              <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.5);">
                Thank you for joining the Inabah waitlist. We're building something intentional — a tool that helps you anchor your day in Salah, not squeeze it in. We'll reach out before launch with early access.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="height:32px;"></td></tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#F0F5EB;border-radius:20px;padding:32px 40px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#23674A;opacity:0.6;">What to expect</p>
              <ul style="margin:16px 0 0;padding:0;list-style:none;">
                <li style="padding:12px 0;border-bottom:1px solid rgba(6,27,14,0.06);font-size:14px;color:#061B0E;">
                  <span style="color:#23674A;font-weight:700;margin-right:8px;">→</span> Early access before public launch
                </li>
                <li style="padding:12px 0;border-bottom:1px solid rgba(6,27,14,0.06);font-size:14px;color:#061B0E;">
                  <span style="color:#23674A;font-weight:700;margin-right:8px;">→</span> Calendar integration for all five prayers
                </li>
                <li style="padding:12px 0;font-size:14px;color:#061B0E;">
                  <span style="color:#23674A;font-weight:700;margin-right:8px;">→</span> Conflict detection — no more overlapping meetings
                </li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;text-align:center;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#061B0E;opacity:0.25;">
                © 2026 Inabah · joinInabah.app
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('Resend error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to subscribe. Please try again.' }),
    };
  }
};
