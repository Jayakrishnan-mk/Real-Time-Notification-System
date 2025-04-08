export const log = (message: string, ...optionalParams: any[]) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, ...optionalParams);
};

export const logError = (message: string, ...optionalParams: any[]) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ${message}`, ...optionalParams);
};
