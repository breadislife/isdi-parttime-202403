import { create } from 'zustand';

export const useTrackStore = create(set => ({
   currentTrackId: null,
   playRequest: null,

   // Sets a new current track id
   setCurrentTrackId: id => set({ currentTrackId: id }),

   // Sets a new play request 'id'
   setPlayRequest: id => set({ playRequest: id })
}));
