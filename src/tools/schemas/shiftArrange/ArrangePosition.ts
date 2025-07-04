// 职位、人员储存表
// 要新增职位
import { Realm } from '@realm/react'
export class ArrangePosition extends Realm.Object<ArrangePosition> {
    _id!: Realm.BSON.ObjectId; // 主键
    positionName!: string; // 职位名
    positionType!: number; // 职位所属类别 比如晨钟暮鼓类别 首页根据type进行选出
    imgIndex!: number; // 图片index
    backgroundColor!: string; // 背景颜色
    positionIndex!: number; // 用于排序
    isMultiple!: boolean; // 是否多选

    static generate(positionName: string, positionType: number, imgIndex: number, backgroundColor: string, positionIndex: number, isMultiple: boolean = false) {
        return {
            _id: new Realm.BSON.ObjectId(),
            positionName,
            positionType,
            imgIndex,
            backgroundColor,
            positionIndex,
            isMultiple
        } as ArrangePosition;
    }

    static schema: Realm.ObjectSchema = {
        name: 'ArrangePosition',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            positionName: 'string',
            positionType: 'int',
            imgIndex: 'int',
            backgroundColor: 'string',
            positionIndex: 'int',
            isMultiple: 'bool'
        },
    };
}