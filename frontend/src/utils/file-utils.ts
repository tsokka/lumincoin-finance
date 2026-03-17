export class FileUtils {
    public static loadPageScript(src: string): Promise<string> {
        return new Promise<string>(
            (resolve: (value: string | PromiseLike<string>) => void,
             reject: (reason: Error) => void
            ): void => {
                const script: HTMLScriptElement = document.createElement('script');
                script.src = src;
                script.onload = (): void => resolve('Script loaded: ' + src);
                script.onerror = (): void => reject(new Error('Script load error for: ' + src));
                document.body.appendChild(script);
            });
    }

    public static loadPageStyle(src: string, insertBeforeElement?: Node | null): void {
        const link: HTMLLinkElement = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;

        if (insertBeforeElement) {
            document.head.insertBefore(link, insertBeforeElement);
        } else {
            document.head.appendChild(link);
        }
    }
}