import { UseFormReturn, Controller } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "@/components/chakra/select";
import { createListCollection } from "@chakra-ui/react";

interface ActionTypeFieldProps {
  form: UseFormReturn<FormValues>;
  actionTypesCollection: { items: Array<{ label: string; value: string }> };
  handleActionTypeChange: (value: string) => void;
}

export const ActionTypeField = ({ form, actionTypesCollection, handleActionTypeChange }: ActionTypeFieldProps) => {
  return (
    <Field
      label="Action Type"
      invalid={!!form.formState.errors.actionType}
      errorText={form.formState.errors.actionType?.message}
      helperText="Choose what this action button will do when clicked"
    >
      <Controller
        control={form.control}
        name="actionType"
        render={({ field }) => (
          <SelectRoot
            name={field.name}
            value={field.value ? [field.value] : undefined}
            onValueChange={({ value }) => handleActionTypeChange(value[0])}
            onInteractOutside={() => field.onBlur()}
            collection={createListCollection(actionTypesCollection)}
          >
            <SelectTrigger>
              <SelectValueText placeholder="Select Action Type" />
            </SelectTrigger>
            <SelectContent zIndex={1500}>
              {actionTypesCollection.items.map((type) => (
                <SelectItem item={type} key={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
      />
    </Field>
  );
}; 