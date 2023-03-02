import SongRequest from '../songRequest/SongRequest';

export interface PlayerState {
  requestId: string;
  endOfList: boolean;
  version: number;
}

export const newPlayerState = (songReq: SongRequest, version: number) => ({
  requestId: songReq.id,
  endOfList: false,
  version,
});

export const updatePlayerState = (
  oldState: PlayerState,
  songReq: SongRequest
) => ({
  requestId: songReq.id,
  endOfList: false,
  version: oldState.version + 1,
});
