import { toast } from "sonner";
import { copyText as copy } from "@/lib/utils";

export { relativeTime } from "@/lib/utils";

export async function copyText(text: string) {
  await copy(text);
}

export function toastSafe(message: string) {
  toast.success(message);
}
