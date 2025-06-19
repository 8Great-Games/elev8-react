export type IOSScreenshot = { url: string };

export type IOScreenshotTypes = {
    iphone_6_5?: IOSScreenshot[];
    ipadPro_2018?: IOSScreenshot[];
    iphone_d74?: IOSScreenshot[];
    ipad?: IOSScreenshot[];
    iphone?: IOSScreenshot[];
    iphone5?: IOSScreenshot[];
    iphone6?: IOSScreenshot[];
    "iphone6+"?: IOSScreenshot[];
    [key: string]: IOSScreenshot[] | undefined;
};

export type BaseApp = {
    platform: 'ios' | 'android';
    screenshotsByType?: IOScreenshotTypes;
    screenshots?: string[];
    title?: string;
};

export type IOSApp = BaseApp & {
    platform: 'ios';
    appId: string;        // required for iOS
    bundleId?: never;     // not allowed
};

export type AndroidApp = BaseApp & {
    platform: 'android';
    bundleId: string;     // required for Android
    appId?: never;        // not allowed
};

export type App = IOSApp | AndroidApp;