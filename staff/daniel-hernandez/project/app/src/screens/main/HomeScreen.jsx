import { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import SpinningLoader from '../../components/loaders/SpinningLoader';
import RetryButton from '../../components/buttons/RetryButton';
import HomeTrackList from '../../components/lists/HomeTrackList';
import RefreshableScrollView from '../../components/RefreshableScrollView';
import { useTrackStore } from '../../store/track';
import useNotification from '../../hooks/useNotification';
import services from '../../services';

const HomeScreen = () => {
   const { notify, notificationTypes } = useNotification();

   const [loading, setLoading] = useState(true);
   const [curatedLists, setCuratedLists] = useState(null);
   const [recentPlays, setRecentPlays] = useState(null);

   useEffect(() => {
      getHomeData();
   }, []);

   const getHomeData = useCallback(async () => {
      try {
         setLoading(true);

         const [curatedResponse, recentResponse] = await Promise.all([services.getCuratedLists(), services.getRecentPlays()]);

         const { currentTrackId, currentPlaylistId } = useTrackStore.getState();

         // Determine if we should preserve playlistId
         let newPlaylistId;
         const currentTrackExists = recentResponse?.tracks.some(t => t.id === currentTrackId);

         if (currentPlaylistId?.startsWith('dynamic-') && currentTrackExists) {
            // Preserve playlist id if playing track still exists in new list
            newPlaylistId = currentPlaylistId;

            // Update playlist and index in store
            const newIndex = recentResponse.tracks.findIndex(t => t.id === currentTrackId);
            useTrackStore.setState({
               currentPlaylist: recentResponse.tracks,
               currentTrackIndex: newIndex
            });
         } else {
            // Generate new ID if track is gone or new session
            newPlaylistId = `dynamic-${Date.now().toString(36) + Math.random().toString(36).slice(2, 8)}`;
         }

         setRecentPlays({ ...recentResponse, id: newPlaylistId });
         setCuratedLists(curatedResponse);
      } catch {
         notify('Dang! failed to get home..', notificationTypes.error);

         // Reset state
         setCuratedLists(null);
         setRecentPlays(null);
      } finally {
         setLoading(false);
      }
   }, [notify]);

   return (
      <View className="flex-1 bg-palette-90">
         {!loading && curatedLists && recentPlays && (
            <RefreshableScrollView onRefresh={getHomeData} loading={loading}>
               <HomeTrackList items={recentPlays?.tracks} listTitle={'Recently Played Tracks'} emptyTitle={'Hmm..'} emptyBody={"Seems like you haven't played any tracks yet..."} playlistId={recentPlays.id} />
            </RefreshableScrollView>
         )}

         {loading && (!curatedLists || !recentPlays) && (
            <View className="flex-1 justify-center items-center">
               <SpinningLoader tintColor="#E36526" />
            </View>
         )}

         {(!curatedLists || !recentPlays) && !loading && (
            <View className="flex-1 items-center justify-center">
               <Text className="font-monaspace text-palette-40 text-[15px] mb-1.5">Something went wrong.</Text>
               <Text className="font-monaspace text-palette-40 text-[11px] leading-normal mx-10">We all fail. We all make mistakes. It's what makes us human.</Text>

               <RetryButton onPress={getHomeData} />
            </View>
         )}
      </View>
   );
};

export default HomeScreen;
