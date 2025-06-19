import { Tabs } from "expo-router";
import {MaterialIcons} from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function RootLayout() {
    return <Tabs screenOptions={{
        headerStyle:{backgroundColor:"#f5f5f5"},
        headerShadowVisible:false,
        headerTitleStyle:{
            alignItems:"center",
            fontWeight:"bold",
        },
        headerTitleAlign:"center",
        tabBarStyle:{
            backgroundColor:"#f5f5f5",
            borderTopWidth:0,
            elevation:0,
            shadowOpacity: 0
        },
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "#666666"
    }}>
        <Tabs.Screen name="index" options={{ title: "Today's Habit", tabBarIcon: ({color, size})=><MaterialIcons name="date-range" size={size} color={color} /> }} />
        <Tabs.Screen name="streaks" options={{ title: "Streaks", tabBarIcon: ({color})=> <AntDesign name="info" size={24} color={color} /> }} />
        <Tabs.Screen name="add-habit" options={{ title: "Add Habit", tabBarIcon: ({color})=> <AntDesign name="plus" size={24} color={color} /> }} />
    </Tabs>;
}

