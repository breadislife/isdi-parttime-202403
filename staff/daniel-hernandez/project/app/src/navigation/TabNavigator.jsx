import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { TabIcons } from '../../assets/images/icons';
import { HomeScreen, SearchScreen, LibraryScreen } from '../screens';
import FloatingPlayer from '../components/FloatingPlayer';
import BaseStack from './BaseStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
   <>
      <FloatingPlayer />
      <Tab.Navigator
         screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
               let iconSource;
               if (route.name === 'HomeTab') {
                  iconSource = focused ? TabIcons.homeIconActive : TabIcons.homeIcon;
               } else if (route.name === 'SearchTab') {
                  iconSource = focused ? TabIcons.glassIconActive : TabIcons.glassIcon;
               } else if (route.name === 'LibraryTab') {
                  iconSource = focused ? TabIcons.folderIconActive : TabIcons.folderIcon;
               }

               return <Image source={iconSource} style={{ width: size - 3.8, height: size - 3.8, tintColor: color, marginTop: 5 }} />;
            },
            tabBarActiveTintColor: '#E36526',
            tabBarInactiveTintColor: '#A0908A',
            tabBarShowLabel: false,
            tabBarStyle: { position: 'absolute', borderTopWidth: 0, borderTopColor: 'transparent', backgroundColor: 'transparent', height: 80 },
            tabBarBackground: () => <BlurView tint="dark" intensity={95} className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden rounded-r-xl rounded-l-xl" />
         })}
      >
         <Tab.Screen name="HomeTab">{() => <BaseStack name="HomeScreen" component={HomeScreen} title="こんにちは, User." />}</Tab.Screen>
         <Tab.Screen name="SearchTab">{() => <BaseStack name="SearchScreen" component={SearchScreen} title="Search." />}</Tab.Screen>
         <Tab.Screen name="LibraryTab">{() => <BaseStack name="LibraryScreen" component={LibraryScreen} title="Library." />}</Tab.Screen>
      </Tab.Navigator>
   </>
);

export default TabNavigator;
