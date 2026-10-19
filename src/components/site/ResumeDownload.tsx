"use client";
import { useState } from "react";

export function ResumeDownload() {
  const [busy, setBusy] = useState(false);
  const download = async () => {
    setBusy(true);
    try {
      const { downloadResumePdf } = await import("./resume-pdf");
      await downloadResumePdf();
    } finally {
      setBusy(false);
    }
  };
  return (
    <button onClick={download} disabled={busy} className="rounded-md bg-primary px-4 py-2 font-mono text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60">
      {busy ? "generating…" : "↓ Download PDF"}
    </button>
  );
}
