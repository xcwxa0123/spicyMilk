import React, { useState } from "react";
import { Realm, RealmProvider, useRealm, useQuery } from '@realm/react'
// import { AsyncStorage } from 'react-native'; // 用于存储标志位
import { Main, DungeonCategory, TimeLineSum, TimeLine } from '@tools/schemas/zeroExport'

const MainContainer = [
	Main.generate('时间轴', '时间轴排轴工具', 0),
	Main.generate('招募板', '招募板查看工具', 1)
]

const DCContainer = [
	DungeonCategory.generate(0, '极神', '极神描述', 0),
	DungeonCategory.generate(0, '零式', '零式描述', 1),
	DungeonCategory.generate(0, '绝', '绝描述', 2),
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