import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/auth';
import { LandingScreen, EmailInputScreen, PasswordInputScreen, UsernameInputScreen, LoadingScreen } from '../screens';
import DrawerNavigator from '../navigation/DrawerNavigator';
import BackButton from '../components/buttons/BackButton';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
   const { isLoading, userToken, isSignout } = useAuthStore();

   return (
      <Stack.Navigator
         screenOptions={{
            headerStyle: { backgroundColor: '#1B1A1A' },
            headerShadowVisible: false,
            headerLeft: () => <BackButton />,
            animation: 'fade',
            animationDuration: 200
         }}
      >
         {isLoading ? (
            // isLoading ? Show loading screen : Check for user token && do other things..
            <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
         ) : userToken == null ? (
            // No token found, user isn't signed in
            <>
               <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false, animationTypeForReplace: isSignout ? 'pop' : 'push' }} />
               <Stack.Screen name="EmailInput" component={EmailInputScreen} options={{ title: '' }} />
               <Stack.Screen name="PasswordInput" component={PasswordInputScreen} options={{ title: '' }} />
               <Stack.Screen name="UsernameInput" component={UsernameInputScreen} options={{ title: '' }} />
            </>
         ) : (
            // User is signed in
            <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
         )}
      </Stack.Navigator>
   );
};

export default StackNavigator;
