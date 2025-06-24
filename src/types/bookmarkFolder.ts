export type BookmarkFolder = {
    name: string;
    apps: Bookmark[];
    isDefault?: boolean; // Indicates if this is a default folder
};

export type Bookmark = {
    appId: string;        // required for iOS
    platform: 'ios' | 'android';
}