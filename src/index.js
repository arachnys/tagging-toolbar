import React from "react";
import * as R from "ramda";

import TaggingToolbarContainer from "./TaggingToolbarContainer";
import ToolbarDisplay from "./ui/ToolbarDisplay";
import AntdToolbarDisplay from "./ui/AntdToolbarDisplay";

const createToolbar = (ToolbarDisplay) => {
    return (props) => (
        <TaggingToolbarContainer
            toolbarDisplay={ToolbarDisplay}
            {...props}
        />
    );
};

export const TaggingToolbar = createToolbar(ToolbarDisplay);
export const AntdTaggingToolbar = createToolbar(AntdToolbarDisplay);

export const getAllTagsFromGroups = R.pipe(R.pluck("tags"), R.flatten);
