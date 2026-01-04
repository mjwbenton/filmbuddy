import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lensFormSchema, LensForm, Lens } from "@/db/schema";

/** Default aperture set for new lenses (whole stops f/2.8 to f/16) */
const DEFAULT_APERTURES = [2.8, 4, 5.6, 8, 11, 16];

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

/** Safely parse apertures JSON with error handling */
function safeParseApertures(json: string): number[] {
  try {
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return DEFAULT_APERTURES;
    const numbers = parsed.filter((n): n is number => typeof n === "number");
    return numbers.length > 0 ? numbers : DEFAULT_APERTURES;
  } catch {
    return DEFAULT_APERTURES;
  }
}

/** Convert a Lens entity to LensForm values */
function lensToFormValues(lens: Lens): LensForm {
  return {
    name: lens.name,
    apertures: safeParseApertures(lens.customApertures),
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
