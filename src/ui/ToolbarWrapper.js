// eslint-disable-next-line
import React from "react";

import { css } from "glamor";

const styles = {
  toolbarWrapper: css({
    display: "inline-block"
  })
};

const ToolbarWrapper = props => {
  return (
    <div className="arachnys-tagging-toolbar" {...styles.toolbarWrapper}>
      {props.children}
    </div>
  );
};

export default ToolbarWrapper;
