import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Table from "@/components/Table";
import TablePlaceholder from "@/components/table-placeholder";
import "./page.css";

export const runtime = "edge";
export const preferredRegion = "home";
export const dynamic = "force-dynamic"; // turn off caching for this page

export default function Home() {
  return (
    <main>
      <Suspense fallback={<TablePlaceholder />}>
        <Table />
      </Suspense>

      <Link
        href="https://github.com/DustinX/ichigo-test"
        className="link"
        target="_blank"
      >
        <Image
          src="/github.svg"
          alt="GitHub Logo"
          width={24}
          height={24}
          priority
        />
      </Link>
    </main>
  );
}
