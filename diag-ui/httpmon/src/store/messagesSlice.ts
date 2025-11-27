import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { createConnection } from '../ws/signalRService';
import type { HttpRequestData, HttpResponseData } from '../models/models';

export type MessagesState = {
  items: Record<string, HttpRequestData[]>;
  connected: boolean;
  lastError?: string | null;
};

const initialState: MessagesState = {
  items: {},
  connected: false,
  lastError: null,
};

export const startSignalR = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>(
  'messages/startSignalR',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const conn = createConnection();

      // Register handler before starting
      conn.on('ReceiveDebugRequest', (message: HttpRequestData) => {
        dispatch(addMessage(message));
      });

      conn.on('ReceiveDebugResponse', (message: HttpResponseData) => {
        dispatch(addResponse(message));
      });

      conn.onclose((err) => {
        dispatch(setConnected(false));
        if (err) dispatch(setLastError(String(err)));
      });

      await conn.start();
      dispatch(setConnected(true));
      return true;
    } catch (err: any) {
      dispatch(setConnected(false));
      return rejectWithValue(err?.toString?.() ?? String(err));
    }
  }
);

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<HttpRequestData>) {
      const msg = action.payload;
      const authority = msg.Authority ?? 'unknown';
      
      if (!state.items[authority]) state.items[authority] = [];
      const updated = [...state.items[authority], msg];
      
      state.items[authority] = updated.sort((a, b) => {
        const timeA = new Date(a.RequestedAt).getTime();
        const timeB = new Date(b.RequestedAt).getTime();
        const timeDiff = timeB - timeA;
        
        if (timeDiff !== 0) return timeDiff;
        return b.CorrelationId.localeCompare(a.CorrelationId);
      });
    },

    addResponse(state, action: PayloadAction<HttpResponseData>) {
      const resp = action.payload;
      let attached = false;

      for (const authority of Object.keys(state.items)) {
        const idx = state.items[authority].findIndex(
          r => r.CorrelationId === resp.CorrelationId
        );
        if (idx >= 0) {
          state.items[authority][idx].Response = resp;
          attached = true;
          break;
        }
      }

      if (!attached) {
        const placeholder: HttpRequestData = {
          Method: 'UNKNOWN',
          Url: '',
          Authority: 'unknown',
          ContentType: resp.ContentType ?? '',
          ContentLength: resp.ContentLength?.toString() ?? '',
          Version: resp.Version ?? '',
          RequestedAt: resp.RespondedAt ?? new Date().toISOString(),
          Headers: {},
          Response: resp,
          CorrelationId: resp.CorrelationId,
        };
        if (!state.items['unknown']) state.items['unknown'] = [];
        state.items['unknown'].push(placeholder);
      }
    },

    clearMessages(state) {
      state.items = {};
    },

    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },

    setLastError(state, action: PayloadAction<string | null>) {
      state.lastError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startSignalR.rejected, (state, action) => {
      state.lastError = (action.payload as string) ?? 'Failed to start SignalR';
      state.connected = false;
    });
  },
});

export const {
  addMessage,
  addResponse,
  clearMessages,
  setConnected,
  setLastError,
} = slice.actions;

export default slice.reducer;