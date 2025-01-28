import { Stack } from "@chakra-ui/react";
import { Field } from "@/components/chakra/field";
import { Input } from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface Props {
  form: UseFormReturn<FormValues>;
}

export function SliderFields({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <Stack gap="4">
      <Field
        label="Minimum Value"
        invalid={!!errors.min}
        errorText={errors.min?.message?.toString()}
      >
        <Input
          type="number"
          {...register("min", { valueAsNumber: true })}
          placeholder="Enter minimum value..."
        />
      </Field>

      <Field
        label="Maximum Value"
        invalid={!!errors.max}
        errorText={errors.max?.message?.toString()}
      >
        <Input
          type="number"
          {...register("max", { valueAsNumber: true })}
          placeholder="Enter maximum value..."
        />
      </Field>

      <Field
        label="Step"
        invalid={!!errors.step}
        errorText={errors.step?.message?.toString()}
      >
        <Input
          type="number"
          {...register("step", { valueAsNumber: true })}
          placeholder="Enter step value..."
        />
      </Field>

      <Field
        label="Value Suffix"
        invalid={!!errors.mark}
        errorText={errors.mark?.message?.toString()}
      >
        <Input
          {...register("mark")}
          placeholder="e.g. px, %, etc..."
        />
      </Field>
    </Stack>
  );
} 