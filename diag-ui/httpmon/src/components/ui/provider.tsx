"use client";

import { useEffect } from 'react';
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

import { Provider as ReduxProvider } from 'react-redux';
import store from '../../store/store';
import { startSignalR } from '../../store/messagesSlice';

export function Provider(props: ColorModeProviderProps) {
  useEffect(() => {
    // start the SignalR connection once on mount
    // dispatch directly from the store to avoid needing hooks here
    store.dispatch(startSignalR());
  }, []);

  return (
    <ReduxProvider store={store}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </ReduxProvider>
  );
}
