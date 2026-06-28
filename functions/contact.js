const ALLOWED_INTERESTS = new Set([
  "The Atmosphere Audit",
  "The Visual Reset",
  "Not sure yet",
  "Something else"
]);

function reply(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function clean(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emailIsValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function websiteIsValid(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.BREVO_API_KEY) {
    return reply(
      {
        success: false,
        message: "BREVO_API_KEY is unavailable in this deployment."      },
      500
    );
  }

  let body;

  try {
    body = await request.formData();
  } catch {
    return reply(
      {
        success: false,
        message: "Invalid form submission."
      },
      400
    );
  }

  // Honeypot: bots often fill this hidden field.
  if (clean(body.get("company"), 200)) {
    return reply({ success: true });
  }

  const name = clean(body.get("name"), 120);
  const email = clean(body.get("email"), 180).toLowerCase();
  const property = clean(body.get("property"), 180);
  const website = clean(body.get("website"), 500);
  const location = clean(body.get("location"), 180);
  const interest = clean(body.get("interest"), 120);
  const message = clean(body.get("message"), 2000);

  if (!name || !email || !property || !website || !interest) {
    return reply(
      {
        success: false,
        message: "Please complete the required fields."
      },
      400
    );
  }

  if (!emailIsValid(email)) {
    return reply(
      {
        success: false,
        message: "Please enter a valid email."
      },
      400
    );
  }

  if (!websiteIsValid(website)) {
    return reply(
      {
        success: false,
        message: "Please enter a valid website URL."
      },
      400
    );
  }

  if (!ALLOWED_INTERESTS.has(interest)) {
    return reply(
      {
        success: false,
        message: "Please select a valid service."
      },
      400
    );
  }

  const safe = {
    name: escapeHTML(name),
    email: escapeHTML(email),
    property: escapeHTML(property),
    website: escapeHTML(website),
    location: escapeHTML(location || "Not provided"),
    interest: escapeHTML(interest),
    message: escapeHTML(message || "No message provided").replaceAll("\n", "<br>")
  };

  const payload = {
    sender: {
      name: "EXIF Studio Website",
      email: "hello@exif.studio"
    },
    to: [
      {
        name: "EXIF Studio",
        email: "hello@exif.studio"
      }
    ],
    replyTo: {
      name,
      email
    },
    subject: `EXIF inquiry Â· ${property} Â· ${interest}`,
    htmlContent: `
      <html>
        <body style="margin:0;padding:32px;background:#f2e8dc;color:#132925;font-family:Arial,sans-serif">
          <div style="max-width:680px;margin:auto;background:#fff;padding:36px">
            <p>NEW WEBSITE INQUIRY</p>
            <h1>${safe.property}</h1>
            <p><b>Name:</b> ${safe.name}</p>
            <p><b>Email:</b> ${safe.email}</p>
            <p><b>Website:</b> <a href="${safe.website}">${safe.website}</a></p>
            <p><b>Location:</b> ${safe.location}</p>
            <p><b>Interest:</b> ${safe.interest}</p>
            <hr>
            <p>${safe.message}</p>
          </div>
        </body>
      </html>
    `,
    textContent: [
      "New EXIF website inquiry",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Property: ${property}`,
      `Website: ${website}`,
      `Location: ${location || "Not provided"}`,
      `Interest: ${interest}`,
      "",
      "Message:",
      message || "No message provided"
    ].join("\n")
  };

  const sent = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.BREVO_API_KEY,
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!sent.ok) {
    console.error("Brevo send failed", sent.status, await sent.text());

    return reply(
      {
        success: false,
        message: "The message could not be sent."
      },
      502
    );
  }

  return reply({
    success: true,
    message: "Thank you. Weâll review the property before we reply."
  });
}

export function onRequestGet() {
  return reply(
    {
      success: false,
      message: "Method not allowed."
    },
    405
  );
}
