import React, { useMemo } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "@/components/chakra/select";
import { createListCollection } from "@chakra-ui/react";

interface TypeFieldProps {
  form: UseFormReturn<FormValues>;
  inputType: string;
  runnable: { type: string };
  inputTypesCollection: { items: Array<{ label: string; value: string }> };
  handleTypeChange: (value: string) => void;
}

export const TypeField = ({ form, inputType, runnable, inputTypesCollection, handleTypeChange }: TypeFieldProps) => {
  const fullCollection = useMemo(() => {
    const items = [...inputTypesCollection.items];
    if (runnable.type === "secondary") {
      items.push({ label: "Initial Input Reference", value: "initialInput" });
    }
    return createListCollection({ items });
  }, [inputTypesCollection.items, runnable.type]);

  return (
    <Field
      label="Type"
      invalid={!!form.formState.errors.type}
      errorText={form.formState.errors.type?.message}
      helperText={
        inputType === "action"
          ? "Action inputs trigger form behaviors like submit or reset"
          : inputType === "output"
          ? "Output fields display computed or processed values"
          : inputType === "initialInput"
          ? "Reference and use values from initial forms"
          : undefined
      }
    >
      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <SelectRoot
            name={field.name}
            value={field.value ? [field.value] : undefined}
            onValueChange={({ value }) => handleTypeChange(value[0])}
            onInteractOutside={() => field.onBlur()}
            collection={fullCollection}
          >
            <SelectTrigger>
              <SelectValueText placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent zIndex={1500}>
              {fullCollection.items.map((type) => (
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