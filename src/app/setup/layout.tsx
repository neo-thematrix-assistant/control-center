// Setup pages bypass the main sidebar/header layout
export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
