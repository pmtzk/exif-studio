/* Reviewed public configuration only. Never put credentials here.
   A verified provider URL enables direct scheduling in place of the inquiry form.
   See docs/WEBSITE-V2-INTEGRATIONS.md for provider and consent requirements. */
window.EXIF_CONFIG = Object.freeze({
  schedulingUrl: null,
  // Optional approved analytics adapter: function(event) { ... }.
  // Called only after exifMeasurement.setConsent(true); no provider by default.
  measure: null
});
