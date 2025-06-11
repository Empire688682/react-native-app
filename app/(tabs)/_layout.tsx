import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

export default function RootLayout() {
    return <Tabs screenOptions={{tabBarActiveTintColor:"green", tabBarActiveBackgroundColor:"coral", headerTitleAlign:"left"}}>
        <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({color})=><Feather name="home" size={24} color={color} /> }} />
        <Tabs.Screen name="login" options={{ title: "Login", tabBarIcon: ({color})=> <AntDesign name="login" size={24} color={color} /> }} />
        <Tabs.Screen name="about" options={{ title: "About", tabBarIcon: ({color}) => <Entypo name="info-with-circle" size={24} color={color} /> }} />
    </Tabs>;
}

