import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { getDynamicStack } from '@tools/naviHook'
import { DataBaseMain, MainScreen, TestScreen, DataBaseOp, BossActLine, ActionLine, SAMainScreen } from '@assets/route'
import { RealmProvider, Realm } from '@realm/react'
// import { Main, DungeonCategory, TimeLineSum } from '@tools/schemas/zeroExport'
import { ArrangeList, ArrangePeople, ArrangePosition } from '@tools/schemas/zeroExport'
import 'react-native-get-random-values';

const Stack = getDynamicStack()

// const schemaContainer = [Main]
// const schemaContainer = [Main, DungeonCategory]
// const schemaContainer = [Main, DungeonCategory, TimeLineSum]
const schemaContainer = [ArrangeList, ArrangePeople, ArrangePosition]

function RootStack() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'rgba(246, 253, 255, 1)' } }}>
            {/* <Stack.Screen name='Main' component={ MainScreen } options={{ title: 'MainTitle', headerStyle: { backgroundColor: 'rgba(246, 253, 255, 1)' } }}></Stack.Screen>
            <Stack.Screen name='DataBaseMain' component={ DataBaseMain }></Stack.Screen>
            <Stack.Screen name='DataBaseOp' component={ DataBaseOp }></Stack.Screen>
            <Stack.Screen name='TestScreen' component={ TestScreen }></Stack.Screen>
            <Stack.Screen name='BossActLine' component={ BossActLine }></Stack.Screen>
            <Stack.Screen name='ActionLine' component={ ActionLine }></Stack.Screen> */}
            <Stack.Screen name='SAMainScreen' component={ SAMainScreen }></Stack.Screen>
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
