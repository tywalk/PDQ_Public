import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IThought } from '../typings/thought';
import { BaseReactPageBasicHandleLoad } from './utility/baseUtil'
import { HubUtility } from './utility/hubUtil';
import { Button } from 'react-bootstrap';
import LoadingOverlay from 'react-loading-overlay'
import "./css/main.css";
import { Thought } from './components/thoughtComponent';

interface IResponse extends Array<any> {
    thought: IThought;
}


interface IThoughtsState {
    hub: HubUtility<IResponse[]>;
    name: string;
    id: string;
    thought: IThought;
    showPanel: boolean;
    panelType: string;
    locked: boolean;
}

class ThoughtsController extends BaseReactPageBasicHandleLoad<{}, IThoughtsState>{
    static defaultProps = {}
    async handleLoad() {
        await setTimeout(() => { }, 1000);
        let hub = new HubUtility(this.onConnected, this.onReceive, "broadcastMessage", {
            "locked": this.onLock, "thoughtResponse": this.retrieveInit
        });
        this.setState({ hub, name });
    }
    onReceive(responses: IResponse[]) {
        if (typeof responses === "string") {
            alert(responses);
            return;
        }
    }
    onConnected = (e: any) => {
        console.log("Connected!");
    }
    onLock = (locked: boolean) => {
        locked ?
            console.log("locked") : console.log("unlocked");
        this.setState({ locked });
    }
    retrieveInit = (thought: IThought) => {
        console.log(JSON.stringify(thought));

        this.setState({ thought });
    }

    onSend = async () => {
        await this.state.hub.getThought();
        //this.setState({ thought });
    }

    onRender() {
        if (!this.state) return <div style={{ marginTop: '40px' }}></div>;
        let { thought, locked } = this.state;
        return (<div style={{ height: '100%' }}>
            <LoadingOverlay active={locked} spinner text="Loading">
                <h2 className="app-header">PDQ</h2>
                <div className="app-container">
                    {thought ? <Thought thought={thought} /> :
                        <div style={{ textAlign: 'center' }}>
                        </div>
                    }
                    <div style={{ textAlign: 'center' }}>
                        <Button className="just-send-it text-center" variant="dark" onClick={this.onSend}>Contact Brain</Button>
                    </div>
                </div>
            </LoadingOverlay>
        </div>);
    }
}

ReactDOM.render(<ThoughtsController />, document.getElementById('app'));