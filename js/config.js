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
  hoursText: "Monday – Saturday, 9:00 – 5:00 · Sunday closed",

  // Google Maps (no API key needed)
  mapEmbedUrl: "https://maps.google.com/maps?q=749+Marchmont+Rd,+Duncan,+BC+V9L+2L9&z=14&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=749+Marchmont+Rd+Duncan+BC+V9L+2L9",

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

  // Form back-ends. "" = open the visitor's email app (mailto:) addressed to
  // `email`. Any service accepting a normal HTML form POST works
  // (Formspree, Basin, Getform…), e.g. "https://formspree.io/f/XXXXXXX".
  contactFormEndpoint: "",
  newsletterEndpoint: ""
};
