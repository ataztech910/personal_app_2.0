import Link from "next/link";
import { redirect } from "next/navigation";
import Sectiontitle from "@/app/components/Sectiontitle";

type VerifyPageProps = {
  searchParams: Promise<{
    session_id?: string;
    error?: string;
  }>;
};

function formatError(error: string): string {
  return error.replaceAll("_", " ");
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const error = params.error;

  if (sessionId && !error) {
    redirect(`/api/auth/google/start?session_id=${encodeURIComponent(sessionId)}`);
  }

  return (
    <div className="mi-advncd-area mi-section mi-padding-top mi-padding-bottom">
      <div className="container">
        <Sectiontitle title="CLI Login Verification" />
        <div className="mi-advncd-main">
          {!sessionId ? (
            <div className="mi-advncd-prose">
              <p>Missing session_id. Please run `advncd login` again.</p>
            </div>
          ) : (
            <div className="mi-advncd-prose">
              <p>
                Continue with Google to approve this CLI session. After approval, return to the
                terminal and wait for login completion.
              </p>
              {error ? <p>Last error: {formatError(error)}</p> : null}
              <div className="mt-30">
                <Link
                  href={`/api/auth/google/start?session_id=${encodeURIComponent(sessionId)}`}
                  className="mi-button"
                >
                  Continue with Google
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
