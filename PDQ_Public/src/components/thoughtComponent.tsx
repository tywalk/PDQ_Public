import * as React from 'react';
import { IThought } from '../../typings/thought';

interface IThoughtProps {
    thought: IThought
}
interface IThoughtState {
    ready: boolean;
    locked: boolean;
}
export class Thought extends React.Component<IThoughtProps, IThoughtState> {
    componentDidMount() {
        this.setState({ ready: true });
    }
    render() {
        if (!this.state || !this.props) return <div></div>;
        let thought = this.props.thought;
        let { photo, currentBeer, name, currentThought, daydream } = thought;
        if (thought && !name)
            return (<div className="text-danger" style={{ textAlign: 'center' }}>
                Brain Unavailable!!
            </div>);
        return (<div className="thought-container">
            <div className="flex-grow-0" style={{ flex: "45%" }}>
                <img className="img-thumbnail" src={photo} />
                <div style={{ padding: "20px" }}>{currentThought}</div>
            </div>
            <div>
                <h3>{name}</h3>
                <h6>Preferred Brew</h6>
                <p style={{ padding: "10px" }}>{currentBeer}</p>
                <h6>Daydream</h6>
                <img className="daydream" src={daydream} />
            </div>
        </div>);
    }
}