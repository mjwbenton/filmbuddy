import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lensFormSchema, LensForm, Lens } from "@/db/schema";

/** Default aperture values for new lenses */
const DEFAULT_APERTURE_VALUES: Pick<
  LensForm,
  | "apertureMode"
  | "maxAperture"
  | "minAperture"
  | "stopIncrement"
  | "customApertures"
> = {
  apertureMode: "standard",
  maxAperture: 2.8,
  minAperture: 16,
  stopIncrement: "whole",
  customApertures: [],
};

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

/** Safely parse custom apertures JSON with error handling */
function safeParseCustomApertures(json: string | null): number[] {
  if (!json) return [];
  try {
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is number => typeof n === "number");
  } catch {
    return [];
  }
}

/** Convert a Lens entity to LensForm values */
function lensToFormValues(lens: Lens): LensForm {
  return {
    name: lens.name,
    apertureMode: lens.apertureMode,
    maxAperture: lens.maxAperture,
    minAperture: lens.minAperture,
    stopIncrement: lens.stopIncrement,
    customApertures: safeParseCustomApertures(lens.customApertures),
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
        ...DEFAULT_APERTURE_VALUES,
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
  // But disable if there are aperture range errors
  const hasApertureError = !!errors.minAperture || !!errors.customApertures;
  const canSubmit = (isValid || !isSubmitted) && !hasApertureError;

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    canSubmit,
  };
}
