import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IThought } from '../typings/thought';
import { BaseReactPageBasicHandleLoad } from './utility/baseUtil'
import { HubUtility } from './utility/hubUtil';
import { Button, Nav, Navbar, NavbarBrand } from 'react-bootstrap';
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

    goHome = () => {
        this.setState({ thought: null as any });
    }

    onSend = async () => {
        await this.state.hub.getThought();
        //this.setState({ thought });
    }

    onRender() {
        if (!this.state) return <div style={{ marginTop: '40px' }}></div>;
        let { thought, locked } = this.state;
        return (
            <LoadingOverlay active={locked} spinner text="Retrieving Thought From Brain...">
                <Navbar bg="dark" variant="dark" style={{ position: 'fixed', width: '100%' }}>
                    <Navbar.Brand onClick={this.goHome} href="#home">PDQ</Navbar.Brand>
                    {thought &&
                        <Nav className="mr-auto">
                            <Nav.Link><Button className="just-send-it text-center" variant="dark" onClick={this.onSend}>Contact Brain <i className="fa fa-brain"></i></Button></Nav.Link>
                        </Nav>
                    }
                </Navbar>
                <div className="app-container">
                    {thought ? <Thought thought={thought} /> :
                        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                            <h2>Welcome to the Cabalistic Necromancer Interface</h2>
                            <i>Built With the Talismanic Formula</i>
                            <p style={{ marginTop: '50px' }}>This interface is meant to pick the brain for thoughts...</p>
                            <p style={{ marginTop: '50px' }}>To get started, click "Contact Brain" and let the CN do its work.</p>
                            <div style={{ margin: '50px' }}>
                                <Button className="just-send-it text-center" variant="dark" onClick={this.onSend}>Contact Brain <i className="fa fa-brain"></i></Button>
                            </div>
                        </div>
                    }
                </div>
            </LoadingOverlay>
        );
    }
}

ReactDOM.render(<ThoughtsController />, document.getElementById('app'));