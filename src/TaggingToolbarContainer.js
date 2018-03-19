import React from "react";
import * as R from "ramda";

const getTagIds = R.pluck("tag");
const getTags = R.prop("tags");
const getTagIdsOfGroup = R.pipe(getTags, getTagIds);

class TaggingToolbarContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTags: this.props.selectedTags
    };
  }

  findTagGroupByTagId = tagId => {
    const { taggingConfig } = this.props;
    const tagIdInGroup = group => {
      return R.contains(tagId, getTagIdsOfGroup(group));
    };
    return R.find(tagIdInGroup)(taggingConfig.groups);
  };

  isTagGroupActive = selectedTags => {
    return tagGroup => {
      const hasNoCondition = R.pipe(R.has("condition"), R.not);
      const hasSelectedTags = R.pipe(
        R.path(["condition", "tagsAny"]),
        R.intersection(selectedTags),
        R.isEmpty,
        R.not
      );
      return R.either(hasNoCondition, hasSelectedTags)(tagGroup);
    };
  };

  handleChange = tagGroup => {
    return tagInCurrentGroup => {
      const tagsOfCurrentGroup = getTagIdsOfGroup(tagGroup);
      const tagsNotInCurrentGroup = R.difference(
        this.state.selectedTags,
        tagsOfCurrentGroup
      );

      const isGroupActive = this.isTagGroupActive(tagsNotInCurrentGroup);
      const isTagActive = R.pipe(this.findTagGroupByTagId, isGroupActive);
      const removeInactiveTags = R.filter(isTagActive);

      let tagsToSave = R.concat(tagInCurrentGroup, tagsNotInCurrentGroup);
      tagsToSave = removeInactiveTags(tagsToSave);

      this.props.onChange(tagsToSave);
      // Optimistic update
      this.setState({ selectedTags: tagsToSave });
    };
  };

  getVisibleTagGroups = () => {
    const { taggingConfig, showInactiveGroups } = this.props;

    if (showInactiveGroups) {
      return taggingConfig.groups;
    }

    const removeInactiveGroups = R.filter(
      this.isTagGroupActive(this.state.selectedTags)
    );
    return removeInactiveGroups(taggingConfig.groups);
  };

  getOptionsForTagGroup = tagGroup => {
    const addToValueKey = R.assoc("value");
    const transformTagToOption = R.converge(addToValueKey, [
      R.prop("tag"),
      R.identity
    ]);
    return R.map(transformTagToOption, tagGroup.tags);
  };

  getSelectedForTagGroup = tagGroup => {
    const getFirstSelectedTag = R.pipe(
      R.map(R.prop("tag")),
      R.intersection(this.state.selectedTags),
      R.head
    );
    return getFirstSelectedTag(tagGroup.tags);
  };

  clearTags = () => {
    this.setState({ selectedTags: [] });
    this.props.onChange([]);
  };

  render() {
    const ToolbarDisplay = this.props.toolbarDisplay;

    return (
      <ToolbarDisplay
        getVisibleTagGroups={this.getVisibleTagGroups}
        isTagGroupActive={this.isTagGroupActive(this.state.selectedTags)}
        onTagGroupChange={this.handleChange}
        getOptionsForTagGroup={this.getOptionsForTagGroup}
        getSelectedForTagGroup={this.getSelectedForTagGroup}
      />
    );
  }
}

export default TaggingToolbarContainer;
