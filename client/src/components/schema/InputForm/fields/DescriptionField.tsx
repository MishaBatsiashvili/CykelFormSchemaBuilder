import React from "react";
import { Input } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";

interface DescriptionFieldProps {
  form: UseFormReturn<FormValues>;
}

export const DescriptionField = ({ form }: DescriptionFieldProps) => {
  return (
    <Field
      label="Description"
      invalid={!!form.formState.errors.description}
      errorText={form.formState.errors.description?.message}
      helperText="Add a description for this input"
    >
      <Input {...form.register("description")} />
    </Field>
  );
}; 