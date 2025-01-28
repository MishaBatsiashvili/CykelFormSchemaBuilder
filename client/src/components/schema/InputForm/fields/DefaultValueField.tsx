import { Input } from "@chakra-ui/react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { Switch } from "@/components/chakra/switch";
import { FormValues } from "../types";
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "@/components/chakra/select";
import { createListCollection } from "@chakra-ui/react";

interface DefaultValueFieldProps {
  form: UseFormReturn<FormValues>;
  inputType: string;
}

export const DefaultValueField = ({ form, inputType }: DefaultValueFieldProps) => {
  const options = form.watch("options") || [];

  const getHelperText = () => {
    switch (inputType) {
      case "textarea":
        return "Default text to show in the textarea";
      case "toggle":
        return "Initial toggle state (on/off)";
      case "dropdown":
        return "Default selected option";
      case "slider":
        return "Default slider value (must be between min and max)";
      default:
        return undefined;
    }
  };

  if (inputType === "toggle") {
    return (
      <Field
        label="Default Value"
        invalid={!!form.formState.errors.defaultValue}
        errorText={form.formState.errors.defaultValue?.message}
        helperText={getHelperText()}
      >
        <Controller
          name="defaultValue"
          control={form.control}
          render={({ field }) => {
            const isChecked = field.value === true || field.value === "true";
            return (
              <Switch
                name={field.name}
                checked={isChecked}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                inputProps={{ onBlur: field.onBlur }}
              >
                Default is {isChecked ? "On" : "Off"}
              </Switch>
            );
          }}
        />
      </Field>
    );
  }

  if (inputType === "dropdown" && options.length > 0) {
    const allOptions = [
      { label: "No default value", value: "__no_default__" },
      ...options
    ];

    return (
      <Field
        label="Default Value"
        invalid={!!form.formState.errors.defaultValue}
        errorText={form.formState.errors.defaultValue?.message}
        helperText={getHelperText()}
      >
        <Controller
          control={form.control}
          name="defaultValue"
          render={({ field }) => (
            <SelectRoot
              name={field.name}
              value={field.value ? [field.value.toString()] : undefined}
              onValueChange={({ value }) => field.onChange(value[0] === "__no_default__" ? undefined : value[0])}
              onInteractOutside={() => field.onBlur()}
              collection={createListCollection({ items: allOptions })}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Select default value" />
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
    );
  }

  if (inputType === "slider") {
    const min = form.watch("min") ?? 0;
    const max = form.watch("max") ?? 10;

    return (
      <Field
        label="Default Value"
        invalid={!!form.formState.errors.defaultValue}
        errorText={form.formState.errors.defaultValue?.message}
        helperText={getHelperText()}
      >
        <Input
          type="number"
          {...form.register("defaultValue", {
            valueAsNumber: true,
            min,
            max
          })}
          placeholder={`Enter a value between ${min} and ${max}`}
        />
      </Field>
    );
  }

  if (inputType === "textarea") {
    return (
      <Field
        label="Default Value"
        invalid={!!form.formState.errors.defaultValue}
        errorText={form.formState.errors.defaultValue?.message}
        helperText={getHelperText()}
      >
        <Input
          {...form.register("defaultValue")}
          placeholder="Enter default text"
        />
      </Field>
    );
  }

  return null;
}; 