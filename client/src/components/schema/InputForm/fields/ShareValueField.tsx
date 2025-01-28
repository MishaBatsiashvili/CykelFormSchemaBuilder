import { Input } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";

interface ShareValueFieldProps {
  form: UseFormReturn<FormValues>;
}

export const ShareValueField = ({ form }: ShareValueFieldProps) => {
  return (
    <Field
      label="Share Value (Optional)"
      invalid={!!form.formState.errors.outputKey}
      errorText={form.formState.errors.outputKey?.message}
      helperText="Add an output key to make this value available to secondary forms"
    >
      <Input
        {...form.register("outputKey")}
        placeholder="e.g., projectId, userId"
      />
    </Field>
  );
}; 