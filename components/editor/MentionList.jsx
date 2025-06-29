import React, { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import styles from "@/components/editor/Editor.module.scss"

const MentionList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];
    if (item) {
      console.log("item", item)
      props.command({ id: item.id, thing: "wut", label: item.label })
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      console.log('onKeyDown', event.key);
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  return (
    <div className={styles.mentionSuggestions}>
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`${styles.mentionItem} ${index === selectedIndex ? styles.selectedMentionItem : ''}`}
            key={index}
            onClick={() => selectItem(index)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            {item.label}
          </button>
        ))
      ) : (
        <div className={styles.mentionItem}>No result</div>
      )}
    </div>
  );
});

MentionList.displayName = 'MentionList';

export default MentionList;
