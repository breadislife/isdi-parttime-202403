import Config from 'react-native-config';
import { useEffect, useReducer, useMemo, useState, useRef } from 'react';
import { StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import StackNavigator from './navigation/StackNavigator';
import usePlayer from './hooks/usePlayer';
import { Context } from './hooks/useContext';
import AuthContext from './context/AuthContext';
import { RouteTitleProvider } from './context/RouteTitleContext';
import ToastNotification from './components/ToastNotification';
import services, { storage } from './services';
import validate from 'com/validation';
import { InvalidArgumentError } from 'com/errors';

// TODO:
//       check react-native-track-player to see if there is support for the new architecture (already on proper react-native and react versions)
//       all packages are supported except react-native-track-player (to enable the new architecture react-native-track-player must support it)
//
//       when support is added for the new architecture and we enable it:
//          upgrade mmkv to the latest version @3.x.x
//          replace onLayout with useLayoutEffect to avoid visual jumping (already avoided but this would be a cleaner aproach)
//

const App = () => {
   const { setup } = usePlayer();
   const [message, setMessage] = useState('');
   const [type, setType] = useState('wrong');

   const notificationTimeoutRef = useRef(null);
   const isNotificationActive = useRef(false);

   // TODO: Make duration customizable ? (depending on errors)
   const notify = (m, t) => {
      if (isNotificationActive.current) return;
      setMessage('');

      const validTypes = ['info', 'success', 'warning', 'error', 'default'];
      if (!validTypes.includes(t)) throw new InvalidArgumentError('Invalid ToastNotification type');

      setType(t);
      setMessage(m);

      isNotificationActive.current = true;
      notificationTimeoutRef.current = setTimeout(() => {
         isNotificationActive.current = false;
         setMessage('');
      }, 3600);
   };

   const [state, dispatch] = useReducer(
      (prevState, action) => {
         switch (action.type) {
            case 'RESTORE_TOKEN':
               return { ...prevState, userToken: action.token, isLoading: false };
            case 'SIGN_IN':
               return { ...prevState, isSignout: false, userToken: action.token };
            case 'SIGN_OUT':
               return { ...prevState, isSignout: true, userToken: null };
            default:
               return prevState;
         }
      },
      { isLoading: true, isSignout: false, userToken: null }
   );

   useEffect(() => {
      (async () => {
         let userToken;

         try {
            userToken = await SecureStore.getItemAsync(Config.USER_TOKEN_KEY);
         } catch {
            notify('Token restore failed', 'warning');
            return;
         }

         try {
            // Setup track player
            await setup();
         } catch {
            notify('Player setup failed', 'warning');
            return;
         }

         if (userToken) {
            try {
               validate.token(userToken);
            } catch {
               try {
                  await SecureStore.deleteItemAsync(Config.USER_TOKEN_KEY);
                  storage.clearAll();
               } catch {
                  notify('Failed to clear token', 'error');
                  return;
               }
               dispatch({ type: 'SIGN_OUT' });
               return;
            }

            // TODO: Fetch user preferences/settings & store them in mmkv storage
         }

         notify('Session restore successful', 'info');
         dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      })();
   }, []);

   // TODO: Make context more managable with utility functions
   const authContext = useMemo(
      () => ({
         signIn: async data => {
            let token;

            try {
               token = await services.signIn(data.email, data.password);
            } catch (e) {
               if (e.message === 'Wrong password') {
                  notify('Wrong password', 'warning');
               } else {
                  notify('Something went wrong signing in', 'error');
               }

               return false;
            }

            try {
               await SecureStore.setItemAsync(Config.USER_TOKEN_KEY, token);
            } catch {
               notify('Something went wrong signing in', 'error');
               return false;
            }

            dispatch({ type: 'SIGN_IN', token });
            return true;
         },
         signOut: async () => {
            let token;

            try {
               token = await SecureStore.getItemAsync(Config.USER_TOKEN_KEY);
            } catch {
               notify('Oops. Something went wrong', 'error');
               return;
            }

            if (token) {
               try {
                  validate.token(token); // log validation ?
               } catch {
                  try {
                     await SecureStore.deleteItemAsync(Config.USER_TOKEN_KEY);
                     storage.clearAll();
                  } catch {
                     notify('Failed to clear token', 'error');
                     return;
                  }
                  dispatch({ type: 'SIGN_OUT' });
                  return;
               }

               try {
                  await services.signOut(token);
               } catch (e) {
                  // TODO: Improve error handling here.
                  if (e.message !== "User doesn't exist") {
                     notify('Oops. Something went wrong signing out', 'error');
                     return;
                  }
               }
            }

            try {
               await SecureStore.deleteItemAsync(Config.USER_TOKEN_KEY);
               storage.clearAll();
            } catch {
               notify("Oops. Couldn't sign you out");
               return;
            }

            dispatch({ type: 'SIGN_OUT' });
         },
         signUp: async data => {
            let token;

            try {
               await services.signUp(data.email, data.password, data.username);
            } catch (e) {
               if (e.message === 'User already exists') {
                  notify('Username already exists', 'warning');
               } else {
                  notify('Sign up failed; Try again later', 'error');
               }

               return false;
            }

            try {
               token = await services.signIn(data.email, data.password);
            } catch {
               notify("Couldn't sign you in; Try again later", 'error');
               return false;
            }

            try {
               await SecureStore.setItemAsync(Config.USER_TOKEN_KEY, token);
            } catch {
               notify('Sign up failed; Try again later', 'error');
               return false;
            }

            dispatch({ type: 'SIGN_IN', token });
            return true;
         },
         checkEmail: async data => {
            let bool;

            try {
               bool = await services.checkEmail(data.email);
            } catch {
               notify('Something went wrong. Try again later', 'error');
               return null;
            }

            return bool;
         }
      }),
      []
   );

   // TODO: Make error handling more centralized ?
   // Maybe with a error boundary or error logging system ?

   return (
      <Context.Provider value={{ notify }}>
         <AuthContext.Provider value={authContext}>
            <RouteTitleProvider>
               {message !== '' && <ToastNotification message={message} type={type} />}
               <StackNavigator state={state} />
               <StatusBar barStyle="light-content" backgroundColor="#1B1A1A" />
            </RouteTitleProvider>
         </AuthContext.Provider>
      </Context.Provider>
   );
};

export default App;
