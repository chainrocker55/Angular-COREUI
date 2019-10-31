

// tslint:disable-next-line:class-name
export class TZ_USER_MS {
    USER_ACCOUNT: string;
    MENU_SET_CD: string;
    GROUP_CD: string;
    DEPARTMENT_CD: string;
    LANG_CD: string;
    DATE_FORMAT: number;
    PASS: string;
    FULL_NAME: string;
    APPLY_DATE: Date;
    FLG_RESIGN: number;
    FLG_ACTIVE: number;
    FLG_ABSENCE: number;
    EMAILADDR: string;
    CRT_BY: string;
    CRT_DATE: Date;
    CRT_MACHINE: string;
    UPD_BY: string;
    UPD_DATE: Date;
    UPD_MACHINE: string;
    UPPER_USER_ACCOUNT: string;
    LOWER_USER_ACCOUNT: string;
    SIGNATURE: string;
    DIVISIONID: number;
    BRANCHID: number;
    DEPARTMENTID: number;
    DISPLAY_DATE_FORMAT: number;
    DISPLAY_DATE_FORMAT_LONG: number;
}

// tslint:disable-next-line:class-name
export class TZ_LANG_MS {
    LANG_CD: string;
    LANG_NAME: string;
    IS_DEFAULT: string;
    CRT_BY: string;
    CRT_DATE: Date;
    CRT_MACHINE: string;
    UPD_BY: string;
    UPD_DATE: Date;
    UPD_MACHINE: string;
}

// tslint:disable-next-line:class-name
export class TZ_MESSAGE_MS {
    MSG_CD: string;
    LANG_CD: string;
    MSG_DESC: string;
    CRT_BY: string;
    CRT_DATE: Date;
    CRT_MACHINE: string;
    UPD_BY: string;
    UPD_DATE: Date;
    UPD_MACHINE: string;
}

// tslint:disable-next-line:class-name
export class TZ_SCREEN_DETAIL_LANG_MS {
    CONTROL_CD: string;
    LANG_CD: string;
    SCREEN_CD: string;
    CONTROL_CAPTION: string;
    CRT_BY: string;
    CRT_DATE: Date;
    CRT_MACHINE: string;
    UPD_BY: string;
    UPD_DATE: Date;
    UPD_MACHINE: string;
    IS_USED: number;
}

// tslint:disable-next-line:class-name
export class TZ_USER_GROUP_MS {
    GROUP_CD: string;
    GROUP_NAME: string;
    CRT_BY: string;
    CRT_DATE: Date;
    CRT_MACHINE: string;
    UPD_BY: string;
    UPD_DATE: Date;
    UPD_MACHINE: string;
}

// tslint:disable-next-line:class-name
export class TZ_MENU_SET_MS {
    MENU_SET_CD: string;
    MENU_SET_NAME: string;
    CRT_BY: string;
    CRT_DATE: Date;
    CRT_MACHINE: string;
    UPD_BY: string;
    UPD_DATE: Date;
    UPD_MACHINE: string;
}

// tslint:disable-next-line:class-name
export class TBM_DIVISION {
    DIVISIONID: number;
    CODE: string;
    NAMEENG: string;
    NAMETHA: string;
    DIVISIONLEVEL: number;
    PARENT_DIVISIONID: number;
    CREATEUSERID: string;
    CREATEMACHINE: string;
    CREATEDATETIME: Date;
    LASTUPDATEUSERID: string;
    LASTUPDATEMACHINE: string;
    LASTUPDATEDATETIME: Date;
    DELETEFLAG: string;
    DELETEUSERID: string;
    DELETEMACHINE: string;
    DELETEDATETIME: Date;
    ORDER_PROCESS_CLS: string;
}

// tslint:disable-next-line:class-name
export class TBM_POSITION {
    POSITIONID: number;
    POSITIONCODE: string;
    POSITIONNAME: string;
    REMARK: string;
    CREATEUSERID: string;
    CREATEDATETIME: Date;
    CREATEMACHINE: string;
    LASTUPDATEUSERID: string;
    LASTUPDATEDATETIME: Date;
    LASTUPDATEMACHINE: string;
    DELETEFLAG: string;
    DELETEUSERID: string;
    DELETEDATETIME: Date;
    DELETEMACHINE: string;
}
