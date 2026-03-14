export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="page-hero">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </section>
  );
}