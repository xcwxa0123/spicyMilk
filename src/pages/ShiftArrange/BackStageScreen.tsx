import { ImageBackground, Text, View, Pressable, ScrollView, Alert } from 'react-native';
import { useCallback, useRef } from 'react';
import { getNavigation } from '@tools/naviHook'
import { RouteList } from '@tools/route'
import { getIconImage } from '@tools/initTable'
import { useLayoutEffect } from 'react';
import { RouteProp } from '@react-navigation/native';
import { useRealm } from '@realm/react';
import { ROUTE } from '@tools/route'
import { styles } from './css/ArrangeScreenCss'
import { ConfirmModal, ConfirmModalRef } from '@components/ArrangeScreen/ConfirmModal'

const [
    confirmModalRef
] = [
    useRef<ConfirmModalRef>(null),
]
const realm = useRealm()

type BackStageScreen = { route: RouteProp<RouteList, 'BackStageScreen'> }

export function BackStageScreen({ route }: BackStageScreen) {
    const navigation = getNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: {
                backgroundColor: 'rgba(254, 251, 244, 0.3)',
            },
            headerTintColor: '#rgba(0, 0, 0, 1)', // 文字/图标颜色
            headerShadowVisible: false,
        });
    }, [navigation]);
    
    let arrangeItemList = [
        { backgroundColor: 'rgba(248, 245, 236, 1)', positionName: '排班数据初始化', positionIndex: 0 },
        { backgroundColor: 'rgba(246, 246, 238, 1)', positionName: '人员管理', positionIndex: 1 },
        // ArrangePosition.generate('排班数据初始化', 999, 0, 'rgba(248, 245, 236, 1)', 0),
        // ArrangePosition.generate('人员管理', 999, 1, 'rgba(246, 246, 238, 1)', 1),
        // ArrangePosition.generate('职位管理', 999, 2, 'rgba(255, 248, 240, 1)', 2),
        // ArrangePosition.generate('清除所有数据', 999, 3, 'rgba(239, 239, 239, 1)', 0)
    ]

    const openMsg = useCallback(() => {
        confirmModalRef.current?.open()
    }, [])

    const delData = useCallback(() => {
        try {
            realm.write(() => {
                realm.delete(realm.objects('ArrangeList'))
            })
            Alert.alert("成功清除所有历史排班数据");
        } catch (error) {
            Alert.alert("失败，查看console");
            console.log('清理失败error================>', error)
        }
    }, [])

    const dataOprate = useCallback((item: any) => {
        console.log('item=========>', item)
        switch (item.positionIndex) {
            case 0:
                openMsg()
                break;
            case 1: // 人员管理
                try {
                    navigation.navigate(ROUTE.MANAGESCREEN, { manageType: 1, title: '人员管理' })
                    // Alert.alert("还没开发捏");
                } catch (error) {
                    Alert.alert("失败，查看console");
                    console.log('清理失败error================>', error)
                }
                break;
            case 2: // 职位管理
                try {
                    // Alert.alert("还没开发捏");
                    navigation.navigate(ROUTE.MANAGESCREEN, { manageType: 2, title: '职位管理' })
                } catch (error) {
                    Alert.alert("失败，查看console");
                    console.log('清理失败error================>', error)
                }
                break;
            case 3:
                try {
                    // realm.write(() => {
                    //     realm.delete(realm.objects('ArrangeList'))
                    // })
                    Alert.alert("还没开发捏");
                } catch (error) {
                    Alert.alert("失败，查看console");
                    console.log('清理失败error================>', error)
                }
                break;
        
        
            default:
                break;
        }
    }, [])

    return (
        <ImageBackground source={ getIconImage('backgroundImage') } resizeMode='cover' style={ styles.ibg }>
            <ConfirmModal
                confirmText={ `确定要清空所有历史数据吗？` }
                callBackFunc={ delData }
                data={ {} }
                ref={ confirmModalRef }
            ></ConfirmModal>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false} // 隐藏滚动条（可选）
            >
                <View style={ styles.topBanner }>
                    <Text style={ styles.topText }>后台管理</Text>
                </View>
                
                <View style={ styles.samList }>
                    {
                        arrangeItemList.map((item: any, index: number) => (
                            <Pressable
                                style={ ({ pressed }) => [styles.samItem, styles.samItemEdit, { backgroundColor: item.backgroundColor }, pressed && styles.samItemActive] }
                                key={ index }
                                onPress={() => dataOprate(item)}
                            >
                                <Text style={ styles.samItemText }>| { index + 1 } { item.positionName }</Text>
                                {/* <Image source={getIconImage(item.imgIndex)} resizeMode="contain" style={ styles.samItemIcon }></Image> */}
                            </Pressable>
                        ))
                    }
                </View>
            </ScrollView>
        </ImageBackground>
    )
}