import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <AppShell />
    </Suspense>
  );
}
