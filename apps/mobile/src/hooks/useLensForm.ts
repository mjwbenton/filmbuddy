import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lensFormSchema, LensForm, Lens } from "@/db/lens";
import { DEFAULT_APERTURES } from "@/lib/aperture";

interface UseLensFormOptions {
  /** Existing lens to edit, or undefined for new lens */
  lens?: Lens;
  onSubmit: (data: LensForm) => Promise<void>;
}

interface UseLensFormReturn {
  form: UseFormReturn<LensForm>;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

/** Convert a Lens entity to LensForm values */
function lensToFormValues(lens: Lens): LensForm {
  return {
    name: lens.name,
    apertures: lens.apertures,
  };
}

export function useLensForm({
  lens,
  onSubmit,
}: UseLensFormOptions): UseLensFormReturn {
  const defaultValues: LensForm = lens
    ? lensToFormValues(lens)
    : {
        name: "",
        apertures: DEFAULT_APERTURES,
      };

  const form = useForm<LensForm>({
    resolver: zodResolver(lensFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  // Watch for validation errors to control submit button
  const { isValid, isSubmitted, errors } = form.formState;

  // Allow submission if:
  // - Form is valid, OR
  // - User hasn't tried to submit yet (for initial form entry)
  // But disable if there are aperture errors
  const hasApertureError = !!errors.apertures;
  const canSubmit = (isValid || !isSubmitted) && !hasApertureError;

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    canSubmit,
  };
}
