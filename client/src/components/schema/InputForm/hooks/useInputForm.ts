import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSchemaStore } from "@/store/schema";
import { createFormSchema, getEmptyValues } from "../utils";
import { FormValues, Props, TransformType, InputType } from "../types";
import { Input as SchemaInput } from "@/lib/schema";

export const useInputForm = ({ runnable, existingInput, schema }: Props) => {
  const [open, setOpen] = useState(false);
  const [oldName, setOldName] = useState<string | undefined>(existingInput?.name);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(runnable, schema, oldName)),
    defaultValues: existingInput ? {
      ...existingInput,
      type: existingInput.type,
      label: existingInput.label || "",
      required: existingInput.required || false,
      mark: existingInput.mark,
      options: existingInput.options || [],
      calculationSource: existingInput.calculationSource ? {
        inputName: existingInput.calculationSource.inputName,
        transform: (existingInput.calculationSource.transform || "none") as TransformType,
        value: existingInput.calculationSource.value
      } : undefined
    } : getEmptyValues(),
    mode: "onSubmit",
  });

  const addInput = useSchemaStore((state) => state.addInput);
  const updateInput = useSchemaStore((state) => state.updateInput);
  const inputType = form.watch("type");

  const handleOpenChange = (details: { open: boolean }) => {
    setOpen(details.open);
    if (!details.open) {
      setOldName(undefined);
    }
  };

  const handleActionTypeChange = (value: string) => {
    form.setValue("actionType", value);
    if (!form.getValues("name") || !form.getValues("label")) {
      const actionName = value.charAt(0).toUpperCase() + value.slice(1);
      form.setValue("name", `${actionName}Action`);
      form.setValue("label", actionName);
    }
  };

  const handleTypeChange = (value: string) => {
    const name = form.getValues("name");
    const label = form.getValues("label");
    const required = form.getValues("required");
    const description = form.getValues("description");

    form.reset({
      name,
      label,
      type: value as InputType,
      required,
      description,
      options: value === "dropdown" ? [] : undefined,
      min: value === "slider" ? 0 : undefined,
      max: value === "slider" ? 10 : undefined,
      step: value === "slider" ? 1 : undefined,
      mark: value === "slider" ? undefined : undefined,
      actionType: value === "action" ? "" : undefined,
      outputKey: undefined,
      initialInputKey: value === "initialInput" ? "" : undefined,
      defaultValue: (() => {
        switch (value) {
          case "toggle":
            return false;
          case "slider":
            return 0;
          case "textarea":
          case "dropdown":
            return "";
          default:
            return undefined;
        }
      })(),
      calculationSource:
        value === "output" ? { inputName: "", transform: "none" } : undefined,
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const input: SchemaInput = {
        ...data,
        mark: data.type === "slider" ? data.mark : undefined,
        calculationSource: data.calculationSource ? {
          inputName: data.calculationSource.inputName,
          transform: data.calculationSource.transform,
          value: data.calculationSource.value
        } : undefined
      };
      if (existingInput) {
        updateInput(runnable.path, input, oldName);
        toast({
          title: "Input Updated",
          description: "The input has been successfully updated.",
          type: "success"
        });
      } else {
        addInput(runnable.path, input);
        toast({
          title: "Input Added",
          description: "The input has been successfully added.",
          type: "success"
        });
      }
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save input. Please try again.",
        type: "error"
      });
    }
  };

  return {
    form,
    open,
    inputType,
    handleOpenChange,
    handleActionTypeChange,
    handleTypeChange,
    onSubmit,
    setOldName
  };
}; 