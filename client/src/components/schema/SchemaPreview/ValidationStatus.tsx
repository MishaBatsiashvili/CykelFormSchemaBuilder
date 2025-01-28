import { Box, Text } from "@chakra-ui/react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Tooltip } from "@/components/chakra/tooltip";
import { ValidationStatusProps } from "./types";

export function ValidationStatus({ constraints }: ValidationStatusProps) {
  const isValid = constraints.length === 0;

  return (
    <Tooltip 
      showArrow
      disabled={isValid}
      content={
        <Box>
          <Text fontWeight="medium" mb={2}>Unfulfilled Constraints:</Text>
          <Box as="ul" pl={4}>
            {constraints.map((constraint, index) => (
              <Box as="li" key={index} fontSize="sm">
                {constraint}
              </Box>
            ))}
          </Box>
        </Box>
      }
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        px={3}
        py={1}
        my={4}
        borderRadius="md"
        fontSize="sm"
        bg={isValid ? "green.100" : "red.100"}
        color={isValid ? "green.700" : "red.700"}
        cursor={"pointer"}
      >
        {isValid ? (
          <>
            <CheckCircle2 style={{ width: '1rem', height: '1rem' }} />
            <Text>Valid Schema</Text>
          </>
        ) : (
          <>
            <AlertCircle style={{ width: '1rem', height: '1rem' }} />
            <Text>Invalid Schema</Text>
          </>
        )}
      </Box>
    </Tooltip>
  );
} 