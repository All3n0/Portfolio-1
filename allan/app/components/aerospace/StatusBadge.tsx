import type { ProjectStatus } from "@/lib/content";

const LABEL: Record<ProjectStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  complete: "Complete",
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const style =
    status === "complete"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
      : status === "in-progress"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
        : "bg-surface-2 text-muted border-line";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${style}`}>
      <span
        aria-hidden
        className={`w-1.5 h-1.5 rounded-full ${status === "complete" ? "bg-emerald-500" : status === "in-progress" ? "bg-amber-500 animate-pulse" : "bg-faint"}`}
      />
      {LABEL[status]}
    </span>
  );
}
