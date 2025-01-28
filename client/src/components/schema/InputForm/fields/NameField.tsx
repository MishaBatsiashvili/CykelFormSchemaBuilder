import React from "react";
import { Input } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";

interface NameFieldProps {
  form: UseFormReturn<FormValues>;
}

export const NameField = ({ form }: NameFieldProps) => {
  return (
    <Field
      label="Name"
      invalid={!!form.formState.errors.name}
      errorText={form.formState.errors.name?.message}
      helperText="A unique identifier for this input"
    >
      <Input {...form.register("name")} />
    </Field>
  );
}; 