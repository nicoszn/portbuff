export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-950 px-5 py-10 sm:px-8">
      {children}
    </div>
  );
}
