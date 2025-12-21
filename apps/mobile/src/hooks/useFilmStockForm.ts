import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { filmStockFormSchema, FilmStockForm } from "@/db/schema";

interface UseFilmStockFormOptions {
  defaultValues?: Partial<FilmStockForm>;
  onSubmit: (data: FilmStockForm) => Promise<void>;
}

interface UseFilmStockFormReturn {
  form: UseFormReturn<FilmStockForm>;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export function useFilmStockForm({
  defaultValues,
  onSubmit,
}: UseFilmStockFormOptions): UseFilmStockFormReturn {
  const form = useForm<FilmStockForm>({
    resolver: zodResolver(filmStockFormSchema),
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
