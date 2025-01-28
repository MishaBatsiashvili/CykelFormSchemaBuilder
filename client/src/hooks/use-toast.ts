import { toaster } from "@/components/chakra/toaster";

interface ToastProps {
  title?: string;
  description?: string;
  type?: "info" | "success" | "error" | "loading";
  duration?: number;
  isClosable?: boolean;
}

function toast(props: ToastProps) {
  return toaster.create({
    title: props.title,
    description: props.description,
    type: props.type || "info",
    duration: props.duration || 5000,
    meta: {
      closable: props.isClosable ?? true
    }
  });
}

export function useToast() {
  return {
    toast,
    dismiss: toaster.dismiss
  };
}

export { toast };
