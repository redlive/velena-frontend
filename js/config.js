/* ==========================================================================
   SITE CONFIG — the one place to change contact details and links.
   Edit values below and save; every page reads them on load (js/main.js).
   The HTML already contains the same values, so the site also works with
   JavaScript off. If you change the phone/email/address here, it updates
   everywhere on the live site automatically.
   ========================================================================== */
window.SITE_CONFIG = {
  // Public address of the site, WITH trailing slash (canonical / social previews).
  siteUrl: "https://velena.ca/",

  businessName: "Velena Hairstyling House",
  email: "velenahouse@gmail.com",
  phoneDisplay: "(604) 765-7671",
  phoneTel: "+16047657671",
  addressLines: ["749 Marchmont Rd", "Duncan, BC V9L 2L9"],
  hoursText: "Monday to Sunday — by appointment only",

  // Google Maps (no API key needed). Coordinates of 749 Marchmont Rd, Duncan
  // (a text address with the postal code sent Google to the wrong place).
  mapEmbedUrl: "https://maps.google.com/maps?q=48.7770859,-123.6929722&z=16&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=48.7770859,-123.6929722",
  mapViewUrl: "https://www.google.com/maps/search/?api=1&query=48.7770859,-123.6929722",

  // Other social links. "" = hidden.
  social: { facebook: "" },

  /* ------------------------------------------------------------------------
     INSTAGRAM (Gallery page + footer link)
     handle:   Instagram username WITHOUT "@" (https://www.instagram.com/velenahouse/).
     widget:   which source shows the latest posts on gallery.html
               "behold"     -> RECOMMENDED. Free behold.so feed (latest 6 posts,
                               updates daily). Paste the Feed ID into feedId.
                               Posts are drawn in the site's own style.
               "snapwidget" -> free snapwidget.com widget (unlimited views,
                               updates every 15 min). Paste the number from
                               the embed code (snapwidget.com/embed/123456).
               "posts"      -> no service: shows Instagram's official embed
                               for each link in postUrls (update by hand).
               ""           -> only the "See our work on Instagram" block.
     If the chosen source is empty or fails, a "See our work on Instagram"
     block with a follow link is shown (no photos).
     ------------------------------------------------------------------------ */
  instagram: {
    handle: "velenahouse",
    widget: "behold",
    feedId: "",            // behold.so Feed ID, e.g. "AbCdEf123456"
    snapwidgetId: "",      // e.g. "1234567"
    postUrls: [            // used when widget = "posts"
      // "https://www.instagram.com/p/XXXXXXXXXXX/",
    ]
  },

  /* ------------------------------------------------------------------------
     FORMS (Contact page form + footer newsletter) — sent in-page, no server.
     provider: "formsubmit" -> free FormSubmit.co, no account. Messages go to
                               `recipient`. The FIRST real message triggers an
                               activation email from FormSubmit to that address:
                               open it and click "Activate Form" once.
               "formspree"  -> free Formspree.io form: set endpoint to
                               "https://formspree.io/f/XXXXXXX".
     endpoint: optional full URL; a formspree.io URL switches to Formspree.
     If sending fails, the visitor's email app opens with the message ready.
     ------------------------------------------------------------------------ */
  contactForm: {
    provider: "formsubmit",
    recipient: "velenahouse@gmail.com",
    endpoint: "",
    subject: "New message from Velena website",
    newsletterSubject: "New newsletter sign-up from velena.ca"
  }
};
