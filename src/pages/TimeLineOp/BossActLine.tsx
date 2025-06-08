import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Animated } from 'react-native';
import { TimeLineItem } from '@components/TimeLineItem'
import {
    ListRenderItemInfo,
} from 'react-native';

export const BossActLine = () => {
    const [scrollY, setScrollY] = useState(new Animated.Value(0));

    // 示例数据：1000个时间轴项
    const timelineData = new Array(10).fill(null).map((_, index) => ({
        id: String(index),
        item: { name: 'testttt' },
        index
    }));

    const renderItem = ({ item }: any) => (
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