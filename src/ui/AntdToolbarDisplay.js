import React from "react";
import { Select } from "antd";
import ToolbarWrapper from "./ToolbarWrapper";
import "antd/dist/antd.css";

const styles = {
    taggingSelect: {
    	width: "200px",
    },
};

export default class AntdToolbarDisplay extends React.Component {
    handleChange = (tagGroup) => {
        return (newValue) => {
            const tagInCurrentGroup = newValue ? [newValue] : [];
	    return this.props.onTagGroupChange(tagGroup)(tagInCurrentGroup);
        }
    }

    render() {
        const {
            onTagGroupChange,
            getOptionsForTagGroup,
            getSelectedForTagGroup,
            getVisibleTagGroups,
            wrapper,
        } = this.props;
        const Wrapper = wrapper ? wrapper : "div";

        return (
            <ToolbarWrapper>
                {getVisibleTagGroups().map(tagGroup => (
                    <Wrapper key={tagGroup.displayName}>
                        <Select
                            onChange={this.handleChange(tagGroup)}
                            placeholder={tagGroup.displayName}
                            value={getSelectedForTagGroup(tagGroup)}
                            allowClear={true}
                            style={styles.taggingSelect}
                        >
                            {getOptionsForTagGroup(tagGroup).map(option => (
                                <Select.Option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Wrapper>
                ))}
            </ToolbarWrapper>
        );
    }
};
