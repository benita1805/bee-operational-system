import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import RootStack from "./src/navigation/RootStack";
import { setupNotifications } from "./src/services/notifications";

export default function App() {
    useEffect(() => {
        setupNotifications();
    }, []);

    return (
        <NavigationContainer>
            <RootStack />
        </NavigationContainer>
    );
}
