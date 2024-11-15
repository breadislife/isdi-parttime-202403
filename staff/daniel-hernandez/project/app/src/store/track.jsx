import { create } from 'zustand';

export const useTrackStore = create(set => ({
   currentTrackId: null,
   playRequest: null,

   // Sets a new current track id if the new one is not equal to the old one
   setCurrentTrackId: id => set(s => s.currentTrackId !== id && { currentTrackId: id }),

   // Sets a new play request 'id'
   setPlayRequest: id => set({ playRequest: id })
}));
