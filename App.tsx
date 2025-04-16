import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { getDynamicStack } from '@tools/naviHook'
import { DataBaseMain, MainScreen, TestScreen, DataBaseOp } from '@assets/route'
import { RealmProvider, Realm } from '@realm/react'
import { Main, DungeonCategory, TimeLineSum } from '@tools/schemas/zeroExport'
import 'react-native-get-random-values';

const Stack = getDynamicStack()

// const schemaContainer = [Main]
// const schemaContainer = [Main, DungeonCategory]
const schemaContainer = [Main, DungeonCategory, TimeLineSum]

function RootStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'rgba(246, 253, 255, 1)' } }}>
            <Stack.Screen name='Main' component={ MainScreen } options={{ title: 'MainTitle' }}></Stack.Screen>
            <Stack.Screen name='DataBaseMain' component={ DataBaseMain }></Stack.Screen>
            <Stack.Screen name='DataBaseOp' component={ DataBaseOp }></Stack.Screen>
            <Stack.Screen name='TestScreen' component={ TestScreen }></Stack.Screen>
        </Stack.Navigator>
    )
}

function App(): React.JSX.Element {
    React.useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
    };

    return (
        <NavigationContainer>{/* Rest of your app code */}
            <RealmProvider schema={schemaContainer}>
                <RootStack></RootStack>
            </RealmProvider>
        </NavigationContainer>
    );
}

export default App;
