import { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import useNotification from '../hooks/useNotification';
import SpinningLoader from '../components/loaders/SpinningLoader';
import RetryButton from '../components/buttons/RetryButton';
import services from '../services';

const UserScreen = ({ route }) => {
   const { userId } = route.params;
   const { notify, notificationTypes } = useNotification();

   const [loading, setLoading] = useState(true);
   const [userInfo, setUserInfo] = useState(null);

   const getUserInfo = async () => {
      try {
         setLoading(true);

         const info = await services.getUserInfo(userId);
         setUserInfo(info);
      } catch {
         notify("Whoops, couldn't get profile...", notificationTypes.error);
         setUserInfo(null);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getUserInfo();
   }, [userId]);

   // TODO: create a skeleton loader / placeholder ui of the user screen to display instead of just a spinning loader
   return (
      <View className="flex-1 bg-palette-90">
         {!loading && userInfo && (
            <View className="top-0 items-center">
               <Text className="font-monaspace text-palette-40 text-[15px] my-1.5">/* user profile */</Text>
               <ScrollView className="w-full px-4" contentContainerStyle={{ paddingBottom: 210 }}>
                  <Text className="font-monaspace text-palette-40 text-[10px] leading-normal">{JSON.stringify(userInfo, null, 2)}</Text>
               </ScrollView>
            </View>
         )}

         {loading && !userInfo && (
            <View className="flex-1 justify-center items-center">
               <SpinningLoader tintColor="#E36526" />
            </View>
         )}

         {!userInfo && !loading && (
            <View className="flex-1 items-center justify-center">
               <Text className="font-monaspace text-palette-40 text-[15px] mb-1.5">Something went wrong.</Text>
               <Text className="font-monaspace text-palette-40 text-[12px] leading-normal">{`"Never send a human to do a machine's job"
~ Agent Smith`}</Text>

               <RetryButton onPress={getUserInfo} />
            </View>
         )}
      </View>
   );
};

export default UserScreen;
