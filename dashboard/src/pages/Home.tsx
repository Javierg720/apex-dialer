import { PhoneCall, Radio, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <section className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-apex-500">welcome</p>
        <h2 className="text-4xl font-semibold tracking-tight">Operator dashboard</h2>
        <p className="max-w-2xl text-slate-400">
          This is the Phase 0 shell. The real UI — live call queue, agent consoles, campaign
          console, compliance dashboards — lands here during the EXODUS migration.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          icon={<PhoneCall className="h-5 w-5" />}
          title="Predictive dialer"
          body="Campaign management, pacing algorithms, outbound queues."
        />
        <Card
          icon={<Radio className="h-5 w-5" />}
          title="Live audio"
          body="Real-time transcription, barge-in, whisper coaching."
        />
        <Card
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Compliance"
          body="TCPA guardrails, DNC sync, recording retention."
        />
      </div>
    </section>
  );
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  body: string;
}

function Card({ icon, title, body }: CardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur transition hover:border-apex-500/60 hover:bg-slate-900/60">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-apex-500/10 text-apex-500">
        {icon}
      </div>
      <h3 className="text-base font-medium text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{body}</p>
    </article>
  );
}
