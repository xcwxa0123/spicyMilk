import React, { useState } from "react";
import { Realm, RealmProvider, useRealm, useQuery } from '@realm/react'
// import { AsyncStorage } from 'react-native'; // 用于存储标志位
import { Main, DungeonCategory, TimeLineSum, TimeLine, ArrangePosition, ArrangePeople, ArrangeList } from '@tools/zeroExport'

const MainContainer = [
	Main.generate('时间轴', '时间轴排轴工具', 0),
	Main.generate('招募板', '招募板查看工具', 1)
]

const DCContainer = [
	DungeonCategory.generate(0, '极神', '极神描述', 0),
	DungeonCategory.generate(0, '零式', '零式描述', 1),
	DungeonCategory.generate(0, '绝', '绝描述', 2),
]

const ArrangePositionContainer = [
	// 名字，分类，图片，颜色
	// 早晚课
	ArrangePosition.generate('唯那', 0, 0, 'rgba(248, 245, 236, 1)', 0, false),
	ArrangePosition.generate('木鱼', 0, 1, 'rgba(246, 246, 238, 1)', 1, false),
	ArrangePosition.generate('引磬', 0, 2, 'rgba(255, 248, 240, 1)', 2, false),
	ArrangePosition.generate('小木鱼', 0, 3, 'rgba(239, 239, 239, 1)', 3, false),
	ArrangePosition.generate('铃鼓', 0, 4, 'rgba(236, 236, 236, 1)', 4, false),
	ArrangePosition.generate('出食', 0, 5, 'rgba(240, 240, 236, 1)', 5, false),

	// 钟鼓
	ArrangePosition.generate('早钟', 1, 0, 'rgba(248, 245, 236, 1)', 0, false),
	ArrangePosition.generate('早鼓', 1, 1, 'rgba(246, 246, 238, 1)', 1, false),
	ArrangePosition.generate('晚钟', 1, 2, 'rgba(255, 248, 240, 1)', 2, false),
	ArrangePosition.generate('晚鼓', 1, 3, 'rgba(239, 239, 239, 1)', 3, false),

	// 斋堂
	ArrangePosition.generate('早斋行堂', 2, 0, 'rgba(248, 245, 236, 1)', 0, true),
	ArrangePosition.generate('午斋行堂', 2, 1, 'rgba(246, 246, 238, 1)', 1, true),
	ArrangePosition.generate('出食', 2, 2, 'rgba(255, 248, 240, 1)', 2, false),
]

const ArrangePeopleContainer = [
	ArrangePeople.generate('释照律师父', 0, 0),
	ArrangePeople.generate('释演慈师父', 1, 0),
	ArrangePeople.generate('释照玉师父', 3, 0),
	ArrangePeople.generate('释道入师', 2, 0),
	ArrangePeople.generate('释善昭师', 4, 0),
	ArrangePeople.generate('释慧净师', 5, 0),
	// ArrangePeople.generate('释慧觉师父', 6),
]

export function initTable() {
	try {
		const realm = useRealm();
		console.log('数据库储存地址============>', realm.path)
		realm.write(() => {
			MainContainer.forEach(c => { realm.create(Main, c) })
			DCContainer.forEach(c => { realm.create(DungeonCategory, c) })
		});
	} catch (error) {
		// console.log('报错了捏=============>', error)
		console.log('报错了捏=============>记得处理查重逻辑')

	}
	// realm.create(DungeonCategory, Main.generate('时间轴', '时间轴排轴工具', 0)); // 出一个对象，循环往里丢，上面那个也记得这样整
}

export function initArrangeTable() {
	try {
		const realm = useRealm();
		console.log('数据库储存地址============>', realm.path)
		const apoResult = realm.objects('ArrangePosition')
		const apeResult = realm.objects('ArrangePeople')
		realm.write(() => {
			if(!apoResult.length){
				ArrangePositionContainer.forEach(c => { realm.create(ArrangePosition, c) })
			}
			if(!apeResult.length){
				ArrangePeopleContainer.forEach(c => { realm.create(ArrangePeople, c) })
			}
		});
	} catch (error) {
		// console.log('报错了捏=============>', error)
		console.log('报错了捏=============>记得处理查重逻辑', error)

	}
	// realm.create(DungeonCategory, Main.generate('时间轴', '时间轴排轴工具', 0)); // 出一个对象，循环往里丢，上面那个也记得这样整
}


export const getIconImage = (index: number | string) => {
    const imgList: Record<number| string, any> = {
            // 0: require('@assets/m2.png'),
            // 1: require('@assets/m1.png'),
            // 2: require('@assets/m6.png'),
            // 3: require('@assets/m16.png'),

            'backgroundImage': require('@assets/gongfeng-bg.png'),
            'editImage': require('@assets/edit.png'),
            'okImage': require('@assets/ok.png'),
            'shareImg': require('@assets/icon-share.png'),
            'delete': require('@assets/delete.png'),
            'add': require('@assets/add.png')
        }
    return imgList[index] || require('@assets/m1.png')
}