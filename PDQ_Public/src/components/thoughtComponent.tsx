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
            return (<div style={{ textAlign: 'center', opacity: .7, marginTop: '50px' }}>
                <div style={{ fontSize: '200px' }}>
                    <i className="fa fa-exclamation-triangle fa-exlamation-triangle"></i>
                </div>
                <h2 style={{ fontSize: '100px' }}>Brain Unavailable</h2>
                <p><i>Please Try Again</i></p>
            </div>);
        return (
            <div className="thought-container">
                <div className="flex-grow-0" style={{ flex: "65%" }}>
                    <img className="img-thumbnail" src={photo} />
                    <div>
                        <h3 style={{ padding: '10px 0' }}>{name}</h3>
                        <h6>Preferred Brew:</h6>
                        <p style={{ padding: "5px" }}>{currentBeer}</p>
                    </div>
                </div>
                <div style={{ marginLeft: '50px' }}>
                    <h6>Thought:</h6>
                    <div style={{ padding: "20px" }}>"{currentThought}"</div>
                    <h6>Daydream:</h6>
                    <img className="daydream" src={daydream} />
                </div>
            </div>
        );
    }
}