import React from "react";
import TagItem from "./TagItem";

const TagList = ({ tags, onToggleSuccess }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => (
        <TagItem
          key={tag.id}
          tag={tag}
          onToggleSuccess={onToggleSuccess}
        />
      ))}
    </div>
  );
};

export default TagList;
