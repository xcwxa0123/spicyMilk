import { ImageBackground, Image, Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { getNavigation } from '@tools/naviHook'
import { Button } from '@react-navigation/elements';
import { ROUTE } from '@tools/route'
import { initTable } from '@tools/initTable'
import { useLayoutEffect } from 'react';

const backgroundImage = require('@assets/gongfeng-bg.png');
const getIconImage = (index: number) => {
    const imgList: Record<number, any> = {
        0: require('@assets/m2.png'),
        1: require('@assets/m1.png'),
        2: require('@assets/m6.png'),
        3: require('@assets/m16.png'),
    }
    return imgList[index] || require('@assets/m1.png')
}

export function SAMainScreen() {
    initTable()
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
            type: 1,
            backgroundColor: 'rgba(248, 245, 236, 1)'
        },
        {
            itemName: '斋堂排班',
            type: 2,
            backgroundColor: 'rgba(246, 246, 238, 1)'
        },
        {
            itemName: '钟鼓排班',
            type: 3,
            backgroundColor: 'rgba(255, 248, 240, 1)'
        },
        {
            itemName: '后台管理',
            type: 4,
            backgroundColor: 'rgba(239, 239, 239, 1)'
        }
    ]

    return (
        <ImageBackground source={ backgroundImage } resizeMode='cover' style={ styles.ibg }>
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
                                onPress={() => navigation.navigate(ROUTE.ARRANGESCREEN, { arrangeType: item.type })}
                            >
                                <Text style={ styles.samItemText }>| { index + 1 } { item.itemName }</Text>
                                <Image source={getIconImage(index)} resizeMode="contain" style={ styles.samItemIcon }></Image>
                            </Pressable>
                        ))
                    }
                </View>
            </ScrollView>
            {/* <View style={ styles.samItem } catch:tap="getBtnTap">
                <View style={ styles.samItemText }>
                    <View style={ styles.samItemIcon }>|</View>{{data.title}}
                </View>
            </View> */}
            {/* <Button onPress={() => navigation.navigate(ROUTE.DATABASEMAIN, { testParam: '1' })}>早晚课排班</Button>
            <Button onPress={() => navigation.navigate(ROUTE.DATABASEMAIN, { testParam: '1' })}>钟鼓排班</Button>
            <Button onPress={() => navigation.navigate(ROUTE.DATABASEMAIN, { testParam: '1' })}>斋堂排班</Button>
            <Button onPress={() => navigation.navigate(ROUTE.TESTSCREEN)}>to test</Button> */}
        </ImageBackground>
    )
}

// } style="background-image: url('assets/m{{ data.id }}.png'); background-color:{{data.rgba}}"
const styles = StyleSheet.create({
    ibg: {
        overflow: 'scroll',
        flex: 1,
        alignItems: 'center', 
    },
    scrollContainer: {
        flexGrow: 1, // 确保内容不足时也能填满空间
    },
    topText: {
        flex: 1,
        padding: 20,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 60,
        height: 130
    },
    secondText: {
        flex: 2,
        padding: 20,
        paddingTop: 0,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 20
    },
    samList: {
        flex: 7,
    },
    samItem: {
        // flex: 3,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 20,
        borderRadius: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgba(216, 213, 206, 1)',
        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.1)'
    },
    samItemActive: {
        boxShadow: 'none',
        position: 'relative',
        top: 3,
        left: 2
    },
    samItemIcon: {
        aspectRatio: 1,
        width: '20%',
        marginTop: 15,
        marginBottom: 15,
        marginRight: 20
        
    },
    samItemText: {
        paddingRight: 50,
        textAlignVertical: 'center',
        height: 80,
        marginHorizontal: 30,
        fontFamily: 'SourceHanSerifCN-SemiBold-7',
        fontSize: 30,
        textAlign: 'left'
    }
});

// 