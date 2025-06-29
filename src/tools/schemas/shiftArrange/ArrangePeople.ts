// 职位、人员储存表
// 要新增职位
import { Realm } from '@realm/react'
export class ArrangePeople extends Realm.Object<ArrangePeople> {
    name!: string; // 人员姓名 主键
    nameIndex!: number; // 排序
    
    static generate(name: string, nameIndex: number) {
        return {
            name,
            nameIndex
        } as ArrangePeople;
    }

    static schema: Realm.ObjectSchema = {
        name: 'ArrangePeople',
        primaryKey: 'name',
        properties: {
            name: 'string',
            nameIndex: 'int'
        },
    };
}