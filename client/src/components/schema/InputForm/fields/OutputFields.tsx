import { Input } from "@chakra-ui/react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "@/components/chakra/select";
import { createListCollection } from "@chakra-ui/react";
import { Input as SchemaInput } from "@/lib/schema";

interface OutputFieldsProps {
  form: UseFormReturn<FormValues>;
  runnable: { type: string; inputs: SchemaInput[] };
  schemaState: { runnables: Array<{ type: string; inputs: SchemaInput[] }> };
  existingInput?: SchemaInput;
  transformTypesCollection: { items: Array<{ label: string; value: string }> };
}

export const OutputFields = ({ form, runnable, schemaState, existingInput, transformTypesCollection }: OutputFieldsProps) => {
  // Get available inputs from the current form
  const formInputs = runnable.inputs
    .filter(
      (i: SchemaInput) =>
        i.type !== "output" &&
        i.name !== existingInput?.name,
    )
    .map((input) => ({
      label: input.label,
      value: input.name,
    }));

  // Get shared values from initial forms
  const sharedInputs = runnable.type === "secondary"
    ? schemaState.runnables
        .filter(r => r.type === "initial")
        .flatMap(r => r.inputs)
        .filter(i => i.outputKey)
        .map(input => ({
          label: `Shared: ${input.label}`,
          value: `shared:${input.outputKey}`,
        }))
    : [];

  const allOptions = [...formInputs, ...sharedInputs];
  const optionsCollection = createListCollection({
    items: allOptions,
  });

  return (
    <>
      <Field
        label="Calculate From Input"
        invalid={!!form.formState.errors.calculationSource?.inputName}
        errorText={form.formState.errors.calculationSource?.inputName?.message}
        helperText="Select an input to use as the source for this output"
      >
        <Controller
          control={form.control}
          name="calculationSource.inputName"
          render={({ field }) => (
            <SelectRoot
              name={field.name}
              value={field.value ? [field.value] : undefined}
              onValueChange={({ value }) => field.onChange(value[0])}
              onInteractOutside={() => field.onBlur()}
              collection={optionsCollection}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Select input to calculate from" />
              </SelectTrigger>
              <SelectContent zIndex={1500}>
                {allOptions.map((option) => (
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
        label="Transform"
        invalid={!!form.formState.errors.calculationSource?.transform}
        errorText={form.formState.errors.calculationSource?.transform?.message}
      >
        <Controller
          control={form.control}
          name="calculationSource.transform"
          render={({ field }) => (
            <SelectRoot
              name={field.name}
              value={field.value ? [field.value] : undefined}
              onValueChange={({ value }) => field.onChange(value[0])}
              onInteractOutside={() => field.onBlur()}
              collection={createListCollection(transformTypesCollection)}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Select transformation" />
              </SelectTrigger>
              <SelectContent zIndex={1500}>
                {transformTypesCollection.items.map((type) => (
                  <SelectItem item={type} key={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          )}
        />
      </Field>

      {form.watch("calculationSource.transform") !== "none" && (
        <Field
          label="Transform Value"
          invalid={!!form.formState.errors.calculationSource?.value}
          errorText={form.formState.errors.calculationSource?.value?.message}
        >
          <Controller
            control={form.control}
            name="calculationSource.value"
            render={({ field }) => (
              <Input
                type="number"
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : undefined;
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
              />
            )}
          />
        </Field>
      )}
    </>
  );
}; 