/* global chrome */
const enum StorageTag {
    isFilterCopycat = 'isFilterCopycat',
    maximumCommentAmount = 'maximumCommentAmount',
    isAllowEmojiOnlyComment = 'isAllowEmojiOnlyComment',
    isKillerOn = 'isKillerOn',
    blackListOwnerTags = 'blackListOwnerTags',
}

const storeLocal = (key: StorageTag, value: any): void => {
    chrome.storage.local.set({ [key]: value });
}

const getLocal = (key: StorageTag, callback: (data: any) => void): void => {
    chrome.storage.local.get(key, callback);
}

const addToLocalList = (key: StorageTag, value: any): void => {
    getLocal(key, (data) => {
        const list = data[key] || [];
        list.push(value);
        storeLocal(key, list);
    });
}

export {
    StorageTag,
    storeLocal,
    getLocal,
    addToLocalList,
}
