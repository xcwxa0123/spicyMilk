import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Animated } from 'react-native';
import { TimeLineItem } from '@components/TimeLineItem'
import {
    ListRenderItemInfo,
} from 'react-native';

export const TestScreen = () => {
    const [scrollY, setScrollY] = useState(new Animated.Value(0));

    // 示例数据：1000个时间轴项
    const timelineData = new Array(10).fill(null).map((_, index) => ({
        // id: String(index),
        // time: `时间节点 ${ index }`,
        // action: `动作 ${ index }`,
        // id: Realm.BSON.ObjectId; // 主键，唯一值
        // from: string; // 发动对象的名字（有可能双目标或者多目标）
        // name: string; // 技能名称
        // nameEN: string; // 技能名称英文
        // nameJP: string; // 技能名称日文
        // desc: string; // 技能描述
        // range: string; // 作用范围
        // damage: number; // 伤害
        // startAt: number; // 技能发动开始时间点
        // endAt: number; // 技能发动结束时间点
        // dungeonID: Realm.BSON.ObjectId; // 副本主键，出自TimeLineSum
        // pic: string; // 图片存放地址
        id: String(index),
        item: { name: 'testttt' },
        index
    }));

    const renderItem = ({ item }: any) => (
        // <View style={styles.timelineItem}>
        //     <Text>{item.time}: {item.action}</Text>
        // </View>
        <TimeLineItem data={item}></TimeLineItem>
    );

    return (
        <View style={styles.container}>
            {/* 横向职业技能列表 */}
            <View style={styles.skillBar}>
                <Text>职业技能 1</Text>
                <Text>职业技能 2</Text>
                <Text>职业技能 3</Text>
                {/* 其他技能 */}
            </View>

            {/* 时间轴列表 */}
            <FlatList
                data={timelineData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                style={styles.timeline}
            />

            {/* 中轴线 */}
            <Animated.View
                style={[styles.centerLine, { transform: [{ translateY: scrollY }] }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        position: 'relative',
    },
    skillBar: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
    },
    timeline: {
        flex: 1,
    },
    timelineItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    centerLine: {
        position: 'absolute',
        width: '100%',
        height: 2,
        backgroundColor: 'red',
        top: '50%', // 初始位置为中间
    },
});