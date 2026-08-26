"use client";

import { useActionState } from "react";
import { submitCounselling, type ActionState } from "@/lib/actions/counselling";
import { CLASS_TARGETS, MODES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2Icon } from "lucide-react";

const initial: ActionState = { ok: false, message: "" };

export function CounsellingForm({
  courseId,
  requestType = "counselling",
  submitLabel = "Check Availability",
}: {
  courseId?: string;
  requestType?: "counselling" | "demo";
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState(submitCounselling, initial);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="request_type" value={requestType} />
      {courseId ? <input type="hidden" name="course_id" value={courseId} /> : null}

      <div className="space-y-1.5">
        <Label className="text-base font-semibold" htmlFor="student_name">
          Student / Parent Name
        </Label>
        <Input
          id="student_name"
          name="student_name"
          required
          minLength={2}
          placeholder="Your name"
          className="h-12 text-base"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Mobile Number</Label>
        <Input
          id="phone"
          name="phone"
          required
          inputMode="numeric"
          placeholder="+91 98XXXXXXXX"
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="class_target">Class / Target</Label>
        <select
          id="class_target"
          name="class_target"
          required
          defaultValue=""
          className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="" disabled>
            Select class / target
          </option>
          {CLASS_TARGETS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="preferred_mode">Preferred Mode</Label>
        <select
          id="preferred_mode"
          name="preferred_mode"
          required
          defaultValue=""
          className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
        >
          <option value="" disabled>
            Online / Offline / Hybrid
          </option>
          {MODES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          required
          minLength={2}
          placeholder="Area / City"
          className="h-10"
        />
      </div>

      {state.message ? (
        <Alert variant={state.ok ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" disabled={pending} className="h-11 w-full bg-indigo-600 text-base hover:bg-indigo-500">
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        {pending ? "Submitting..." : submitLabel}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Our experts will contact you shortly. No payment required.
      </p>
    </form>
  );
}
