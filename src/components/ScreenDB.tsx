import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { getDynamicStack } from '@tools/naviHook'
import { DataBaseMain, MainScreen, TestScreen, DataBaseOp, BossActLine, ActionLine, SAMainScreen, ArrangeScreen, BackStageScreen, ManageScreen } from '@tools/route'

const Stack = getDynamicStack()

export function ScreenDB() {
    return (
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'rgba(246, 253, 255, 1)' } }}>
            {/* <Stack.Screen name='Main' component={ MainScreen } options={{ title: 'MainTitle', headerStyle: { backgroundColor: 'rgba(246, 253, 255, 1)' } }}></Stack.Screen>
            <Stack.Screen name='DataBaseMain' component={ DataBaseMain }></Stack.Screen>
            <Stack.Screen name='DataBaseOp' component={ DataBaseOp }></Stack.Screen>
            <Stack.Screen name='TestScreen' component={ TestScreen }></Stack.Screen>
            <Stack.Screen name='BossActLine' component={ BossActLine }></Stack.Screen>
            <Stack.Screen name='ActionLine' component={ ActionLine }></Stack.Screen> */}
            <Stack.Screen name='SAMainScreen' component={ SAMainScreen }></Stack.Screen>
            <Stack.Screen name='ArrangeScreen' component={ ArrangeScreen }></Stack.Screen>
            <Stack.Screen name='BackStageScreen' component={ BackStageScreen }></Stack.Screen>
            <Stack.Screen name='ManageScreen' component={ ManageScreen }></Stack.Screen>
        </Stack.Navigator>
        
    )
}
