import { ErrorBoundary } from 'react-error-boundary';
import bocchiError from './assets/bocchi-error.webp';

function ErrorBoundaryFallback() {
    return (
        <div className="outer-error-container">
            oh... uhhh... well this is awkward. we have encountered an issue while rendering this page{' '}
            <img src={bocchiError} alt="" />
            the error has been automatically reported to the cmueats team
            <div className="outer-error-container__small-text">
                Please <a href=".">refresh the page</a> or check dining hours on GrubHub or{' '}
                <a href="https://apps.studentaffairs.cmu.edu/dining/conceptinfo/" target="_blank" rel="noreferrer">
                    https://apps.studentaffairs.cmu.edu/dining/conceptinfo/
                </a>{' '}
                for now
            </div>
        </div>
    );
}
export default function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
    return <ErrorBoundary fallback={<ErrorBoundaryFallback />}>{children}</ErrorBoundary>;
}
