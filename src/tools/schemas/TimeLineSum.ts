// 用来放所有副本的表，查的时候记得利用categoryKey分类查
import { Realm } from '@realm/react'
// import { TimeLine } from './TimeLine'
export class TimeLineSum extends Realm.Object<TimeLineSum> {
    _id!: Realm.BSON.ObjectId; // 主键id
    categoryKey!: number; // 联动DungeonCategory子键categoryKey
    dungeonName!: string; // 副本名称
    dungeonNameEN!: string;
    dungeonNameJP!: string;
    level!: number; // 同步等级
	dungeonPic!: string; // 副本图片所在地址
    // TimeLine!: Realm.List<TimeLine>; // 外键

    static generate(categoryKey: number, dungeonName: string, dungeonNameEN: string = dungeonName, dungeonNameJP: string = dungeonName, level: number, dungeonPic: string = '') {
        return {
            _id: new Realm.BSON.ObjectId(),
            categoryKey,
            dungeonName,
            dungeonNameEN,
            dungeonNameJP,
            level,
            dungeonPic,
        } as TimeLineSum;
    }

    static schema: Realm.ObjectSchema = {
        name: 'TimeLineSum',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            categoryKey: 'int',
            dungeonName: 'string',
            dungeonNameEN: 'string',
            dungeonNameJP: 'string',
            level: 'int',
            dungeonPic: 'string',
			// timeLine: { // 关联子表
			// 	type: 'list', // 说明关联子表
			// 	objectType: 'TimeLine' // 子表的表类型
			// }
        },
    };
}

// realm.write(() => {
// 	const dungeon = realm.create(dungeonName, {dungeonData...})
// 	realm.create()
// })