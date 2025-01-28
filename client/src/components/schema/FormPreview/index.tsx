import React, { useState } from 'react';
import { Box } from "@chakra-ui/react";
import { FormPreviewProps } from './types';
import { RunnablePreviewForm } from './RunnablePreviewForm';

export default function FormPreview({ schema }: FormPreviewProps) {
  const [sharedValues, setSharedValues] = useState<Record<string, any>>({});

  return (
    <Box display="flex" flexDirection="column" h="full">
      <Box flex={1} overflowY="auto" py={4}>
        {schema.runnables.map((runnable) => (
          <RunnablePreviewForm
            key={runnable.path}
            runnable={runnable}
            sharedValues={sharedValues}
            onUpdateSharedValues={setSharedValues}
          />
        ))}
      </Box>
    </Box>
  );
}

export * from './types';
export * from './RunnablePreviewForm';
export * from './FormInputField'; 