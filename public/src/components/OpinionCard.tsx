import { useState } from "react";
import { ThumbsUp, ThumbsDown, ChevronUp, ChevronDown, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Category = "Features" | "Tech Stack" | "Design" | "Process";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Status = "Open" | "Approved" | "Rejected" | "In Review";

export interface Opinion {
  id: string;
  author: string;
  avatarColor: string;
  category: Category;
  priority: Priority;
  status: Status;
  title: string;
  body: string;
  upvotes: number;
  downvotes: number;
  timestamp: string;
}

const categoryColors: Record<Category, string> = {
  Features: "bg-blue-100 text-blue-700 border-blue-200",
  "Tech Stack": "bg-purple-100 text-purple-700 border-purple-200",
  Design: "bg-pink-100 text-pink-700 border-pink-200",
  Process: "bg-amber-100 text-amber-700 border-amber-200",
};

const priorityColors: Record<Priority, string> = {
  Low: "bg-slate-100 text-slate-600 border-slate-200",
  Medium: "bg-sky-100 text-sky-700 border-sky-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Critical: "bg-red-100 text-red-700 border-red-200",
};

const statusStyles: Record<Status, string> = {
  Open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Approved: "bg-blue-50 text-blue-700 border-blue-200",
  Rejected: "bg-red-50 text-red-600 border-red-200",
  "In Review": "bg-amber-50 text-amber-700 border-amber-200",
};

interface OpinionCardProps {
  opinion: Opinion;
  onVote: (id: string, type: "up" | "down") => void;
}

export function OpinionCard({ opinion, onVote }: OpinionCardProps) {
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      setUserVote(null);
      onVote(opinion.id, type === "up" ? "down" : "up"); // reverse
    } else {
      if (userVote) {
        onVote(opinion.id, userVote === "up" ? "down" : "up"); // undo old
      }
      setUserVote(type);
      onVote(opinion.id, type);
    }
  };

  const score = opinion.upvotes - opinion.downvotes;

  return (
    <div className="bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 p-5 flex gap-4">
      {/* Vote column */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <button
          onClick={() => handleVote("up")}
          className={cn(
            "p-1.5 rounded-lg transition-all duration-150 hover:bg-primary/10",
            userVote === "up" && "bg-primary/15 text-primary"
          )}
        >
          <ChevronUp className={cn("h-5 w-5 text-muted-foreground", userVote === "up" && "text-primary")} />
        </button>
        <span
          className={cn(
            "text-sm font-bold tabular-nums",
            score > 0 && "text-emerald-600",
            score < 0 && "text-red-500",
            score === 0 && "text-muted-foreground"
          )}
        >
          {score > 0 ? `+${score}` : score}
        </span>
        <button
          onClick={() => handleVote("down")}
          className={cn(
            "p-1.5 rounded-lg transition-all duration-150 hover:bg-destructive/10",
            userVote === "down" && "bg-destructive/15 text-destructive"
          )}
        >
          <ChevronDown className={cn("h-5 w-5 text-muted-foreground", userVote === "down" && "text-destructive")} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", categoryColors[opinion.category])}>
            {opinion.category}
          </span>
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", priorityColors[opinion.priority])}>
            {opinion.priority}
          </span>
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border ml-auto", statusStyles[opinion.status])}>
            {opinion.status}
          </span>
        </div>

        <h3 className="font-semibold text-foreground text-base leading-snug mb-1">{opinion.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">{opinion.body}</p>

        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: opinion.avatarColor }}
          >
            {opinion.author[0].toUpperCase()}
          </div>
          <span className="text-xs font-medium text-foreground">{opinion.author}</span>
          <span className="text-xs text-muted-foreground ml-auto">{opinion.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
