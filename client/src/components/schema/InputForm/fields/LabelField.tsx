import React from "react";
import { Input } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";

interface LabelFieldProps {
  form: UseFormReturn<FormValues>;
}

export const LabelField = ({ form }: LabelFieldProps) => {
  return (
    <Field
      label="Label"
      invalid={!!form.formState.errors.label}
      errorText={form.formState.errors.label?.message}
      helperText="The label shown to users"
    >
      <Input {...form.register("label")} />
    </Field>
  );
}; 