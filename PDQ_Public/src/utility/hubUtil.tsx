import * as SignalR from "@aspnet/signalr"

export module BaseHubUtility {
    export class Hub<T> {
        private connection: IHub;
        constructor(private onStart: (e: any) => void, private onReceive: (...responses: T[]) => void, private receiveMessage: string, private otherMessages?: { [index: string]: (e?: any, ...responses: any[]) => void }) {
            try {
                //Set signalr connection
                this.connection = new SignalR.HubConnectionBuilder()
                    .withUrl("/hub")
                    .build();

                //Initialize event handlers
                this.init(onReceive, receiveMessage, otherMessages);
            }
            catch (e) {
                //No connection found
                this.connection = new SignalR.HubConnectionBuilder().build();
                alert("No connection.");
            }

        }
        /**
         * Initialize connection and handlers.
         * @param onReceive
         * @param receiveMessage
         * @param otherMessages
         */
        async init(onReceive: (...responses: T[]) => void,receiveMessage: string, otherMessages?: { [index: string]: (e?: any, ...responses: any[]) => void }) {
            await this.connection.start().catch(err => document.write(err));

            this.forStart(this.connection); //Connection made
            
            this.connection.on(receiveMessage, onReceive); //Add default message and handler

            //Add additional messages to the hub
            if (otherMessages)
                for (var msg in otherMessages) {
                    this.connection.on(msg, otherMessages[msg]);
                }
        }
        /** Triggers onStart callback.
         * @param chat Successful connection. */
        forStart = (chat: SignalR.HubConnection) => {
            this.onStart && this.onStart(chat);
        }
        /**
         * Sends data to hub using default connection params.
         * @param data
         * @param connection
         */
        sendToServer(data: any, connection?: SignalR.HubConnection) {
            if (this.connection && this.connection.server && connection)
                this.connection.server.send(data);
            else
                this.connection.send(data);
        }
        /** Invoke 'LockApi' message. */
        async lockApi() {
            if (this.connection) {
                let canUpdate = await this.connection.invoke("LockApi");
                return canUpdate;
            }
            return false;
        }
        /** Invoke 'UnlockApi' message. */
        async unlockApi() {
            if (this.connection) {
                let canUpdate = await this.connection.invoke("UnlockApi");
                return canUpdate;
            }
            return false;
        }
        /** Invoke 'GetThought' message.
         * Retrieve current thought from brain. */
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
/** Valid hub messages. */
export type HubTypes = "LockApi" | "UnlockApi" | "GetThought";
/** Utility to communicate with the hub. */
export class HubUtility<T> extends BaseHubUtility.Hub<T> { }