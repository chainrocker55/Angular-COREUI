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
