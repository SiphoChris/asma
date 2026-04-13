export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-(--line) px-4 pb-14 pt-10 text-(--sea-ink-soft)">
      <span>{year}</span>
    </footer>
  );
}
