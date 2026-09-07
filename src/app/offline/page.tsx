export const metadata = { title: "Offline — For Vishuu" };

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#150c22] px-6 text-center text-[#f3e6ef]">
      <p className="font-serif text-2xl">♡</p>
      <h1 className="max-w-xs text-balance font-serif text-xl">
        You&rsquo;re offline.
        <br />
        The little room is still here.
      </h1>
      <p className="max-w-xs text-balance text-sm text-[#f3e6ef]/70">
        Music will return when you&rsquo;re connected again.
      </p>
    </main>
  );
}
