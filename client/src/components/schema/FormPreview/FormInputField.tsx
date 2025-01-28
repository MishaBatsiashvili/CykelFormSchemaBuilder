import React from 'react';
import { 
  Button, 
  Textarea, 
  Text, 
  Box,
  Flex,
  Input,
  Badge,
  VStack,
  createListCollection
} from "@chakra-ui/react";
import { Switch } from "@/components/chakra/switch";
import { Slider } from "@/components/chakra/slider";
import { Field } from "@/components/chakra/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/chakra/select";
import { Controller } from "react-hook-form";
import { HelpCircle } from "lucide-react";
import {
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from "@/components/chakra/hover-card";
import { FormInputFieldProps } from './types';
import { useToast } from "@/hooks/use-toast";

export const FormInputField: React.FC<FormInputFieldProps> = ({
  input,
  errors,
  register,
  control,
  watch,
  setValue,
  sharedValues,
  onReset,
}) => {
  const { toast } = useToast();

  if (input.type === "initialInput" && input.initialInputKey) {
    const sharedValue = sharedValues[input.initialInputKey];
    
    React.useEffect(() => {
      if (sharedValue !== undefined) {
        setValue(input.name, sharedValue);
      }
    }, [sharedValue, setValue, input.name]);

    return (
      <Field
        label={
          <Flex gap={2} alignItems="center">
            <Text>{input.label}</Text>
            {input.required && <Badge colorPalette="red">Required</Badge>}
          </Flex>
        }
        invalid={!!errors[input.name]}
        errorText={errors[input.name]?.message?.toString()}
        width="full"
      >
        <Input
          {...register(input.name)}
          placeholder={input.defaultValue || "Enter value..."}
        />
      </Field>
    );
  }

  switch (input.type) {
    case "dropdown": {
      const optionsCollection = createListCollection<{ label: string; value: string }>({
        items: input.options?.map((option: { label: string; value: string }) => ({
          label: option.label,
          value: option.value
        })) || []
      });
      
      return (
        <Field
          label={
            <Flex gap={2} alignItems="center">
              <Text>{input.label}</Text>
              {input.required && <Badge colorPalette="red">Required</Badge>}
            </Flex>
          }
          invalid={!!errors[input.name]}
          errorText={errors[input.name]?.message?.toString()}
          width="full"
        >
          <Controller
            name={input.name}
            control={control}
            defaultValue={input.defaultValue || ""}
            render={({ field }) => (
              <SelectRoot
                value={field.value ? [field.value] : []}
                onValueChange={({ value }) => field.onChange(value[0] || null)}
                collection={optionsCollection}
                width="full"
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent zIndex={1500}>
                  {optionsCollection.items.map((option) => (
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

    case "slider":
      return (
        <Field
          label={
            <Flex gap={2} alignItems="center">
              <Text>{input.label}: {watch(input.name)}{input.mark ? input.mark : ''}</Text>
              {input.required && <Badge colorPalette="red">Required</Badge>}
            </Flex>
          }
          invalid={!!errors[input.name]}
          errorText={errors[input.name]?.message?.toString()}
          width="full"
        >
          <Controller
            name={input.name}
            control={control}
            defaultValue={input.defaultValue !== undefined ? Number(input.defaultValue) : Number(input.min)}
            render={({ field }) => (
              <Slider
                width="full"
                value={[Number(field.value)]}
                min={Number(input.min)}
                max={Number(input.max)}
                step={Number(input.step)}
                onValueChange={({ value }) => field.onChange(value[0])}
              />
            )}
          />
        </Field>
      );

    case "textarea":
      return (
        <Field
          label={
            <Flex gap={2} alignItems="center">
              <Text>{input.label}</Text>
              {input.required && <Badge colorPalette="red">Required</Badge>}
            </Flex>
          }
          invalid={!!errors[input.name]}
          errorText={errors[input.name]?.message?.toString()}
          width="full"
        >
          <Controller
            name={input.name}
            control={control}
            defaultValue={input.defaultValue || ""}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder={`Enter ${input.label.toLowerCase()}...`}
                width="full"
              />
            )}
          />
        </Field>
      );

    case "toggle":
      return (
        <Field
          label={
            <Flex gap={2} alignItems="center">
              <Text>{input.label}</Text>
              {input.required && <Badge colorPalette="red">Required</Badge>}
            </Flex>
          }
          invalid={!!errors[input.name]}
          errorText={errors[input.name]?.message?.toString()}
          width="full"
        >
          <Controller
            name={input.name}
            control={control}
            defaultValue={typeof input.defaultValue === "boolean" ? input.defaultValue : false}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={({ checked }) => field.onChange(checked)}
                width="full"
              >
                {input.description || "Toggle this option"}
              </Switch>
            )}
          />
        </Field>
      );

    case "output": {
      const sourceValue = input.calculationSource?.inputName
        ? input.calculationSource.inputName.startsWith('shared:')
          ? sharedValues[input.calculationSource.inputName.replace('shared:', '')]
          : watch(input.calculationSource.inputName)
        : null;

      let calculatedValue: number | null = null;

      if (sourceValue !== undefined && sourceValue !== null && sourceValue !== "") {
        const numericSourceValue = Number(sourceValue);

        if (!isNaN(numericSourceValue)) {
          calculatedValue = numericSourceValue;

          if (input.calculationSource?.transform && input.calculationSource.transform !== "none") {
            const transformValue = Number(input.calculationSource.value) || 0;

            if (!isNaN(transformValue)) {
              switch (input.calculationSource.transform) {
                case "multiply":
                  calculatedValue *= transformValue;
                  break;
                case "add":
                  calculatedValue += transformValue;
                  break;
                case "subtract":
                  calculatedValue -= transformValue;
                  break;
              }
            }
          }
        }
      }

      return (
        <Field
          label={
            <Flex gap={2} alignItems="center">
              <Text>{input.label}</Text>
              {input.required && <Badge colorPalette="red">Required</Badge>}
            </Flex>
          }
          invalid={!!errors[input.name]}
          errorText={errors[input.name]?.message?.toString()}
          width="full"
        >
          <VStack gap={2} w="full">
            {input.dataTitle && (
              <Flex alignItems="center" gap={2} w="full">
                <Text fontSize="sm" fontWeight="medium">
                  {input.dataTitle}
                </Text>
                {input.tip && (
                  <HoverCardRoot>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="ghost"
                        size="xs"
                        h="4"
                        w="4"
                        p="0"
                      >
                        <HelpCircle size={16} />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <Text fontSize="sm">
                        {input.tip}
                      </Text>
                    </HoverCardContent>
                  </HoverCardRoot>
                )}
              </Flex>
            )}
            <Box 
              bg="muted" 
              borderRadius="md" 
              w="full"
            >
              <Controller
                name={input.name}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    readOnly
                    value={calculatedValue !== null 
                      ? calculatedValue.toFixed(2)
                      : "Waiting for input value..."
                    }
                    width="full"
                  />
                )}
              />
            </Box>
          </VStack>
        </Field>
      );
    }

    case "action":
      return (
        <Button
          type={input.actionType === "submit" ? "submit" : "button"}
          variant={input.actionType === "submit" ? "solid" : "outline"}
          w="full"
          justifyContent="center"
          onClick={() => {
            switch (input.actionType) {
              case "submit":
                // Form will be submitted automatically since type="submit"
                break;
              case "reset":
                onReset();
                toast({
                  title: "Form Reset",
                  description: "Form values have been reset to defaults",
                  type: "info"
                });
                break;
            }
          }}
        >
          {input.label}
        </Button>
      );

    default:
      return (
        <Field
          label={
            <Flex gap={2} alignItems="center">
              <Text>{input.label}</Text>
              {input.required && <Badge colorPalette="red">Required</Badge>}
            </Flex>
          }
          invalid={!!errors[input.name]}
          errorText={errors[input.name]?.message?.toString()}
          width="full"
        >
          <Input 
            {...register(input.name)}
            width="full"
          />
        </Field>
      );
  }
}; 