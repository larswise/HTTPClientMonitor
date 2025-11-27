import type { HttpRequestData } from "@/models/models";
import { getMethodColor, getStatusColor } from "../utils/stringutils";
import { Accordion, Box, Table, Text } from "@chakra-ui/react";
import { ArrowLeftIcon, ArrowRightIcon, CopyIcon } from "lucide-react";
import { toaster } from "../components/ui/toaster"

const RequestItem = ({ item }: { item: HttpRequestData, idx: number }) => {
  const copyValue = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toaster.create({
          description: "Value copied to clipboard",
          type: "info",
        })
    });
  };

  return <Accordion.ItemContent>
    <Accordion.ItemBody>
      <Box display="flex" width="100%">
        <Box
          width="3px"
          bg="yellow.600"
          borderRadius="md"
          mr={2}
          ml={1}
        />
        <Box flex="1" minWidth="0">
          {/* Request Section */}
          <Box display="flex" mb={4}>
            <Box
              width="3px"
              bg={getMethodColor(item.Method)}
              borderRadius="md"
              mr={2}
            />
            <Box width="32px"><div title="HTTP Request"><ArrowRightIcon /></div></Box>
            <Box flex="1" minWidth="0">
              <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4} mb={4} p={3} bg="gray.50" borderRadius="md" _dark={{ bg: "gray.800" }}>
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">Content Type</Text>
                  <Text fontSize="sm" fontFamily="mono">{item.ContentType || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">Content Length</Text>
                  <Text fontSize="sm" fontFamily="mono">{item.ContentLength || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">Version</Text>
                  <Text fontSize="sm" fontFamily="mono">{item.Version || 'N/A'}</Text>
                </Box>
              </Box>

              <Text fontSize="sm" fontWeight="semibold" mb={2} textAlign="left">Request Headers</Text>
              <Table.Root size="sm" variant="line" bg="transparent">
                <Table.Header bg="transparent">
                  <Table.Row bg="transparent" borderBottomWidth="2px">
                    <Table.ColumnHeader width="25%" bg="transparent">Name</Table.ColumnHeader>
                    <Table.ColumnHeader bg="transparent">Value</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body bg="transparent">
                  {Object.entries(item.Headers || {}).map(([key, value]) => (
                    <Table.Row key={key} bg="transparent" borderBottomWidth="2px" borderBottomColor="gray.400" _dark={{ borderBottomColor: "#71717a12" }}>
                      <Table.Cell width="25%">
                        <Text fontFamily="mono" fontSize="sm">{key}</Text>
                      </Table.Cell>
                      <Table.Cell maxWidth="0">
                        <Box display="flex" alignItems="center" gap={2} width="100%">
                          <Text 
                            fontFamily="mono" 
                            fontSize="sm"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            flex="1"
                            minWidth="0"
                          >
                            {value}
                          </Text>
                          <Box 
                            flexShrink={0}
                            cursor="pointer"
                            opacity={0.6}
                            _hover={{ opacity: 1 }}
                            transition="opacity 0.2s"
                          >
                            <CopyIcon size={16} onClick={() => copyValue(value)} />
                          </Box>
                        </Box>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>

          {/* Response Section */}
          {item.Response && (
            <Box display="flex">
              <Box
                width="3px"
                bg={getStatusColor(item.Response.StatusCode)}
                borderRadius="md"
                mr={2}
              />
              <Box width="32px"><div title="HTTP Response"><ArrowLeftIcon /></div></Box>
              <Box flex="1" minWidth="0">
                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={4} mb={4} p={3} bg="gray.50" borderRadius="md" _dark={{ bg: "gray.800" }}>
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">Content Type</Text>
                    <Text fontSize="sm" fontFamily="mono">{item.Response.ContentType || 'N/A'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">Content Length</Text>
                    <Text fontSize="sm" fontFamily="mono">{item.Response.ContentLength || 'N/A'}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">Version</Text>
                    <Text fontSize="sm" fontFamily="mono">{item.Response.Version || 'N/A'}</Text>
                  </Box>
                </Box>

                <Text fontSize="sm" fontWeight="semibold" mb={2} textAlign="left">Response Headers</Text>
                <Table.Root size="sm" variant="line" bg="transparent">
                  <Table.Header bg="transparent">
                    <Table.Row bg="transparent" borderBottomWidth="2px">
                      <Table.ColumnHeader width="25%" bg="transparent">Name</Table.ColumnHeader>
                      <Table.ColumnHeader bg="transparent">Value</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body bg="transparent">
                    {Object.entries(item.Response?.ResponseHeaders || {}).map(([key, value]) => (
                      <Table.Row key={key} bg="transparent" borderBottomWidth="2px" borderBottomColor="gray.900" _dark={{ borderBottomColor: "#71717a12" }}>
                        <Table.Cell width="25%">
                          <Text fontFamily="mono" fontSize="sm">{key}</Text>
                        </Table.Cell>
                        <Table.Cell maxWidth="0">
                          <Box display="flex" alignItems="center" gap={2} width="100%">
                            <Text 
                              fontFamily="mono"
                              fontSize="sm"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              flex="1"
                              minWidth="0"
                            >
                              {value}
                            </Text>
                            <Box 
                              flexShrink={0}
                              cursor="pointer"
                              opacity={0.6}
                              _hover={{ opacity: 1 }}
                              transition="opacity 0.2s"
                            >
                              <CopyIcon size={16} onClick={() => copyValue(value)} />
                            </Box>
                          </Box>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

    </Accordion.ItemBody>
  </Accordion.ItemContent>
};

export default RequestItem;