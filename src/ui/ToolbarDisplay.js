import React from "react";
import "react-select/dist/react-select.css";
import Select from "react-select";
import ToolbarWrapper from "./ToolbarWrapper";

import { css } from "glamor";

const styles = {
  taggingDropdown: css({
    display: "inline-block",
    marginRight: "1rem",
    width: "11rem",
    "& .Select-menu-outer": {
      top: "auto",
      bottom: "100%"
    }
  })
};

export default class ToolbarDisplay extends React.Component {
  handleChange = tagGroup => {
    return event => {
      const tagInCurrentGroup = event ? [event.value] : [];
      this.props.onTagGroupChange(tagGroup)(tagInCurrentGroup);
    };
  };

  render() {
    const {
      getOptionsForTagGroup,
      getSelectedForTagGroup,
      getVisibleTagGroups,
      wrapper
    } = this.props;
    const Wrapper = wrapper ? wrapper : "div";

    return (
      <ToolbarWrapper>
        {getVisibleTagGroups().map(tagGroup => {
          return (
            <Wrapper key={tagGroup.displayName}>
              <Select
                key={tagGroup.displayName}
                className={`${styles.taggingDropdown}`}
                onChange={this.handleChange(tagGroup)}
                options={getOptionsForTagGroup(tagGroup)}
                placeholder={tagGroup.displayName}
                value={getSelectedForTagGroup(tagGroup)}
              />
            </Wrapper>
          );
        })}
      </ToolbarWrapper>
    );
  }
}
