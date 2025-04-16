import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Animated,
    ListRenderItemInfo,
    useWindowDimensions
} from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';

interface TimeLineItemType {
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

    name: string
}

interface Props {
    data: ListRenderItemInfo<TimeLineItemType>;
}

export const TimeLineItem: React.FC<Props> = ({ data }) => {
    const { item, index } = data;

    const { width } = useWindowDimensions();

    const translateY = useRef<Animated.Value>(new Animated.Value(50)).current;
    const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;

    const imageSize = width - 48;
    const pngSouce = require("@assets/test.png")
    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                delay: index * (400 / 3),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                delay: index * (400 / 3),
                useNativeDriver: true,
            }),
        ]).start();
    });

    return (
        <Animated.View
            style={[styles.container, { opacity, transform: [{ translateY }] }]}
        >
            <View style={styles.imageContainer}>
                <Image
                    style={{ height: imageSize / 2, width: imageSize }}
                    // source={item.imagePath}
                    source={ pngSouce }
                    resizeMode="stretch"
                />
                <Icon
                    style={{ position: 'absolute', right: 0, padding: 16 }}
                    name="favorite-border"
                    size={24}
                    color="#54D3C2"
                />
            </View>
            <View style={{ padding: 8, paddingHorizontal: 16 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={styles.title}>标题写啥</Text>
                    <Text style={styles.perNightPrice}>这是个啥，小标题？</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.subText}>
                        <Text style={[{ marginRight: 4 }, textStyle]}>次标题</Text>
                        <Icon name="location-pin" size={14} color="#54D3C2" />
                        <Text style={textStyle}>
                            {Number(1111111)} km to city
                        </Text>
                    </View>
                    <Text style={styles.perNightText}>/per night</Text>
                </View>
                <View style={styles.ratingContainer}>
                    挂个点赞的
                    <Text style={styles.review}>测评啥的 Reviews</Text>
                </View>
            </View>
        </Animated.View>
    );
};


const textStyle = {
    color: 'rgba(128,128,128, 0.6)',
    fontFamily: 'WorkSans-Regular',
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginVertical: 12,
        marginHorizontal: 24,
        borderRadius: 16,
        elevation: 8,
        shadowColor: 'grey',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    imageContainer: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    title: {
        flex: 1,
        color: 'black',
        fontSize: 22,
        fontFamily: 'WorkSans-SemiBold',
    },
    subText: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 4,
        marginTop: 4,
    },
    perNightPrice: {
        color: 'black',
        fontSize: 22,
        fontFamily: 'WorkSans-SemiBold',
    },
    perNightText: { ...textStyle, color: 'black', marginTop: 4 },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 4,
        alignItems: 'center',
    },
    review: {
        ...textStyle,
        marginLeft: 8,
    },
});