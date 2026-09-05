import { toast as sonner } from "sonner";

export const toast = ({
  title,
  description,
  variant,
}: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}) => {
  if (variant === "destructive") {
    sonner.error(title ?? "Error", { description });
  } else {
    sonner(title ?? "Done", { description });
  }
};

export const useToast = () => ({ toast });
