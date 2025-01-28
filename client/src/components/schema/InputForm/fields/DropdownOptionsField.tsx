import { Button, Input, Stack, Flex, IconButton } from "@chakra-ui/react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import { FormValues } from "../types";
import { Plus, X } from "lucide-react";
import { useEffect } from "react";

interface DropdownOptionsFieldProps {
  form: UseFormReturn<FormValues>;
}

export const DropdownOptionsField = ({ form }: DropdownOptionsFieldProps) => {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: "options",
  });

  // Watch for options changes and update default value if needed
  useEffect(() => {
    const options = form.getValues("options") || [];
    const defaultValue = form.getValues("defaultValue");

    // If default value is set but not present in options anymore, clear it
    if (defaultValue && !options.some(opt => opt.value === defaultValue)) {
      form.setValue("defaultValue", undefined);
    }
  }, [form.watch("options")]);

  return (
    <Stack gap="4" w="full">
      <Flex justify="space-between" align="center">
        <Field
          label="Options"
          invalid={!!form.formState.errors.options?.root?.message || !!form.formState.errors.options}
          errorText={form.formState.errors.options?.root?.message ?? form.formState.errors.options?.message}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => appendOption({ label: "", value: "" })}
          >
            <Flex align="center" gap="2">
              <Plus style={{ width: '16px', height: '16px' }} />
              Add Option
            </Flex>
          </Button>
        </Field>
      </Flex>
      <Stack gap="2">
        {optionFields.map((field, index) => (
          <Flex key={field.id} gap="2">
            <Field
              invalid={!!form.formState.errors.options?.[index]?.label}
              errorText={form.formState.errors.options?.[index]?.label?.message}
            >
              <Input
                placeholder="Label"
                {...form.register(`options.${index}.label` as const)}
              />
            </Field>
            <Field
              invalid={!!form.formState.errors.options?.[index]?.value}
              errorText={form.formState.errors.options?.[index]?.value?.message}
            >
              <Input
                placeholder="Value"
                {...form.register(`options.${index}.value` as const)}
              />
            </Field>
            <IconButton
              aria-label="Remove option"
              variant="ghost"
              size="sm"
              onClick={() => removeOption(index)}
              colorScheme="red"
            >
              <X style={{ width: '16px', height: '16px' }} />
            </IconButton>
          </Flex>
        ))}
      </Stack>
    </Stack>
  );
}; 