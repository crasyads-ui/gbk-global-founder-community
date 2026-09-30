import { redirect } from "next/navigation";

export default function BusinessListingsRedirect() {
  redirect("/?section=business-listings");
}
