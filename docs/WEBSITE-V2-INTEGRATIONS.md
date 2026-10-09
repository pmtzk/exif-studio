# V2 integrations and publication requirements

## Scheduling

No verified booking URL or calendar integration exists in the inspected repository. `assets/js/site-config.js` is the single configuration point. `schedulingUrl: null` means the inquiry page uses the existing Formspree destination, asks the five qualification questions plus optional additional context, and confirms receipt only after an HTTP success. It says EXIF will follow up with available times. It never claims a booking. An email route and the original Dear EXIF letter remain available.

To enable direct scheduling, enter a verified HTTPS provider URL without credentials in `EXIF_CONFIG.schedulingUrl`. Validate it with the connected account before publication. The inquiry runtime then replaces the fallback form with a provider link and truthful provider copy; qualification must be configured at the provider so visitors do not answer twice. Do not configure the provider account or automations without credentials and approval.

Intended provider setup:

- Event: EXIF — Discovery Call; 30 minutes; video call.
- Time-zone-aware selection using real connected calendar availability.
- About 4–6 weekly slots initially; adjustable by the founder.
- 24-hour minimum notice; 14-day horizon; 15-minute buffer.
- Provider-confirmed booking, calendar invitation and reminders.
- Valid cancellation and rescheduling links from the provider.
- Required: name, email, property name or website, relationship to property, reason for contacting EXIF. Optional: additional context. Use the inquiry page's bilingual options as a starting point.

A click is not a booking. `scheduling_complete` is reserved and cannot be emitted by the public browser measurement API. Implement a verified provider webhook/server integration with replay protection before counting confirmed bookings. No such integration or credential is supplied in V2.

The conversation establishes fit and a next step: a paid Representation Assessment where investigation is needed, a directly scoped project where the need is defined, or no appropriate engagement. No universal Assessment price or mandatory package is published. A full owner questionnaire follows proposal, acceptance and initial payment; it does not belong in the free inquiry flow.

## Measurement and privacy

No analytics provider, ID or credentials were found. `assets/js/measurement.js` provides local `exif:measure` CustomEvents and `window.exifMeasurement`. It sends **no network requests** and does not invent a measurement destination. Integrators must apply their privacy/consent policy before attaching a provider. The optional adapter in site-config is called only after `exifMeasurement.setConsent(true)`; denied consent means no adapter calls. This interface is for an approved future integration, not a consent banner or a claim of legal compliance.

Events: `primary_cta_click`, `inquiry_page_view`, `letter_form_start`, `letter_form_success`, `inquiry_form_start`, `inquiry_form_success`, `scheduling_link_click`, `expertise_navigation`, `approach_navigation`. Form success requires an accepted response, not a click. No scheduling completion is implemented. Event details contain only enumerated page, placement and source categories. Names, email addresses, property URLs, messages, query strings and raw referrers are excluded; unknown fields are discarded. No persistent event queue or visitor ID is created.

Recognized attribution categories: outreach, organic search, referral, social, direct, editorial. Known UTM source/medium values map to these categories; unknown free text is dropped. Source category can follow internal links in an allowlisted `exif_source` query parameter; no raw campaign strings or form contents propagate. Provider adapters must never append personal form contents to event payloads. Counts are local until a real analytics integration is approved and connected.

## CRM boundary

The website records inquiry receipt or a verified booking integration in the future. A CRM must separately connect a lead to its source category, Discovery Call outcome, qualified opportunity, scoped proposal, project acceptance, deposit receipt, delivery and actual project margin. Names/contact details belong in the secured CRM/Formspree workflow, never analytics events. Use a consent-aware lead ID in the CRM rather than email as an analytics identifier. No CRM, payment system, fee, webhook or financial result is fabricated here.

Commercial funnel: relevant visitor → inquiry/booking started → inquiry accepted/provider-confirmed booking → call completed → qualified opportunity → proposal sent → project accepted → deposit received → delivered → actual margin. Only the first three stages have website integration points; later stages require operational records.

## Content and publication review

- The original gallery remains, labeled as selected hospitality photography from previous professional experience. Every original asset is retained. Employment copyright/ownership, licensing, recognizable-person releases and publication permission have not been established from repository evidence. Review these before new case studies/promotional placements or production approval.
- No former employer/property is named publicly, no EXIF commission implied, and no business results/testimonials invented. In Practice uses EXIF's own website as a verifiable design example and adds no new photo placement.
- Professional background copy follows the supplied brief: hospitality sales, photography, operations and management in Mexico and the Caribbean. It describes previous experience, not commissioned EXIF projects.
- Work, Field Notes and Assessment have no placeholder pages or published navigation destinations. Future content must distinguish professional experience, original creative work, independent research and commissioned EXIF projects.
- Existing font fallbacks remain; The Seasons is not downloaded or newly licensed. Google Fonts and self-hosted identity assets retain their existing configuration.
- Formspree account delivery, anti-abuse/account settings and inbox receipt need an approved intentional test. Automated tests mock its responses and send no letters.
- Cloudflare clean routes use `_redirects`; the local Python server does not natively implement those rules. Browser test harness resolves them locally. Confirm branch-preview routing before promoting production.
- Development-branch preview and screenshot delivery are authorized for review. No production deployment/settings change, main merge, calendar-account change, purchase or publication of unapproved work is authorized. Preview access blockers are recorded in the [review report](WEBSITE-V2-REVIEW.md).

Paid diagnostic sequence: Discovery Call → scope and price proposal → client acceptance → initial payment → detailed owner questionnaire → required data/materials → research and assessment → findings/recommendations → client decision about further work. This is an intended operational sequence; no payment or engagement is represented as having occurred.
