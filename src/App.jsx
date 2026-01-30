const sections = [
  {
    title: 'Mission',
    body: 'A lightweight landing page ready for future melodies and features.'
  },
  {
    title: 'Features',
    body: 'Placeholder cards for streaming, playlists, and community highlights.'
  },
  {
    title: 'Roadmap',
    body: 'Upcoming releases, collaborations, and interactive listening rooms.'
  }
];

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <nav className="nav">
          <span className="logo">Musical Palm Tree</span>
          <button className="cta">Notify Me</button>
        </nav>
        <div className="hero-content">
          <p className="eyebrow">Landing page starter</p>
          <h1>Grow a soundtrack for every moment.</h1>
          <p className="subtitle">
            A minimal static frontend ready for GitHub Pages deployment, with
            room to expand into a full music experience.
          </p>
          <div className="actions">
            <button className="primary">Get Started</button>
            <button className="ghost">View Demo</button>
          </div>
        </div>
      </header>

      <main className="sections">
        {sections.map((section) => (
          <section key={section.title} className="card">
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </main>

      <footer className="footer">
        <p>© 2024 Musical Palm Tree. All rhythms reserved.</p>
      </footer>
    </div>
  );
}
