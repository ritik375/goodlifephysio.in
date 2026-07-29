// Reusable section header: eyebrow label + display heading + optional
// supporting copy. The eyebrow always states something concrete about the
// section's content, never a decorative "01 / 02" marker.
const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => (
  <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
    {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
    <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">{title}</h2>
    {description && <p className="mt-4 text-slate leading-relaxed">{description}</p>}
  </div>
);

export default SectionHeading;
