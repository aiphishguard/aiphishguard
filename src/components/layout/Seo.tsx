import { Helmet } from "react-helmet-async";

export function Seo({ title, description }: { title: string; description?: string }) {
  const full = `${title} · AI Phish Guard`;
  return (
    <Helmet>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
