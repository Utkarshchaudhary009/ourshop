import { redirect } from "next/navigation";

export default function MeRedirect() {
  redirect("/admin/company");
}
