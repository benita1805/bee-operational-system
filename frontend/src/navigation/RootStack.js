import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "./Tabs";

import FarmerChatScreen from "../screens/Farmers/FarmerChatScreen";
import FarmerRegisterScreen from "../screens/Farmers/FarmerRegisterScreen";

import HiveDetailScreen from "../screens/Hives/HiveDetailScreen";
import HiveFormScreen from "../screens/Hives/HiveFormScreen";

const Stack = createStackNavigator();

export default function RootStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="FarmerRegister" component={FarmerRegisterScreen} />
            <Stack.Screen name="FarmerChat" component={FarmerChatScreen} />

            <Stack.Screen name="HiveForm" component={HiveFormScreen} />
            <Stack.Screen name="HiveDetail" component={HiveDetailScreen} />
        </Stack.Navigator>
    );
}
