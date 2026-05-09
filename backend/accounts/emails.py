"""Transactional email bodies for accounts (HTML uses inline CSS for client support)."""

from html import escape


def activation_email_plain(activation_url: str) -> str:
    return (
        "Welcome to ShopSphere\n\n"
        "Activate your account to start shopping:\n"
        f"{activation_url}\n\n"
        "If you did not register, you can ignore this email."
    )


def activation_email_html(activation_url: str, username: str) -> str:
    safe_url = escape(activation_url, quote=True)
    safe_name = escape(username or "there")

    # Inline styles only — external CSS is stripped by most mail clients.
    return f"""\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activate your account</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f172a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#1e293b" style="max-width:560px;background-color:#1e293b;background:linear-gradient(180deg,#1e293b 0%,#0f172a 100%);border-radius:20px;overflow:hidden;border:1px solid rgba(99,102,241,0.25);box-shadow:0 24px 48px rgba(0,0,0,0.35);">
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;background:rgba(99,102,241,0.12);border-bottom:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0;font-size:26px;font-weight:800;color:#f8fafc;letter-spacing:-0.02em;">
                <span style="color:#818cf8;">✧</span> Shop<span style="color:#818cf8;">Sphere</span>
              </p>
              <p style="margin:12px 0 0;font-size:13px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;">Curated commerce</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 28px;">
              <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#f1f5f9;">Hi {safe_name},</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#cbd5e1;">
                Thanks for joining ShopSphere. Confirm your email to unlock your account and explore the catalog.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center" style="border-radius:14px;background-color:#6366f1;">
                    <a id="activate_account" href="{safe_url}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:14px;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
                      Activate account
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#64748b;">
                Or paste this link into your browser:
              </p>
              <p style="margin:0 0 24px;font-size:12px;word-break:break-all;line-height:1.5;color:#818cf8;">
                {safe_url}
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#64748b;">
                If you didn&rsquo;t create an account, you can safely ignore this message.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:11px;color:#475569;">&copy; ShopSphere · Premium shopping experience</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
