import { ImageBackground, Text, View, Pressable, ScrollView } from 'react-native';
import { getNavigation } from '@tools/naviHook'
import { ROUTE } from '@tools/route'
import { initArrangeTable } from '@tools/initTable'
import { useLayoutEffect } from 'react';
import { styles } from './css/ArrangeScreenCss'
import { getIconImage } from '@tools/initTable'
export function SAMainScreen() {
    initArrangeTable()
    const navigation = getNavigation();
    useLayoutEffect(() => {
            navigation.setOptions({
                title: '',
                headerStyle: {
                    backgroundColor: 'rgba(254, 251, 244, 0.3)',
                },
                headerTintColor: '#fff', // 文字/图标颜色
                headerShadowVisible: false,
            });
        }, [navigation]);
    
    const arrangeItemList = [
        {
            itemName: '早晚课排班',
            positionType: 0,
            backgroundColor: 'rgba(248, 245, 236, 1)'
        },
        {
            itemName: '钟鼓排班',
            positionType: 1,
            backgroundColor: 'rgba(246, 246, 238, 1)'
        },
        {
            itemName: '斋堂排班',
            positionType: 2,
            backgroundColor: 'rgba(255, 248, 240, 1)'
        },
        {
            itemName: '后台管理',
            positionType: 999,
            backgroundColor: 'rgba(239, 239, 239, 1)'
        }
    ]

    return (
        <ImageBackground source={ getIconImage('backgroundImage') } resizeMode='cover' style={ styles.ibg }>
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false} // 隐藏滚动条（可选）
            >
                <Text style={ styles.topText }>排班工具</Text>
                <Text style={ styles.secondText }>选择一个项目进行排班</Text>
                <View style={ styles.samList }>
                    {
                        arrangeItemList.map((item, index) => (
                            <Pressable
                                style={ ({ pressed }) => [styles.samItem, { backgroundColor: item.backgroundColor }, pressed && styles.samItemActive] } 
                                key={ index } 
                                onPress={() => {
                                    switch (item.positionType) {
                                        case 999:
                                            return navigation.navigate(ROUTE.BACKSTAGESCREEN)
                                        default:
                                            return navigation.navigate(ROUTE.ARRANGESCREEN, { arrangeType: item.positionType, title: item.itemName })
                                    }
                                    
                                }}
                            >
                                <Text style={ styles.samItemText }>| { index + 1 } { item.itemName }</Text>
                                {/* <Image source={getIconImage(index)} resizeMode="contain" style={ styles.samItemIcon }></Image> */}
                            </Pressable>
                        ))
                    }
                </View>
            </ScrollView>
        </ImageBackground>
    )
}