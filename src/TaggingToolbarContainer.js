import React from "react";
import * as R from "ramda";

class TaggingToolbarContainer extends React.Component {
  constructor(props) {
    super(props);
    const { selectedTags } = this.props;

    this.state = {
      selectedTags: selectedTags || []
    };
  }

  findTagGroupByTagId = tagId => {
    const { taggingConfig } = this.props;
    const tagIdInGroup = group => {
      return R.contains(tagId, R.pluck("tag", group.tags));
    };
    return R.find(tagIdInGroup)(taggingConfig.groups);
  };

  handleChange = tagGroup => {
    return tagInCurrentGroup => {
      const tagsOfCurrentGroup = R.map(R.prop("tag"), tagGroup.tags);

      const isCurrentGroupTag = R.contains(R.__, tagsOfCurrentGroup);
      const removeTagIfInCurrentGroup = R.reject(isCurrentGroupTag);
      const tagsNotInCurrentGroup = removeTagIfInCurrentGroup(
        this.state.selectedTags
      );

      const getTagGroup = R.curry(this.findTagGroupByTagId);
      const isGroupActive = R.curry(
        this.isTagGroupActive(tagsNotInCurrentGroup)
      );
      const isTagActive = R.pipe(getTagGroup, isGroupActive);
      const removeInactiveTags = R.filter(isTagActive);

      let tagsToSave = R.concat(tagInCurrentGroup, tagsNotInCurrentGroup);
      tagsToSave = removeInactiveTags(tagsToSave);

      this.props.onChange(tagsToSave);
      // Optimistic update
      this.setState({ selectedTags: tagsToSave });
    };
  };

  isTagGroupActive(selectedTags) {
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
  }

  getVisibleTagGroups = () => {
    const { taggingConfig } = this.props;

    return R.filter(
      this.isTagGroupActive(this.state.selectedTags),
      taggingConfig.groups
    );
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
        onTagGroupChange={this.handleChange}
        getOptionsForTagGroup={this.getOptionsForTagGroup}
        getSelectedForTagGroup={this.getSelectedForTagGroup}
      />
    );
  }
}

export default TaggingToolbarContainer;
