import { Button, Box, Flex, IconButton, Stack } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogActionTrigger,
} from "@/components/chakra/dialog";
import { Plus, Edit } from "lucide-react";
import { inputTypesCollection, actionTypesCollection, transformTypesCollection, getEmptyValues } from "./utils";
import { Props } from "./types";
import { NameField } from "./fields/NameField";
import { LabelField } from "./fields/LabelField";
import { TypeField } from "./fields/TypeField";
import { ActionTypeField } from "./fields/ActionTypeField";
import { ShareValueField } from "./fields/ShareValueField";
import { InitialInputFields } from "./fields/InitialInputFields";
import { OutputFields } from "./fields/OutputFields";
import { RequiredField } from "./fields/RequiredField";
import { DescriptionField } from "./fields/DescriptionField";
import { DropdownOptionsField } from "./fields/DropdownOptionsField";
import { SliderFields } from "./fields/SliderFields";
import { DefaultValueField } from "./fields/DefaultValueField";
import { useInputForm } from "./hooks/useInputForm";
import { useAvailableOutputKeys } from "./hooks/useAvailableOutputKeys";
import { useToast } from "@/hooks/use-toast";

export default function InputForm({ runnable, existingInput, schema }: Props) {
  const { toast } = useToast();
  const {
    form,
    open,
    inputType,
    handleOpenChange,
    handleActionTypeChange,
    handleTypeChange,
    onSubmit,
  } = useInputForm({ runnable, existingInput, schema });

  const { schemaState, availableOutputKeys } = useAvailableOutputKeys();

  const handleDialogOpenChange = (details: { open: boolean }) => {
    if (details.open && !existingInput && runnable.inputs.length >= 20) {
      toast({
        title: "Maximum Inputs Reached",
        description: "A runnable cannot have more than 20 inputs",
        type: "error"
      });
      return;
    }
    if (details.open && !existingInput) {
      form.reset(getEmptyValues());
    }
    handleOpenChange(details);
  };

  return (
    <DialogRoot scrollBehavior={'inside'} placement="center" motionPreset="slide-in-bottom" open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {existingInput ? (
          <IconButton
            aria-label="Edit input"
            variant="ghost"
            size="sm"
          >
            <Edit style={{ width: '16px', height: '16px' }} />
          </IconButton>
        ) : (
          <Button>
            <Flex align="center" gap="2">
              <Plus style={{ width: '16px', height: '16px' }} />
              Add Input
            </Flex>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existingInput ? "Edit Input" : "Add New Input"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
            <Stack gap="4" py="2">
              <NameField form={form} />
              <LabelField form={form} />
              <TypeField 
                form={form}
                inputType={inputType}
                runnable={runnable}
                inputTypesCollection={inputTypesCollection}
                handleTypeChange={handleTypeChange}
              />

              {inputType === "action" && (
                <ActionTypeField 
                  form={form}
                  actionTypesCollection={actionTypesCollection}
                  handleActionTypeChange={handleActionTypeChange}
                />
              )}

              {runnable.type === "initial" && inputType !== "output" && (
                <ShareValueField form={form} />
              )}

              {inputType === "initialInput" && (
                <InitialInputFields 
                  form={form}
                  availableOutputKeys={availableOutputKeys}
                />
              )}

              {inputType === "output" && (
                <OutputFields 
                  form={form}
                  runnable={runnable}
                  schemaState={schemaState}
                  existingInput={existingInput}
                  transformTypesCollection={transformTypesCollection}
                />
              )}

              <RequiredField form={form} />
              <DescriptionField form={form} />

              {inputType === "dropdown" && (
                <>
                  <DropdownOptionsField form={form} />
                  <DefaultValueField form={form} inputType={inputType} />
                </>
              )}

              {inputType === "slider" && (
                <>
                  <SliderFields form={form} />
                  <DefaultValueField form={form} inputType={inputType} />
                </>
              )}

              {(inputType === "textarea" || inputType === "toggle") && (
                <DefaultValueField form={form} inputType={inputType} />
              )}

              {/* {inputType === "textarea" && (<DefaultValueField form={form} inputType={inputType} />)} */}

              <Flex justify="flex-end" pt="4" gap="2">
                <DialogActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogActionTrigger>
                <Button type="submit">
                  {existingInput ? "Update Input" : "Add Input"}
                </Button>
              </Flex>
            </Stack>
          </Box>
        </DialogBody>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
