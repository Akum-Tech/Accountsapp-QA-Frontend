import { Injectable } from '@angular/core';
import { MessageType } from './model/messagetype-model'
@Injectable()
export class Globals {
    role: string = 'test';
    messageCloseTime:number=3000;
    applicationtype:string="Web";
    itemsPerPageset:number = 15 ;
    messageType: MessageType = {
        success: "success",
        warn: "warn",
        error: "error",
        info: "info"
    };


}