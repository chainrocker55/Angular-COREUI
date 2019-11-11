export class UserInfo {
    USER_CD: string;
    USER_FULLNAME: string;
    EMAILADDR: string;
    GROUP_CD: string;
    LANG_CD: string;
    TOKEN: string;
}

export class Notify {
    InfoDateTime: Date;
    Title: string;
    Description: string;
    ScreenCD: string;
    SubScreenCD: string;
    Parameter: string;
    Receiver: string;
    ItemTemplateName: string;
    Seq: number;
    HasRead: boolean;
}

export class ComboStringValue {
    VALUE: string;
    DISPLAY: string;
    CODE: string;
}

export class ComboIntValue {
    VALUE: number;
    DISPLAY: string;
    CODE: string;
}

export class ActivePermissionValue {
    SCREEN_CD: string;
    VIEW: boolean;
    ADD: boolean;
    EDIT: boolean;
    DELETE: boolean;
    PRINT: boolean;
    CANCEL: boolean;
}
