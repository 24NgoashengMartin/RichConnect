import { AppRegistry } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import StudentDashboard from './screens/StudentDashboard';
import BusinessDashboard from './screens/BusinessDashboard';
import AdminDashboard from './screens/AdminDashboard';
import ProfileScreen from './screens/ProfileScreen';
import JobsScreen from './screens/JobsScreen';
import ChatScreen from './screens/ChatScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import PostJobScreen from './screens/PostJobScreen'; 
import PendingApproval from './screens/PendingApproval';
import SearchScreen from './screens/SearchScreen';
import ConnectionsScreen from './screens/ConnectionsScreen';
import MessagingScreen from './screens/MessagingScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AlumniVerification from './screens/AlumniVerification';
import FeedScreen from './screens/FeedScreen';
import SettingsScreen from './screens/SettingsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import CVUploadScreen from './screens/CVUploadScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileCompletenessScreen from './screens/ProfileCompletenessScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="BusinessDashboard" component={BusinessDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Jobs" component={JobsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        <Stack.Screen name="PostJob" component={PostJobScreen} />
        <Stack.Screen name="PendingApproval" component={PendingApproval} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Connections" component={ConnectionsScreen} />
        <Stack.Screen name="Messaging" component={MessagingScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="AlumniVerification" component={AlumniVerification} />
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="CVUpload" component={CVUploadScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ProfileCompleteness" component={ProfileCompletenessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => App);
export default App;