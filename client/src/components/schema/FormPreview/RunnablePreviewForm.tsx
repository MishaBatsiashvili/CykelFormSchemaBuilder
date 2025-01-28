import React, { useEffect, useRef } from 'react';
import { 
  Button, 
  Text, 
  Box,
  Flex,
  VStack,
  Badge
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { RunnablePreviewFormProps } from './types';
import { createValidationSchema, getDefaultValues } from './utils';
import { FormInputField } from './FormInputField';

export const RunnablePreviewForm: React.FC<RunnablePreviewFormProps> = ({
  runnable,
  sharedValues,
  onUpdateSharedValues,
}) => {
  const { toast } = useToast();
  const schema = createValidationSchema(runnable);
  const previousInputsRef = useRef(runnable.inputs);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(runnable),
    mode: "onSubmit",
  });

  // Reset toggle, slider, dropdown, and textarea fields when they're added or edited
  useEffect(() => {
    const currentInputs = runnable.inputs;
    const previousInputs = previousInputsRef.current;

    currentInputs.forEach(input => {
      const previousInput = previousInputs.find(prev => prev.name === input.name);
      
      // Check if input is new or edited
      if ((input.type === 'toggle' || input.type === 'slider' || input.type === 'dropdown' || input.type === 'textarea') && 
          (!previousInput || 
           previousInput.defaultValue !== input.defaultValue ||
           previousInput.type !== input.type ||
           (input.type === 'dropdown' && JSON.stringify(previousInput.options) !== JSON.stringify(input.options)))) {
        setValue(input.name, input.defaultValue);
      }
    });

    previousInputsRef.current = currentInputs;
  }, [runnable.inputs, setValue]);

  const handleFormSubmit = (data: any) => {
    const newSharedValues = { ...sharedValues };
    let hasSharedValues = false;

    if (runnable.type === "initial") {
      runnable.inputs.forEach((input) => {
        if (input.outputKey) {
          const value = data[input.name];
          if (value !== undefined && value !== "") {
            newSharedValues[input.outputKey] = value;
            hasSharedValues = true;
          }
        }
      });

      if (hasSharedValues) {
        onUpdateSharedValues(newSharedValues);
        toast({
          title: "Values shared successfully",
          description: "The values are now available to secondary forms",
          type: "success"
        });
      }
    }

    toast({
      title: `${runnable.type === "initial" ? "Initial" : "Secondary"} Form Submitted`,
      description: `Form data processed successfully`,
      type: "success"
    });
  };

  const handleFormReset = () => {
    reset(getDefaultValues(runnable));
  };

  return (
    <Box mb={4} p={4}>
      <Flex alignItems="center" gap={2} mb={4}>
        <Text fontSize="lg" fontWeight="semibold" color={runnable.type === "initial" ? "primary" : "secondary"}>
          {runnable.path}
        </Text>
        <Badge colorPalette={runnable.type === "initial" ? "blue" : "gray"}>
          {runnable.type === "initial" ? "Initial Form" : "Secondary Form"}
        </Badge>
      </Flex>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <VStack gap={4} w="full" align="stretch">
          {runnable.inputs.map((input) => (
            <Box key={input.name} width="full">
              <FormInputField
                input={input}
                errors={errors}
                register={register}
                control={control}
                watch={watch}
                setValue={setValue}
                sharedValues={sharedValues}
                onReset={handleFormReset}
              />
              {input.description && (
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {input.description}
                </Text>
              )}
            </Box>
          ))}
        </VStack>
      </form>
    </Box>
  );
}; 