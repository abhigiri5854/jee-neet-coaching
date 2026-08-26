"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, signupAction, forgotPasswordAction, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2Icon } from "lucide-react";

const initial: AuthState = { ok: false, message: "" };

function Field({
  id,
  label,
  type = "text",
  name,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} type={type} required className="h-10" placeholder={placeholder} />
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field id="email" name="email" type="email" label="Email" placeholder="you@email.com" />
      <Field id="password" name="password" type="password" label="Password" />
      {state.message ? (
        <Alert variant={state.ok ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} className="h-11 w-full">
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        {pending ? "Signing in..." : "Login"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/forgot-password" className="text-indigo-600 hover:underline">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initial);
  return (
    <form action={action} className="space-y-4">
      <Field id="fullName" name="fullName" label="Full name" />
      <Field id="email" name="email" type="email" label="Email" />
      <Field id="phone" name="phone" label="Mobile number" placeholder="10-digit number" />
      <Field id="password" name="password" type="password" label="Password" />
      <Field id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" />
      {state.message ? (
        <Alert variant={state.ok ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} className="h-11 w-full">
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        {pending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initial);
  return (
    <form action={action} className="space-y-4">
      <Field id="email" name="email" type="email" label="Email" />
      {state.message ? (
        <Alert variant={state.ok ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} className="h-11 w-full">
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        {pending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
