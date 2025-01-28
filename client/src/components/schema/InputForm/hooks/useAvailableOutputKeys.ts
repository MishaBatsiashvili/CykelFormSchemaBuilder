import { useSchemaStore } from "@/store/schema";
import { Runnable, Input as SchemaInput } from "@/lib/schema";

export const useAvailableOutputKeys = () => {
  const schemaState = useSchemaStore((state) => state.history.present);

  const availableOutputKeys = schemaState.runnables
    .filter((r: Runnable) => r.type === "initial")
    .flatMap((r: Runnable) => r.inputs)
    .filter((i: SchemaInput): i is SchemaInput & { outputKey: string } => 
      typeof i.outputKey === 'string' && i.outputKey.length > 0
    )
    .map((i) => ({
      label: `${i.label} (${i.outputKey})`,
      value: i.outputKey,
    }));

  return {
    schemaState,
    availableOutputKeys
  };
}; 