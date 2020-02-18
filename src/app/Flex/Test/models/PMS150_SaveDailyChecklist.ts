import { PMS150_GetDailyChecklist_Result } from './PMS150_GetDailyChecklist_Result';
import { PMS151_GetDailyChecklist_Detail } from './PMS151_GetDailyChecklist_Detail';
import { PMS151_GetDailyChecklist_Detail_Item } from './PMS151_GetDailyChecklist_Detail_Item';

export class PMS150_SaveDailyChecklist{

    header:PMS150_GetDailyChecklist_Result;
    machine:PMS151_GetDailyChecklist_Detail[];
    items:PMS151_GetDailyChecklist_Detail_Item[];
    userID:String;
}