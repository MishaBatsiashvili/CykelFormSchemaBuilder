import { Card } from "@chakra-ui/react";
import { useSchemaStore } from "@/store/schema";
import InputList from "../InputList/index";
import InputForm from "../InputForm/InputForm";
import { RunnableFormProps, OutputSettingsFormData } from "./types";
import { RunnableHeader } from "./RunnableHeader";

export default function RunnableForm({ runnable, schema }: RunnableFormProps) {
  const deleteRunnable = useSchemaStore((state) => state.deleteRunnable);
  const updateRunnable = useSchemaStore((state) => state.updateRunnable);

  const handleDelete = () => {
    deleteRunnable(runnable.path);
  };

  const handleUpdateOutput = (data: OutputSettingsFormData) => {
    updateRunnable({
      ...runnable,
      output: {
        dataTitle: data.dataTitle,
        tip: data.tip,
      },
    });
  };

  return (
    <Card.Root h="full" minH={0} overflow={'auto'}>
      <RunnableHeader
        runnable={runnable}
        onDelete={handleDelete}
        onUpdateOutput={handleUpdateOutput}
      />
      <Card.Body display="flex" flexDirection="column" gap={6}>
        <InputForm runnable={runnable} schema={schema} />
        <InputList runnable={runnable} schema={schema} />
      </Card.Body>
    </Card.Root>
  );
}

export * from './types'; 