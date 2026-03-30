import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { apiConfig } from './config';
import { DraftFullResponse } from './draftQueries';

interface UseDraftSocketOptions {
  draftId: string | undefined;
  token: string | null;
}

interface UseDraftSocketResult {
  draftState: DraftFullResponse | null;
  isConnected: boolean;
  error: string | null;
  isComplete: boolean;
  connectedUserIds: number[];
  submitPick: (playerId: number, userTeamId: number) => void;
}

export function useDraftSocket({ draftId, token }: UseDraftSocketOptions): UseDraftSocketResult {
  const socketRef = useRef<Socket | null>(null);
  const [draftState, setDraftState] = useState<DraftFullResponse | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [connectedUserIds, setConnectedUserIds] = useState<number[]>([]);

  useEffect(() => {
    if (!draftId || !token) return;

    const socket = io(`${apiConfig.baseUrl}/draft`, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      socket.emit('joinDraft', { draftId });
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('draftState', (state: DraftFullResponse) => {
      setDraftState(state);
      if (state.draft.status === 'COMPLETED') setIsComplete(true);
    });

    socket.on('draftUpdate', (state: DraftFullResponse) => {
      setDraftState(state);
    });

    socket.on('draftComplete', (state: DraftFullResponse) => {
      setDraftState(state);
      setIsComplete(true);
    });

    socket.on('draftError', ({ message }: { message: string }) => {
      setError(message);
      setTimeout(() => setError(null), 4000);
    });

    socket.on('presenceUpdate', ({ connectedUserIds: ids }: { connectedUserIds: number[] }) => {
      setConnectedUserIds(ids);
    });

    socket.on('connect_error', (err) => {
      setError(`Erro de conexão: ${err.message}`);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [draftId, token]);

  const submitPick = (playerId: number, userTeamId: number) => {
    if (!socketRef.current || !draftId) return;
    socketRef.current.emit('submitPick', { draftId, playerId, userTeamId });
  };

  return { draftState, isConnected, error, isComplete, connectedUserIds, submitPick };
}
