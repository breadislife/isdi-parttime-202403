import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../components/Header';
import BackButton from '../components/buttons/BackButton';
import { UserScreen, PlaylistScreen, AlbumScreen } from '../screens';

const Base = createNativeStackNavigator();

const BaseStack = ({ name, component, title, options, props }) => (
   <Base.Navigator
      screenOptions={{
         headerStyle: { backgroundColor: '#1B1A1A' },
         headerTintColor: '#ECE3DC',
         headerShadowVisible: false,
         contentStyle: { backgroundColor: '#1B1A1A' }
      }}
   >
      <Base.Screen name={name} component={component} options={{ ...options, header: () => <Header title={title} /> }} {...props} />

      <Base.Screen name="UserScreen" component={UserScreen} options={{ headerTitle: '', headerLeft: () => <BackButton /> }} />
      <Base.Screen name="PlaylistScreen" component={PlaylistScreen} options={{ headerTitle: '', headerLeft: () => <BackButton /> }} />
      <Base.Screen name="AlbumScreen" component={AlbumScreen} options={{ headerTitle: '', headerLeft: () => <BackButton /> }} />
   </Base.Navigator>
);

export default BaseStack;
