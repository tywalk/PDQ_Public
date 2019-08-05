import * as React from 'react';
import LoadingOverlay from 'react-loading-overlay'

/** Wraps async load. */
export abstract class BaseReactPage<P, S> extends React.Component<P, S>
{
    wrapRefreshPage = (promise: Promise<any>) => {
        return async () => {
            try {
                await promise;
            }
            catch (e) {
                alert(e);
                console.error(e);
            }
        }
    }
    abstract onRender(): React.ReactNode;

    /** Actual render. */
    public render() {
        if (!this.state)
            return <LoadingOverlay active={true} spinner text="Loading"></LoadingOverlay>
        return this.onRender();
    }
}

interface LoadingState { loaded: boolean, loading?: boolean }
/** Handles async loading with a loading wrapper. */
export abstract class BaseReactPageLoaded<P = {}, S = {}> extends BaseReactPage<P, S extends LoadingState ? S : (LoadingState & S)>
{
    defaultProps = { spinnerHeight: 80, spinnerWidth: 80, loadingText: "Loading...", spinnerMarginTop: 40 };
    abstract onLoad?(): void;
    async componentWillMount() {
        if (this.onLoad)
            await this.onLoad();
    }
    /** Actual render. */
    public render() {
        let { loadingText, spinnerMarginTop } = this.defaultProps;
        if (!this.state || !this.state.loaded) {
            return <div style={{ marginTop: spinnerMarginTop }}><LoadingOverlay active={true} spinner text={loadingText}></LoadingOverlay></div>;
        }
        let { loading } = this.state;
        let contents: React.ReactNode;
        try {
            contents = this.onRender(); //Trigger callback
        } catch (e) {
            alert(e);
            loading = true;
            console.error(e);
        }
        if (loading)
            return <div><LoadingOverlay active={true} spinner text={loadingText}>{contents}</LoadingOverlay></div>;
        return contents;
    }
}
/** Base class to handle initial async loading. */
export abstract class BaseReactPageBasicHandleLoad<P = {}, S = {}> extends BaseReactPageLoaded<P, S extends { loaded?: boolean } ? S : (S & { loaded?: boolean })>
{
    abstract handleLoad(): Promise<boolean | void> | void;
    async onLoad() {
        let result = await this.handleLoad();
        if (result != false && !this.state || !this.state.loaded)
            this.setState({ loaded: true });
    }
}