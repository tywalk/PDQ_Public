import * as SignalR from "@aspnet/signalr"

export module BaseHubUtility {
    export class Hub<T> {
        private connection: IHub;
        constructor(private onStart: (e: any) => void, private onReceive: (...responses: T[]) => void, private receiveMessage: string, private otherMessages?: { [index: string]: (e?: any, ...responses: any[]) => void }) {
            try {
                this.connection = new SignalR.HubConnectionBuilder()
                    .withUrl("/hub")
                    .build();

                this.init(onReceive, receiveMessage, otherMessages);
                //$.connection.hub.start().done(this.forStart);
            }
            catch (e) {
                this.connection = new SignalR.HubConnectionBuilder().build();
                alert("No connection.");
            }

        }
        async init(onReceive: (...responses: T[]) => void,receiveMessage: string, otherMessages?: { [index: string]: (e?: any, ...responses: any[]) => void }) {
            await this.connection.start().catch(err => document.write(err));
            this.forStart(this.connection);

            this.connection.on(receiveMessage, onReceive);
            if (otherMessages)
                for (var msg in otherMessages) {
                    this.connection.on(msg, otherMessages[msg]);
                }
        }
        forStart = (chat: SignalR.HubConnection) => {
            this.onStart && this.onStart(chat);
        }
        htmlEncode(value: string) {
            var encodedValue = $('<div />').text(value).html();
            return encodedValue;
        }
        sendToServer(data: any, connection?: SignalR.HubConnection) {
            if (this.connection && this.connection.server && connection)
                this.connection.server.send(data);
            else
                this.connection.send(data);
        }
        async lockApi() {
            if (this.connection) {
                let canUpdate = await this.connection.invoke("LockApi");
                return canUpdate;
            }
            return false;
        }
        async unlockApi() {
            if (this.connection) {
                let canUpdate = await this.connection.invoke("UnlockApi");
                return canUpdate;
            }
            return false;
        }
        async getThought() {
            if (this.connection) {
                let thought = await this.connection.invoke("GetThought");
                return thought;
            }
            return false;
        }
    }
}

export interface IHub extends SignalR.HubConnection {
    client?: { broadcastMessage: (...responses: any[]) => void };
    server?: SignalR.ITransport;
    invoke: (method: HubTypes, ...data: any[]) => Promise<any>;
}
export type HubTypes = "LockApi" | "UnlockApi" | "GetThought";
export class HubUtility<T> extends BaseHubUtility.Hub<T> { }