type AuthShellProps = {
  children: React.ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <main className='flex min-h-screen flex-col pb-[2.4rem]'>
      <section className='flex min-h-full flex-1 flex-col'>{children}</section>
    </main>
  );
}
