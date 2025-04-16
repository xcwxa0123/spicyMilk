import { Text, View } from 'react-native';
import { useEffect } from 'react';
import { getNavigation } from '@tools/naviHook'
import { Button } from '@react-navigation/elements';
import { ROUTE } from '@assets/route'
import { initTable } from '@tools/initTable'

export function MainScreen() {
    initTable()
    const navigation = getNavigation();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Main Screen</Text>
            <Button onPress={() => navigation.navigate(ROUTE.DATABASEMAIN, { testParam: '1' })}>to 2</Button>
            <Button onPress={() => navigation.navigate(ROUTE.TESTSCREEN)}>to test</Button>
        </View>
    )
}

