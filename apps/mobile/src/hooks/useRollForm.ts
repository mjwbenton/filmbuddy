import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rollFormSchema, RollForm } from "@/db/schema";

interface UseRollFormOptions {
  defaultValues?: Partial<RollForm>;
  onSubmit: (data: RollForm) => Promise<void>;
}

interface UseRollFormReturn {
  form: UseFormReturn<RollForm>;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export function useRollForm({
  defaultValues,
  onSubmit,
}: UseRollFormOptions): UseRollFormReturn {
  const form = useForm<RollForm>({
    resolver: zodResolver(rollFormSchema),
    defaultValues: {
      filmStock: "",
      iso: 100,
      camera: "",
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
