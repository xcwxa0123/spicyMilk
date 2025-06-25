import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider, Realm } from '@realm/react'
import { ScreenDB } from '@components/ScreenDB';
import { ArrangeList, ArrangePeople, ArrangePosition } from '@tools/zeroExport'
import 'react-native-get-random-values';


// const schemaContainer = [Main]
// const schemaContainer = [Main, DungeonCategory]
// const schemaContainer = [Main, DungeonCategory, TimeLineSum]
const schemaContainer = [ArrangeList, ArrangePeople, ArrangePosition]

function RootStack() {
    return (
        <ScreenDB></ScreenDB>
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
