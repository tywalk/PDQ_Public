declare module 'react-loading-overlay' {
    /** Wrapper to show an overlay with a loading message. */
    export const LoadingOverlay: React.StatelessComponent<ILoader>;
    export interface ILoader extends React.HTMLAttributes<HTMLElement> {
        active: boolean;
        fadeSpeed?: number;
        onClick?: () => void;
        className?: string;
        classNamePrefix?: string;
        spinner: boolean | Node;
        /** Message to display. */
        text?: string;
        styles?: {
            content?: React.CSSProperties,
            wrapper?: React.CSSProperties,
            overlay?: React.CSSProperties,
            spinner?: React.CSSProperties
        };
    }
    export default LoadingOverlay;
}