import { UseFormReturn, Controller } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";
import { Switch } from "@/components/chakra/switch";

interface RequiredFieldProps {
  form: UseFormReturn<FormValues>;
}

export const RequiredField = ({ form }: RequiredFieldProps) => {
  return (
    <Field
      label="Required"
      invalid={!!form.formState.errors.required}
      errorText={form.formState.errors.required?.message}
    >
      <Controller
        name="required"
        control={form.control}
        render={({ field }) => (
          <Switch
            name={field.name}
            checked={field.value}
            onCheckedChange={({ checked }) => field.onChange(checked)}
            inputProps={{ onBlur: field.onBlur }}
          >
            Make this input required
          </Switch>
        )}
      />
    </Field>
  );
}; 