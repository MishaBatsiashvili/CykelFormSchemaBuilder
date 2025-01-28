import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Stack } from "@chakra-ui/react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogActionTrigger,
} from "@/components/chakra/dialog";
import { Field } from "@/components/chakra/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/chakra/select";
import { createListCollection } from "@chakra-ui/react";
import { AddRunnableDialogProps, RunnableFormData, runnableSchema } from "./types";
import { RUNNABLE_TYPES } from "./utils";
import { useSchemaStore } from "@/store/schema";

export function AddRunnableDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddRunnableDialogProps) {
  const runnables = useSchemaStore((state) => state.history.present.runnables);
  const hasInitialRunnable = runnables.some((r) => r.type === "initial");

  const availableTypes = useMemo(() => createListCollection({
    items: RUNNABLE_TYPES.filter((type) => {
      // If there are no runnables, only allow initial
      if (runnables.length === 0) {
        return type.value === "initial";
      }
      // If there's already an initial runnable, only allow secondary
      if (hasInitialRunnable) {
        return type.value === "secondary";
      }
      return true;
    }),
  }), [runnables.length, hasInitialRunnable]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<RunnableFormData>({
    resolver: zodResolver(runnableSchema),
    defaultValues: {
      path: "",
      type: runnables.length === 0 ? "initial" : hasInitialRunnable ? "secondary" : undefined,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        path: "",
        type: runnables.length === 0 ? "initial" : hasInitialRunnable ? "secondary" : undefined,
      });
    }
  }, [open, reset, runnables.length, hasInitialRunnable]);

  const handleFormSubmit = (data: RunnableFormData) => {
    onSubmit(data);
    onOpenChange({ open: false });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Runnable</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogBody>
          <Stack direction="column" gap={4}>
            <Field
              label="Path"
              invalid={!!errors.path}
              errorText={errors.path?.message}
              helperText="A unique identifier for this form"
            >
              <Input {...register("path")} />
            </Field>

            <Field
              label="Type"
              invalid={!!errors.type}
              errorText={errors.type?.message}
              helperText={runnables.length === 0 
                ? "First runnable must be initial" 
                : hasInitialRunnable 
                  ? "Only secondary runnables can be added after initial" 
                  : undefined}
            >
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <SelectRoot
                    name={field.name}
                    value={field.value ? [field.value] : undefined}
                    onValueChange={({ value }) => field.onChange(value[0])}
                    onInteractOutside={() => field.onBlur()}
                    collection={availableTypes}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent zIndex={1500}>
                      {availableTypes.items.map((type) => (
                        <SelectItem item={type} key={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                )}
              />
            </Field>
          </Stack>
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button onClick={handleSubmit(handleFormSubmit)}>Save</Button>
        </DialogFooter>
      </form>

      <DialogCloseTrigger />
    </DialogContent>
  );
} 