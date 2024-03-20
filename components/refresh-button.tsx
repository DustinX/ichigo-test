"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { revalidatePath } from "next/cache";

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        revalidatePath(`https://ichigo-test.vercel.app/`);
        startTransition(() => {
          router.refresh();
        });
      }}
    >
      {isPending ? "Refreshing..." : "Refresh"}
    </button>
  );
}
