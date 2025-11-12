export default function Head() {
  return (
    <>
      <title>
        Sangue Solidário | Conectando vidas por meio da solidariedade
      </title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* Favicons */}
      <link
        rel="icon"
        type="image/png"
        href="/assets/images/icons/favicon-96x96.png"
        sizes="96x96"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        href="/assets/images/icons/favicon.svg"
      />
      <link rel="shortcut icon" href="/assets/images/icons/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/assets/images/icons/apple-touch-icon.png"
      />
      <meta name="apple-mobile-web-app-title" content="SangueSolidário" />
      <link rel="manifest" href="/assets/images/icons/site.webmanifest" />
      {/* CSS */}
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css"
      />
      <link rel="stylesheet" href="/assets/css/custom.css" />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      />
      <link rel="stylesheet" href="/assets/css/blog.css" />
    </>
  );
}
