// Renders a single JSON-LD <script> block. Use as `<JsonLd data={...}/>` from
// any server component. Multiple JsonLd blocks per page are allowed and Google
// will parse them all (Schema.org best practice).
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
