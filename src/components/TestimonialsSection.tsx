const testimonials = [
  ["Destination Wholesale is my go-to supplier. Their service is fast, reliable and the product range is incredible.", "Dr A. Patel", "Aesthetic Doctor"],
  ["Excellent quality products and always delivered on time. Highly recommend!", "L. Thompson", "Clinic Owner"],
  ["The team are so helpful and knowledgeable. Nothing is ever too much trouble.", "S. Williams", "Aesthetic Nurse"],
];
export default function TestimonialsSection() { return <section className="reviews-section"><div className="container-custom"><div className="reviews-heading"><p>LOVED BY PRACTITIONERS</p><h2>Trusted by professionals</h2></div><div className="reviews-grid">{testimonials.map(([text, name, role]) => <article key={name}><div className="review-stars">★★★★★</div><p>“{text}”</p><strong>— {name}</strong><small>{role}</small></article>)}</div></div></section>; }
