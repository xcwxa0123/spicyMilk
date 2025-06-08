import { Text, View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { getNavigation } from '@tools/naviHook'
import { Button } from '@react-navigation/elements';
import { ROUTE } from '@assets/route'
import { initTable } from '@tools/initTable'

export function MainScreen() {
    initTable()
    const navigation = getNavigation();
    return (
        <View style={styles.view}>
            <Text>Main Screen</Text>
            <Button onPress={() => navigation.navigate(ROUTE.DATABASEMAIN, { testParam: '1' })}>to 2</Button>
            <Button onPress={() => navigation.navigate(ROUTE.TESTSCREEN)}>to test</Button>
        </View>
    )
}


const styles = StyleSheet.create({
    view: {
        // display: 'flex',
        // height: 10,
        flexWrap: 'nowrap',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        // flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'row',
        // flexDirection: 'row',
        // padding: 50
    },
});

// 