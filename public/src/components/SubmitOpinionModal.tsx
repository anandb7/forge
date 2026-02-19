import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category, Priority, Opinion } from "./OpinionCard";

const avatarColors = [
  "#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#14b8a6", "#f97316", "#ec4899", "#06b6d4",
];

interface SubmitOpinionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (opinion: Opinion) => void;
}

export function SubmitOpinionModal({ open, onClose, onSubmit }: SubmitOpinionModalProps) {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!author.trim() || author.trim().length < 2) newErrors.author = "Name must be at least 2 characters";
    if (!title.trim() || title.trim().length < 5) newErrors.title = "Title must be at least 5 characters";
    if (!body.trim() || body.trim().length < 10) newErrors.body = "Opinion must be at least 10 characters";
    if (!category) newErrors.category = "Please select a category";
    if (!priority) newErrors.priority = "Please select a priority";
    return newErrors;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    onSubmit({
      id: crypto.randomUUID(),
      author: author.trim(),
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      category: category as Category,
      priority: priority as Priority,
      status: "Open",
      title: title.trim(),
      body: body.trim(),
      upvotes: 0,
      downvotes: 0,
      timestamp: formatted,
    });

    setAuthor("");
    setTitle("");
    setBody("");
    setCategory("");
    setPriority("");
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Share Your Opinion</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="author">Your Name</Label>
            <Input
              id="author"
              placeholder="e.g. Sarah Chen"
              value={author}
              onChange={(e) => { setAuthor(e.target.value); setErrors(p => ({ ...p, author: "" })); }}
              maxLength={80}
            />
            {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v as Category); setErrors(p => ({ ...p, category: "" })); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Features">Features</SelectItem>
                  <SelectItem value="Tech Stack">Tech Stack</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Process">Process</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => { setPriority(v as Priority); setErrors(p => ({ ...p, priority: "" })); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-xs text-destructive">{errors.priority}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief summary of your opinion"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
              maxLength={120}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="body">Your Opinion</Label>
            <Textarea
              id="body"
              placeholder="Describe your idea, concern, or suggestion in detail..."
              value={body}
              onChange={(e) => { setBody(e.target.value); setErrors(p => ({ ...p, body: "" })); }}
              rows={4}
              maxLength={1000}
              className="resize-none"
            />
            <div className="flex justify-between">
              {errors.body ? <p className="text-xs text-destructive">{errors.body}</p> : <span />}
              <span className="text-xs text-muted-foreground">{body.length}/1000</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} className="flex-1">Submit Opinion</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
