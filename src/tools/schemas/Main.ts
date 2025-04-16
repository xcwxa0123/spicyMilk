// 用来展示主页功能的表，查了直接出所有功能
// 级联顺序 Main->DunGeonCategory->TimelineSum->TimeLine->PlayerTimeLine
import { Realm } from '@realm/react'
export class Main extends Realm.Object<Main> {
    _id!: Realm.BSON.ObjectId; // 主键
    funcName!: string; // 功能名
    funcDesc!: string; // 功能描述
    funcKey!: number; // 功能所在表的子键值
    funcPic!: string; // 功能图片所在地址

    static generate(funcName: string, funcDesc: string, funcKey: number, funcPic: string = '') {
        return {
            _id: new Realm.BSON.ObjectId(),
            funcName,
            funcDesc,
            funcKey,
            funcPic
        } as Main;
    }

    static schema: Realm.ObjectSchema = {
        name: 'Main',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            funcName: 'string',
            funcDesc: 'string',
            funcKey: 'int',
            funcPic: 'string',
            // description: 'string',
            // isComplete: { type: 'bool', default: false },
            // createdAt: 'date'
        },
    };
}