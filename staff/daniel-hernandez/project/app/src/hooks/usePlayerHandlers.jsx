import { trigger } from 'react-native-haptic-feedback';
import { usePlaybackState, useProgress, State, RepeatMode } from 'react-native-track-player';
import useNotification from './useNotification';
import usePlayer from './usePlayer';
import { useTrackStore } from '../store/track';

const usePlayerHandlers = () => {
   const { state: playbackState } = usePlaybackState();
   const { position, duration } = useProgress();
   const { notify, notificationTypes } = useNotification();
   const { play, seekTo, pause, restart, resume, skipToPrevious, skipToNext, getLoopMode, setLoopMode } = usePlayer();
   const { setPlayRequest } = useTrackStore();

   const handlePlayPause = async () => {
      trigger('impactLight');

      if (playbackState === State.Playing) {
         try {
            await pause();
         } catch {
            notify('wow... pausing the track failed.', notificationTypes.error);
         }
      } else if (playbackState === State.Paused || playbackState === State.Ready) {
         if (playbackState === State.Ended || parseInt(position) >= parseInt(duration) || (parseInt(position) / parseInt(duration)) * 100 === 100) {
            try {
               await restart();
            } catch {
               notify("couldn't restart the track.. 😅", notificationTypes.error);
            }
         }

         try {
            await resume();
         } catch {
            notify("oof, couldn't resume the track..", notificationTypes.error);
         }
      }
   };

   const handleSkipPrevious = async () => {
      trigger('impactLight');
      try {
         await skipToPrevious();
      } catch {
         notify('failed to skip to previous !', notificationTypes.error);
      }
   };

   const handleSkipNext = async () => {
      trigger('impactLight');
      try {
         await skipToNext();
      } catch {
         notify('failed to skip, sorry..', notificationTypes.error);
      }
   };

   const handleToggleLoop = async () => {
      trigger('impactLight');

      let currentLoopMode;
      try {
         currentLoopMode = await getLoopMode();
      } catch {
         notify('failed to get loop mode !', notificationTypes.error);
         return;
      }

      const newMode = currentLoopMode === RepeatMode.Off ? RepeatMode.Track : RepeatMode.Off;

      try {
         await setLoopMode(newMode);
      } catch {
         notify('failed to toggle loop mode sorry..', notificationTypes.error);
         return;
      }
   };

   const handleSeek = async position => {
      try {
         await seekTo(position);
      } catch {
         notify('failed to seek', notificationTypes.error);
      }
   };

   const handlePlay = async track => {
      try {
         const requestId = Date.now();
         setPlayRequest(requestId);

         await play(track, null, requestId);
      } catch (e) {
         if (e.message === 'AbortError') return;
         notify('oopsie-daisy! something went wrong..', notificationTypes.error);
         return;
      }
   };

   return { handlePlayPause, handleSkipPrevious, handleSkipNext, handleToggleLoop, handleSeek, handlePlay };
};

export default usePlayerHandlers;
