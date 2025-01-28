import { Button, Input, Text, Flex } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Field } from "@/components/chakra/field";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogActionTrigger,
} from "@/components/chakra/dialog";
import { OutputSettingsDialogProps, OutputSettingsFormData } from "./types";
import { useEffect } from "react";

export function OutputSettingsDialog({
  open,
  defaultValues,
  onSubmit,
}: OutputSettingsDialogProps) {
  const form = useForm<OutputSettingsFormData>({
    defaultValues,
  });

  useEffect(() => {
    if(open) {
      form.reset(defaultValues)
    }
  }, [open]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Configure Output</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Flex direction="column" gap={4}>
            <Text fontSize="sm" color="gray.500" mb={4}>
              The data title and tooltip configured here will appear next to any output fields in this runnable.
            </Text>
            <Field
              label="Data Title"
              invalid={!!form.formState.errors.dataTitle}
              errorText={form.formState.errors.dataTitle?.message}
              helperText="Title displayed above the output section"
            >
              <Input
                {...form.register("dataTitle")}
                placeholder="e.g., Result Data, Generated Output"
              />
            </Field>

            <Field
              label="Tooltip"
              invalid={!!form.formState.errors.tip}
              errorText={form.formState.errors.tip?.message}
              helperText="Helper text shown when hovering over the output"
            >
              <Input
                {...form.register("tip")}
                placeholder="e.g., Click to copy, Values update automatically"
              />
            </Field>

            <Flex justify="flex-end">
              <DialogActionTrigger asChild>
                <Button variant="outline" mr={2}>Cancel</Button>
              </DialogActionTrigger>
              <Button type="submit">Save Output Settings</Button>
            </Flex>
          </Flex>
        </form>
      </DialogBody>
      <DialogCloseTrigger />
    </DialogContent>
  );
} 