import { create } from 'zustand';

export const useTrackStore = create(set => ({
   currentTrackId: null,

   // Sets a new current track id if the new one is not equal to the old one
   setCurrentTrackId: id => set(s => s.currentTrackId !== id && { currentTrackId: id })
}));
