import { Text, View, SectionList, StyleSheet, StatusBar } from 'react-native';
import { Button } from '@react-navigation/elements';
import { useState } from 'react';
import { ROUTE } from '@assets/route'
import { getNavigation } from '@tools/naviHook'
import { useRealm } from '@realm/react';

export function DataBaseMain() {
    const navigation = getNavigation();
    // const routeList = navigation.getState().routes;
    // const prevPageIndex = routeList.findIndex(r => r.name === ROUTE.MAIN)
    // if(prevPageIndex) {
    //     navigation.pop(prevPageIndex + 1 - routeList.length)
    // }
    const realm = useRealm()
    const [schemaNameList, setSchemaNameList] = useState(realm.schema.map(s => s.name));
    // function getDataBase() {
    //     console.log(realm.schema)
    // }
    // function goToDataBase(dbName: string) {
    //     navigation.navigate(ROUTE.DATABASEOP, { dbName })
    // }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {schemaNameList.map((schemaName) => (
                <Button style={styles.item} key={schemaName} onPress={() => navigation.navigate(ROUTE.DATABASEOP, { dbName: schemaName })}>{schemaName}</Button>
                // <Text key={ schemaName }>{ schemaName }</Text>
            ))}
            {/* <Button onPress={ () => getDataBase() }>see see database</Button>
            <Button onPress={ () => navigation.replace(ROUTE.MAIN) }>to MAIN</Button> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    item: {
        //   backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
    },
    header: {
        fontSize: 32,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
    },
});