import { Text, View } from 'react-native';
import { Button } from '@react-navigation/elements';
import { ROUTE } from '@assets/route'
import { getNavigation } from '@tools/naviHook'

export function ActionLine() {
    const navigation = getNavigation();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Action Line</Text>
            <Button onPress={ () => navigation.popTo(ROUTE.MAIN) }>to MAIN</Button>
        </View>
    )
}