import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lensFormSchema, LensForm } from "@/db/schema";

interface UseLensFormOptions {
  defaultValues?: Partial<LensForm>;
  onSubmit: (data: LensForm) => Promise<void>;
}

interface UseLensFormReturn {
  form: UseFormReturn<LensForm>;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export function useLensForm({
  defaultValues,
  onSubmit,
}: UseLensFormOptions): UseLensFormReturn {
  const form = useForm<LensForm>({
    resolver: zodResolver(lensFormSchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
    mode: "onSubmit",
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  // Allow submission if form is valid, or if user hasn't tried to submit yet
  // (so Save button is enabled for initial form entry)
  const canSubmit = form.formState.isValid || !form.formState.isSubmitted;

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    canSubmit,
  };
}
