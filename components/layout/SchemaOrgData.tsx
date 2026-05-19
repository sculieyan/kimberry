export function SchemaOrgData() {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Kimberry",
      "url": "https://www.kimberry.co.nz",
      "logo": "https://www.kimberry.co.nz/logo.png",
      "description": "Premium dairy products from New Zealand",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "11/85 Onehunga Mall, Onehunga",
        "addressLocality": "Auckland 1061",
        "addressCountry": "New Zealand"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+64 9974 9488",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://www.facebook.com/kimberry",
        "https://twitter.com/kimberry"
      ]
    }
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    )
  }