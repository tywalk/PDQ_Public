declare module 'react-loading-overlay' {
    export const LoadingOverlay: React.StatelessComponent<ILoader>;
    export interface ILoader extends React.HTMLAttributes<HTMLElement> {
        active: boolean;
        fadeSpeed?: number;
        onClick?: () => void;
        className?: string;
        classNamePrefix?: string;
        spinner: boolean | Node;
        text?: string;
        styles?: string;
    }
    export default LoadingOverlay;
}