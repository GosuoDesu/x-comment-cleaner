import { useEffect, useState } from 'react';
import SwitchSelector from './component/SwitchSelector';
import NumberInput from './component/NumberInput';
import { getLocal, StorageTag, storeLocal } from './constant/Storage';

function App() {
  const [isFilterCopycat, setIsFilterCopycat] = useState<boolean>(false);
  const [maximumCommentAmount, setMaximumCommentAmount] = useState<number>(3);
  const [isAllowEmojiOnlyComment, setIsAllowEmojiOnlyComment] = useState<boolean>(false);
  const [isKillerOn, setIsKillerOn] = useState<boolean>(true);
  const [blackListOwnerTags, setBlackListOwnerTags] = useState<string[]>([]);

  useEffect(() => {
    getLocal(StorageTag.isFilterCopycat, (data) => {
      if (data.isFilterCopycat === undefined) {
        storeLocal(StorageTag.isFilterCopycat, false);
      } else {
        setIsFilterCopycat(data.isFilterCopycat);
      }
    });
    getLocal(StorageTag.maximumCommentAmount, (data) => {
      if (data.maximumCommentAmount === undefined) {
        storeLocal(StorageTag.maximumCommentAmount, 3);
      } else {
        setMaximumCommentAmount(data.maximumCommentAmount);
      }
    });
    getLocal(StorageTag.isAllowEmojiOnlyComment, (data) => {
      if (data.isAllowEmojiOnlyComment === undefined) {
        storeLocal(StorageTag.isAllowEmojiOnlyComment, false);
      } else {
        setIsAllowEmojiOnlyComment(data.isAllowEmojiOnlyComment);
      }
    });
    getLocal(StorageTag.isKillerOn, (data) => {
      if (data.isKillerOn === undefined) {
        storeLocal(StorageTag.isKillerOn, true);
      } else {
        setIsKillerOn(data.isKillerOn);
      }
    });
    getLocal(StorageTag.blackListOwnerTags, (data) => {
      if (data.blackListOwnerTags === undefined) {
        storeLocal(StorageTag.blackListOwnerTags, []);
      } else {
        setBlackListOwnerTags(data.blackListOwnerTags);
      }
    });
  }, []);

  const updateFilterCopycat = (isFilterCopycat: boolean): void => {
    storeLocal(StorageTag.isFilterCopycat, isFilterCopycat);
  }

  const updateMaximumCommentAmount = (maximumCommentAmount: number): void => {
    storeLocal(StorageTag.maximumCommentAmount, maximumCommentAmount);
  }

  const updateAllowEmojiOnlyComment = (isAllowEmojiOnlyComment: boolean): void => {
    storeLocal(StorageTag.isAllowEmojiOnlyComment, isAllowEmojiOnlyComment);
  }

  const updateKillerOn = (isKillerOn: boolean): void => {
    storeLocal(StorageTag.isKillerOn, isKillerOn);
  }

  const clearBlackListOwnerTags = (): void => {
    setBlackListOwnerTags([]);
    storeLocal(StorageTag.blackListOwnerTags, []);
  }

  return (
    <div className="App" style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      width: 'min-content',
    }}>
      <h1>X Comment Cleaner</h1>
      <NumberInput label="Blacklisted Account Number" value={blackListOwnerTags.length ?? 0} editable={false} />
      <SwitchSelector label="Killer On" checked={isKillerOn} onChange={() => {
        setIsKillerOn(!isKillerOn);
        updateKillerOn(!isKillerOn);
      }} />
      <NumberInput label="Maximum Comment Amount" value={maximumCommentAmount} onChange={(e) => {
        setMaximumCommentAmount(parseInt(e.target.value));
        updateMaximumCommentAmount(parseInt(e.target.value));
      }} />
      <SwitchSelector label="Filter Copycat" checked={isFilterCopycat} onChange={() => {
        setIsFilterCopycat(!isFilterCopycat);
        updateFilterCopycat(!isFilterCopycat);
      }} />
      <SwitchSelector label="Allow Emoji Only Comment" checked={isAllowEmojiOnlyComment} onChange={() => {
        setIsAllowEmojiOnlyComment(!isAllowEmojiOnlyComment);
        updateAllowEmojiOnlyComment(!isAllowEmojiOnlyComment);
      }} />
      <button onClick={clearBlackListOwnerTags}>Clear Blacklist</button>
    </div>
  );
}

export default App;