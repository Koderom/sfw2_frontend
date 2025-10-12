import { MessageService } from "primeng/api";

export default class ToastMessage {
    static TIME_MESSAGE:number = 10000;
    static DEFAULT_ERROR_MESSAGE = 'Error al realizar operacion';
    static DEFAULT_SUCCESS_MESSAGE = 'Operacion realizada exitosamente';

    static success(service: MessageService, title: string, content: string[]){
        if(content && content.length > 0)
            content.forEach( message => {
                service.add({ 
                    severity: 'success', 
                    summary: title, 
                    detail: message || this.DEFAULT_SUCCESS_MESSAGE, 
                    life: this.TIME_MESSAGE 
                });
            });
        else
            service.add({ severity: 'success', summary: title, detail:this.DEFAULT_SUCCESS_MESSAGE, life: this.TIME_MESSAGE });
    }

    static error(service: MessageService, title: string, content: string[]){
        content.forEach( message => {
            service.add({ severity: 'error', summary: title, detail:message, life: this.TIME_MESSAGE });
        })
    }

    static exception(service: MessageService, title: string, error: any){
        service.add(
            { severity: 'error', summary: title, 
                detail: error.error.message || error.message || this.DEFAULT_ERROR_MESSAGE, 
                life: this.TIME_MESSAGE 
            });
    }
}