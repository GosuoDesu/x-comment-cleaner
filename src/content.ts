/*global chrome*/

import { getLocal, StorageTag } from "./constant/Storage";

interface Tweet {
    baseNode: HTMLElement;
    tweetOwnerName: string;
    tweetOwnerTag: string;
    tweetContent: string;
    tweetTime: Date;
}

const blackListOwnerTags: string[] = [];
const CommentAmountCounter: {
    [key: string]: number;
} = {};
const handledTweets: Tweet[] = [];
let zombieCount: number = 0;
let observer: MutationObserver | null = null;
let currentPostId: string = "";

function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
        Array.from<number>({ length: b.length + 1 }).fill(0)
    );

    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // Deletion
                matrix[i][j - 1] + 1,      // Insertion
                matrix[i - 1][j - 1] + cost  // Substitution
            );
        }
    }

    return matrix[a.length][b.length];
}

const addToBlackList = (tweetOwnerTag: string): void => {
    if (!blackListOwnerTags.includes(tweetOwnerTag)) {
        blackListOwnerTags.push(tweetOwnerTag);
    }
}

const handleCopyCat = (comment: string, tweetOwnerTag: string, tweetTime: Date): void => {
    const isHashTag: boolean = comment.startsWith('#');
    if (isHashTag) {
        return;
    }
    handledTweets.forEach((tweet) => {
        const distance: number = levenshteinDistance(comment, tweet.tweetContent);
        const isSimilar: boolean = distance < 10;
        const isSameOwner: boolean = tweetOwnerTag === tweet.tweetOwnerTag;
        if (isSimilar && !isSameOwner) {
            const isThisTweetFirst: boolean = tweetTime < tweet.tweetTime;
            if (isThisTweetFirst) {
                addToBlackList(tweetOwnerTag);
            } else {
                addToBlackList(tweet.tweetOwnerTag);
            }

        }
    });
}

const HandleTweetContent = () => {
    let isTurnOnCopyCat: boolean = false;
    getLocal(StorageTag.isFilterCopycat, (data) => {
        isTurnOnCopyCat = data.isFilterCopycat || false;
    });
    let AllowedCommentAmount: number = 3;
    getLocal(StorageTag.maximumCommentAmount, (data) => {
        AllowedCommentAmount = data.maximumCommentAmount || 3;
    });
    let isAllowEmojiOnlyComment: boolean = false;
    getLocal(StorageTag.isAllowEmojiOnlyComment, (data) => {
        isAllowEmojiOnlyComment = data.isAllowEmojiOnlyComment || false;
    });
    let isKillerOn: boolean = true;
    getLocal(StorageTag.isKillerOn, (data) => {
        isKillerOn = data.isKillerOn || true;
    });

    const clearHandledTweets = (): void => {
        handledTweets.splice(0, handledTweets.length);
    }

    const resetCurrentPostId = (): void => {
        currentPostId = "";
    }

    const getPostIdFromUrl = (): string => {
        return window.location.href.split('status/').pop() || "";
    }

    const extractTweet = (node: HTMLElement): Tweet | null => {
        const tweetContentNode = node.lastChild?.lastChild?.lastChild?.lastChild;
        const tweetOwnerName = tweetContentNode?.childNodes[0]?.lastChild?.firstChild?.lastChild?.lastChild?.firstChild?.textContent;
        const tweetOwnerTag = tweetContentNode?.childNodes[0]?.lastChild?.firstChild?.lastChild?.lastChild?.lastChild?.firstChild?.firstChild?.textContent;
        const tweetContent = tweetContentNode?.childNodes[1]?.textContent;
        const tweetTimeDOM = tweetContentNode?.childNodes[0]?.lastChild?.firstChild?.lastChild?.lastChild?.lastChild?.lastChild?.lastChild?.lastChild?.childNodes[0] as HTMLElement;
        const tweetTime = tweetTimeDOM?.getAttribute('datetime');

        if (!tweetOwnerName || !tweetOwnerTag || !tweetTime) {
            return null;
        }

        return {
            baseNode: node,
            tweetOwnerName: tweetOwnerName || "",
            tweetOwnerTag: tweetOwnerTag || "",
            tweetContent: tweetContent || "",
            tweetTime: new Date(tweetTime || "")
        }
    }

    // Clear handledTweets
    clearHandledTweets();
    // Function to handle the addition of new elements with a specific class
    function handleNewElements(mutationsList: MutationRecord[], observer: MutationObserver) {
        const isTweetPostPage = window.location.href.includes('status');
        // Loop through the list of mutations
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (!isTweetPostPage) {
                    clearHandledTweets();
                    resetCurrentPostId();
                    return;
                }
                const thisPostId: string = getPostIdFromUrl();
                const isSamePost: boolean = currentPostId === thisPostId;
                if (!isSamePost) {
                    clearHandledTweets();
                    currentPostId = thisPostId;
                }
                mutation.addedNodes.forEach((node) => {
                    const isTweetPost: boolean = node instanceof HTMLElement &&
                        node.className === 'css-175oi2r' && node.nodeName === 'DIV' &&
                        node.attributes.getNamedItem('data-testid') !== null
                        && node.lastChild?.lastChild?.lastChild?.nodeName === 'ARTICLE';
                    if (!isTweetPost) {
                        return;
                    }

                    const tweet: ChildNode | null | undefined = node.lastChild?.lastChild?.lastChild;
                    if (!tweet) {
                        return;
                    }

                    const tweetRecord: Tweet | null = extractTweet(tweet as HTMLElement);
                    if (!tweetRecord) {
                        return;
                    }
                    const { tweetOwnerTag, tweetContent, tweetTime, tweetOwnerName }: Tweet = tweetRecord;
                    const isTweetValid: boolean = tweetOwnerName !== "" && tweetOwnerTag !== "" && tweetTime !== null;

                    if (isTweetValid) {
                        incrementCommentCount(tweetOwnerTag);
                        if (isZombieComment(tweetContent, tweetOwnerTag, tweetTime)) {
                            addToBlackList(tweetOwnerTag);
                            removeParentNode(tweet as HTMLElement);
                        } else {
                            handledTweets.push(tweetRecord);
                        }
                        handleOldComments();
                    }
                }
                );
            }
        }

    }

    const incrementCommentCount = (tweetOwnerTag: string): void => {
        const isCounterInitialized: boolean = CommentAmountCounter[tweetOwnerTag] !== undefined;
        if (!isCounterInitialized) {
            CommentAmountCounter[tweetOwnerTag] = 0;
        }
        CommentAmountCounter[tweetOwnerTag]++;

        const isEnabled: boolean = AllowedCommentAmount > 0;
        const isCountExceed: boolean = CommentAmountCounter[tweetOwnerTag] > AllowedCommentAmount;
        if (isEnabled && isCountExceed) {
            addToBlackList(tweetOwnerTag);
        }

    }

    const isZombieComment = (comment: string | undefined | null, tweetOwnerTag: string, tweetTime: Date): boolean => {
        if (isTurnOnCopyCat) {
            handleCopyCat(comment || "", tweetOwnerTag, tweetTime);
        }

        const trimedComment: string = comment?.trim() || "";
        const isEmoji: boolean = trimedComment.length === 0;
        const isZombie: boolean = (isKillerOn) && ((!isAllowEmojiOnlyComment && isEmoji) || blackListOwnerTags.includes(tweetOwnerTag));
        if (isZombie) {
            zombieCount++;
        }
        return isZombie;
    }

    window.onload = (): void => {
        // Create a MutationObserver instance
        observer = new MutationObserver(handleNewElements);

        // Start observing the target node for configured mutations
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    const removeParentNode = (node: HTMLElement): void => {
        node.parentElement?.remove();
    }

    const handleOldComments = (): void => {
        handledTweets.forEach((tweet) => {
            if (isZombieComment(tweet.tweetContent, tweet.tweetOwnerTag, tweet.tweetTime)) {
                addToBlackList(tweet.tweetOwnerTag);
                removeParentNode(tweet.baseNode);
                removeHandledTweet(tweet);
            }
        });
    }

    const removeHandledTweet = (tweet: Tweet): void => {
        handledTweets.splice(handledTweets.indexOf(tweet), 1);
    }

}

export const init = (): void => {
    HandleTweetContent();
}


init();