// 用来展示分类的表，查了直接出所有分类
import { Realm } from '@realm/react'
export class DungeonCategory extends Realm.Object<DungeonCategory> {
    funcKey!: number; // 所属功能表的唯一值，联动main的funcKey
    categoryName!: string; // 时间轴分类对象名字  极神、零食、绝
    categoryDesc!: string; // 时间轴分类对象描述
    categoryKey!: number; // 时间轴分类对象所在表的子键值，主键
    categoryPic!: string; // 分类图片所在地址

    static generate(funcKey: number, categoryName: string, categoryDesc: string, categoryKey: number, categoryPic: string = '') {
        return {
            funcKey,
            categoryName,
            categoryDesc,
            categoryKey,
            categoryPic,
        } as DungeonCategory;
    }

    static schema: Realm.ObjectSchema = {
        name: 'DungeonCategory',
        primaryKey: 'categoryKey',
        properties: {
            funcKey: 'int',
            categoryName: 'string',
            categoryDesc: 'string',
            categoryKey: 'int',
            categoryPic: 'string'
            // description: 'string',
            // isComplete: { type: 'bool', default: false },
            // createdAt: 'date'
        },
    };
}