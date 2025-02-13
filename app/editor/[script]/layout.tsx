export default function layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return <div className="h-dvh">{children}</div>;
}
