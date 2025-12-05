import { ISOValue } from "@/types/roll";

export interface RollFormData {
  filmStock: string;
  iso: ISOValue | null;
  camera: string;
}

export interface ValidationErrors {
  filmStock?: string;
  iso?: string;
  camera?: string;
}

export function isValidRoll(data: RollFormData): boolean {
  return (
    data.filmStock.trim() !== "" &&
    data.iso !== null &&
    data.camera.trim() !== ""
  );
}

export function getValidationErrors(data: RollFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (data.filmStock.trim() === "") {
    errors.filmStock = "Film stock is required";
  }

  if (data.iso === null) {
    errors.iso = "ISO is required";
  }

  if (data.camera.trim() === "") {
    errors.camera = "Camera is required";
  }

  return errors;
}
