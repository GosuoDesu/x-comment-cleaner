/* global chrome */
const enum StorageTag {
    isFilterCopycat = 'isFilterCopycat',
    maximumCommentAmount = 'maximumCommentAmount',
    isAllowEmojiOnlyComment = 'isAllowEmojiOnlyComment',
    isKillerOn = 'isKillerOn',
}

const storeLocal = (key: StorageTag, value: any) => {
    chrome.storage.local.set({ [key]: value });
}

const getLocal = (key: StorageTag, callback: (data: any) => void) => {
    chrome.storage.local.get(key, callback);
}

export {
    StorageTag,
    storeLocal,
    getLocal,
}
