import { redirect } from "next/navigation";

/** Legacy route — platform is free; send merchants to the dashboard. */
export default function RenewPage() {
  redirect("/dashboard");
}
