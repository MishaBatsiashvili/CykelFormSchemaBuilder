import { Input } from "@chakra-ui/react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "@/components/chakra/select";
import { createListCollection } from "@chakra-ui/react";

interface InitialInputFieldsProps {
  form: UseFormReturn<FormValues>;
  availableOutputKeys: Array<{ label: string; value: string }>;
}

export const InitialInputFields = ({ form, availableOutputKeys }: InitialInputFieldsProps) => {
  return (
    <>
      <Field
        label="Select Value to Use"
        invalid={!!form.formState.errors.initialInputKey}
        errorText={form.formState.errors.initialInputKey?.message}
        helperText="Choose a value shared from an initial form"
      >
        <Controller
          control={form.control}
          name="initialInputKey"
          render={({ field }) => (
            <SelectRoot
              name={field.name}
              value={field.value ? [field.value] : undefined}
              onValueChange={({ value }) => field.onChange(value[0])}
              onInteractOutside={() => field.onBlur()}
              collection={createListCollection({ items: availableOutputKeys })}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Select value from initial form" />
              </SelectTrigger>
              <SelectContent zIndex={1500}>
                {availableOutputKeys.map((option) => (
                  <SelectItem
                    item={option}
                    key={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          )}
        />
      </Field>

      <Field
        label="Default Value"
        invalid={!!form.formState.errors.defaultValue}
        errorText={form.formState.errors.defaultValue?.message}
        helperText="Initial value before receiving shared value"
      >
        <Input {...form.register("defaultValue")} />
      </Field>
    </>
  );
}; 