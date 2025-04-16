import { useNavigation, createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

import { RouteList } from '@assets/route';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export function getNavigation() {
    return useNavigation<NativeStackNavigationProp<RouteList>>();
}
export function getDynamicStack() {
    return createNativeStackNavigator<RouteList>() ;
};
export function getStaticStack() {
    // return createStaticNavigation<RouteList>();
}

export interface RouteProps {
    route: RouteProp<{ DataBaseOp: { [key: string]: any } }, 'DataBaseOp'>;
}
