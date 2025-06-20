export type BookmarkFolder = {
    name: string;
    apps: Bookmark[];
};

export type Bookmark = {
    appId: string;        // required for iOS
    platform: 'ios' | 'android';
}