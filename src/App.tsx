import { useEffect, useState } from 'react';
import SwitchSelector from './component/SwitchSelector';
import NumberInput from './component/NumberInput';
import { getLocal, StorageTag, storeLocal } from './constant/Storage';

function App() {
  const [isFilterCopycat, setIsFilterCopycat] = useState<boolean>(false);
  const [maximumCommentAmount, setMaximumCommentAmount] = useState<number>(3);
  const [isAllowEmojiOnlyComment, setIsAllowEmojiOnlyComment] = useState<boolean>(false);
  const [isKillerOn, setIsKillerOn] = useState<boolean>(true);
  const [isFilterBannedWordsName, setIsFilterBannedWordsName] = useState<boolean>(true);

  useEffect(() => {
    getLocal(StorageTag.isFilterCopycat, (data) => { setIsFilterCopycat(data.isFilterCopycat) });
    getLocal(StorageTag.maximumCommentAmount, (data) => { setMaximumCommentAmount(data.maximumCommentAmount) });
    getLocal(StorageTag.isAllowEmojiOnlyComment, (data) => { setIsAllowEmojiOnlyComment(data.isAllowEmojiOnlyComment) });
    getLocal(StorageTag.isKillerOn, (data) => { setIsKillerOn(data.isKillerOn) });
    getLocal(StorageTag.isFilterBannedWordsName, (data) => { setIsFilterBannedWordsName(data.isFilterBannedWordsName) });
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

  const updateFilterBannedWordsName = (isFilterBannedWordsName: boolean): void => {
    storeLocal(StorageTag.isFilterBannedWordsName, isFilterBannedWordsName);
  }

  return (
    <div className="App" style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      width: 'min-content',
    }}>
      <h1>X Comment Cleaner</h1>
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
      <SwitchSelector label="Filter Banned Words Name" checked={isFilterBannedWordsName} onChange={() => {
        setIsFilterBannedWordsName(!isFilterBannedWordsName);
        updateFilterBannedWordsName(!isFilterBannedWordsName);
      }} />
    </div>
  );
}

export default App;