export function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{"// "}{children}</p>;
}
