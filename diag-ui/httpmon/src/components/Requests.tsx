import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Accordion, Box, HStack, Tag, Text } from '@chakra-ui/react';
import { durationInMs, getDurationColor, getMethodColor, getStatusColor, toTimeString } from '../utils/stringutils';
import { Lock } from 'lucide-react';
import RequestItem from './RequestItem';

export const Requests: React.FC = () => {
  const groupedByAuthority = useSelector((s: RootState) => s.messages.items ?? {});
  const authorityKeys = Object.keys(groupedByAuthority).sort((a, b) => a.localeCompare(b));

  return (
    <Box as="section" w={{ base: '95%', md: '80%' }} mx="auto" px={2}>
      <Accordion.Root collapsible>
        {authorityKeys.map((authority) => {
          const requests = groupedByAuthority[authority] ?? [];

          return (
            <Accordion.Item key={authority} value={authority}>
              <Accordion.ItemTrigger>
                <Box flex="1" textAlign="left">
                  <HStack gap={2}>
                    <Lock size={16} />
                    <Text fontWeight="thin">{authority}</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    {requests.length} request(s)
                  </Text>
                </Box>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>

              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  <Accordion.Root collapsible>
                    {requests.map((item, idx) => (
                      <Accordion.Item key={item.CorrelationId} value={item.CorrelationId}>
                        <Accordion.ItemTrigger>
                          <HStack flex="1" gap={3} minW={0} alignItems="center">
                            <Tag.Root
                              bg={getMethodColor(item.Method)}
                              size="sm"
                              variant="solid"
                              width={55}
                              minW={55}
                              justifyContent="center"
                            >
                              <Tag.Label>{item.Method}</Tag.Label>
                            </Tag.Root>

                            <Tag.Root size="sm" variant="solid" bg="gray.600" color="white">
                              <Tag.Label fontWeight='thin'>{toTimeString(item.RequestedAt)}</Tag.Label>
                            </Tag.Root>

                            <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" minW={0} fontWeight='thin'>
                              {item.Url}
                            </Box>

                            <Box marginLeft='auto' display="flex" gap={3} alignItems="center">
                              <Tag.Root
                                size="sm"
                                variant="solid"
                                bg={getDurationColor(item.Response?.RespondedAt && durationInMs(item.RequestedAt, item.Response.RespondedAt) || -1)}
                                borderRadius="full"
                                width="16px"
                                height="18px"
                                padding="0"
                                minW="72px"
                                justifyContent='center'
                              >
                                <Tag.Label>
                                  {`${item.Response?.RespondedAt && durationInMs(item.RequestedAt, item.Response.RespondedAt) || '-'} ms`}
                                </Tag.Label>
                              </Tag.Root>

                              <Tag.Root
                                size="sm"
                                variant="solid"
                                bg={getStatusColor(item.Response?.StatusCode)}
                                borderRadius="full"
                                width="16px"
                                height="18px"
                                padding="0"
                                minW="28px"
                                justifyContent='center'
                              >
                                <Tag.Label>{item.Response?.StatusCode}</Tag.Label>
                              </Tag.Root>
                            </Box>
                          </HStack>
                          <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <RequestItem item={item} idx={idx} />
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </Box>
  );
};

export default Requests;
