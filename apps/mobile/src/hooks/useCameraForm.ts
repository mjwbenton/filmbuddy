import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cameraFormSchema, CameraForm } from "@/db/camera";

interface UseCameraFormOptions {
  defaultValues?: Partial<CameraForm>;
  onSubmit: (data: CameraForm) => Promise<void>;
}

interface UseCameraFormReturn {
  form: UseFormReturn<CameraForm>;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  canSubmit: boolean;
}

export function useCameraForm({
  defaultValues,
  onSubmit,
}: UseCameraFormOptions): UseCameraFormReturn {
  const form = useForm<CameraForm>({
    resolver: zodResolver(cameraFormSchema),
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
