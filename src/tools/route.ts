export type RouteList = {
    Main: undefined; // 首页，无需设置navigate跳转参数
    DataBaseMain: { testParam: string };
    DataBaseOp: { dbName: string, categoryKey?: number };
    // SecondScreen: undefined;
    ActionLine: undefined;
    BossActLine: { dungeonName: string };
    TestScreen: undefined;
    // 从这开始是排班的
    SAMainScreen: undefined;
    ArrangeScreen: { arrangeType: number, title: string };
    BackStageScreen: undefined;
}

export const ROUTE = {
    MAIN: 'Main',
    DATABASEMAIN: 'DataBaseMain',
    DATABASEOP: 'DataBaseOp',
    ACTIONLINE: 'ActionLine',
    BOSSACTLINE: 'BossActLine',
    TESTSCREEN: 'TestScreen',
    // 从这开始是排班的
    SAMAINSCREEN: 'SAMainScreen',
    ARRANGESCREEN: 'ArrangeScreen',
    BACKSTAGESCREEN: 'BackStageScreen'
} as const;

export { MainScreen } from '@pages/MainScreen'
export { DataBaseMain } from '@pages/DataBase/DataBaseMain'
export { DataBaseOp } from '@pages/DataBase/DataBaseOp'
export { ActionLine } from '@pages/TimeLineOp/ActionLine'
export { BossActLine } from '@pages/TimeLineOp/BossActLine'
export { TestScreen } from '@pages/TestScreen'
// 从这开始是排班的
export { SAMainScreen } from '@pages/ShiftArrange/SAMainScreen'
export { ArrangeScreen } from '@pages/ShiftArrange/ArrangeScreen'
export { BackStageScreen } from '@pages/ShiftArrange/BackStageScreen'