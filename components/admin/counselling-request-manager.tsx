"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import { updateCounsellingRequest } from "@/lib/actions/admin-counselling";
import type { CounsellingRequest, CounsellingStatus } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STATUSES: CounsellingStatus[] = ["new", "contacted", "scheduled", "completed", "cancelled"];

function statusLabel(status: CounsellingStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function CounsellingRequestManager({ requests }: { requests: CounsellingRequest[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CounsellingStatus>("all");
  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesSearch = !normalizedQuery || [request.student_name, request.phone, request.email, request.class_target, request.location]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
      return matchesSearch && (statusFilter === "all" || request.status === statusFilter);
    });
  }, [query, requests, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search name, phone, email, class or city" aria-label="Search counselling requests" />
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | CounsellingStatus)} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
        </select>
      </div>

      <p className="text-sm text-muted-foreground">{filteredRequests.length} request{filteredRequests.length === 1 ? "" : "s"}</p>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <form key={request.id} action={updateCounsellingRequest} className="rounded-2xl bg-white p-5 ring-1 ring-border">
            <input type="hidden" name="id" value={request.id} />
            <div className="flex flex-col justify-between gap-2 sm:flex-row">
              <div>
                <h2 className="font-semibold text-navy">{request.student_name}</h2>
                <p className="text-sm text-muted-foreground">Submitted {format(new Date(request.created_at), "dd MMM yyyy, h:mm a")}</p>
              </div>
              <select name="status" defaultValue={request.status} aria-label={`Status for ${request.student_name}`} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                {STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
              </select>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div><dt className="text-muted-foreground">Phone</dt><dd className="font-medium">{request.phone}</dd></div>
              <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{request.email ?? "Not provided"}</dd></div>
              <div><dt className="text-muted-foreground">Class / target</dt><dd className="font-medium">{request.class_target}</dd></div>
              <div><dt className="text-muted-foreground">Mode</dt><dd className="font-medium">{request.preferred_mode}</dd></div>
              <div><dt className="text-muted-foreground">Location</dt><dd className="font-medium">{request.location}</dd></div>
            </dl>
            <div className="mt-4 space-y-1.5">
              <Label htmlFor={`notes-${request.id}`}>Internal note</Label>
              <Textarea id={`notes-${request.id}`} name="notes" defaultValue={request.notes ?? ""} maxLength={4000} placeholder="Visible only to admins" />
            </div>
            <Button type="submit" size="sm" className="mt-4">Save changes</Button>
          </form>
        ))}
        {filteredRequests.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-sm text-muted-foreground ring-1 ring-border">No counselling requests match these filters.</div> : null}
      </div>
    </div>
  );
}
