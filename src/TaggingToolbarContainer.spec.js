import React from "react";
import { mount } from "enzyme";
import { AntdTaggingToolbar } from "./index";

const AntdTestConfig = {
  name: "AntdTaggingToolbar",

  getComponent: (props, selectedTags = []) => {
    return mount(<AntdTaggingToolbar {...props} selectedTags={selectedTags} />);
  },

  getDropdowns: component => {
    return component.find(".ant-select");
  },

  getDropdownByName: (component, dropdownName) => {
    const dropdowns = AntdTestConfig.getDropdowns(component);
    return dropdowns.filterWhere(n => n.text() === dropdownName);
  },

  clickDropdown: dropdown => {
    dropdown.simulate("click");
  },

  isDropdownDisabled: dropdown => {
    return dropdown.hasClass("ant-select-disabled");
  },

  getOptions: (component, dropdownName) => {
    return component.findWhere(
      n => n.type() == "li" && n.hasClass(dropdownName)
    );
  },

  selectByText: (options, optionText) => {
    options.filterWhere(n => n.contains(optionText)).simulate("click");
  }
};

const configs = [AntdTestConfig];

describe("TaggingToolbar", () => {
  configs.forEach(config => {
    describe(config.name, () => {
      const mockOnChange = jest.fn();

      const getProps = () => {
        return {
          onChange: mockOnChange,
          taggingConfig: {
            groups: [
              {
                displayName: "Relevance",
                tags: [
                  {
                    tag: 1,
                    label: "Name match hit"
                  },
                  {
                    tag: 2,
                    label: "Verified hit"
                  },
                  {
                    tag: 3,
                    label: "Name mismatch"
                  }
                ]
              },
              {
                displayName: "Hit type",
                condition: {
                  tagsAny: [1, 2]
                },
                tags: [
                  {
                    tag: 4,
                    label: "Sanctions"
                  },
                  {
                    tag: 5,
                    label: "Watchlist"
                  },
                  {
                    tag: 6,
                    label: "Adverse media"
                  }
                ]
              }
            ]
          }
        };
      };

      describe("default state", () => {
        it("should display the default dropdown", () => {
          const comp = config.getComponent(getProps());
          expect(config.getDropdowns(comp).length).toEqual(1);
        });

        it("should display the name of the first dropdown", () => {
          const comp = config.getComponent(getProps());
          expect(config.getDropdownByName(comp, "Relevance").length).toEqual(1);
        });

        it("should display the options of the group when clicked", () => {
          const comp = config.getComponent(getProps());

          const dropdown = config.getDropdownByName(comp, "Relevance");
          config.clickDropdown(dropdown);
          const options = config.getOptions(comp, "relevance");
          expect(options.map(n => n.text())).toEqual([
            "Name match hit",
            "Verified hit",
            "Name mismatch"
          ]);
        });
      });

      describe("default state when show inactive groups is enabled", () => {
        it("should display a dropdown for each group", () => {
          const props = getProps();
          const comp = config.getComponent({
            showInactiveGroups: true,
            ...props
          });

          expect(config.getDropdownByName(comp, "Relevance").length).toEqual(1);
          expect(config.getDropdownByName(comp, "Hit type").length).toEqual(1);
        });

        it("should disable groups for which the condition is not met", () => {
          const props = getProps();
          const comp = config.getComponent({
            showInactiveGroups: true,
            ...props
          });

          const hitDropdown = config.getDropdownByName(comp, "Hit type");
          expect(config.isDropdownDisabled(hitDropdown)).toBeTruthy();
        });

        it("should enable groups once the condition is met", () => {
          const props = getProps();
          const comp = config.getComponent(
            { showInactiveGroups: true, ...props },
            [1]
          );

          const hitDropdown = config.getDropdownByName(comp, "Hit type");
          expect(config.isDropdownDisabled(hitDropdown)).toBeFalsy();
        });
      });

      describe("when selecting tags", () => {
        it("should update the selected tags with the new tag", () => {
          const comp = config.getComponent(getProps());

          const dropdown = config.getDropdownByName(comp, "Relevance");
          dropdown.simulate("click");

          const options = config.getOptions(comp, "relevance");
          config.selectByText(options, "Name match hit");

          expect(mockOnChange.mock.calls[0][0]).toEqual([1]);
        });

        it("should show dropdowns for groups whose condition is met", () => {
          const comp = config.getComponent(getProps(), [1]);

          expect(config.getDropdowns(comp).length).toEqual(2);
          const hitDropdown = config.getDropdownByName(comp, "Hit type");
          expect(hitDropdown.text()).toEqual("Hit type");
        });

        it("should hide dropdowns when their condition is no longer met", () => {
          const comp = config.getComponent(getProps());

          const dropdown = config.getDropdownByName(comp, "Relevance");
          dropdown.simulate("click");
          const options = config.getOptions(comp, "relevance");
          config.selectByText(options, "Name match hit");
          expect(config.getDropdowns(comp).length).toEqual(2);

          config.selectByText(options, "Name mismatch");
          expect(config.getDropdowns(comp).length).toEqual(1);
        });

        it("should remove tags belonging to invisible groups", () => {
          const comp = config.getComponent(getProps());

          const relevanceDropdown = config.getDropdownByName(comp, "Relevance");
          relevanceDropdown.simulate("click");
          const relevanceOptions = config.getOptions(comp, "relevance");
          config.selectByText(relevanceOptions, "Name match hit");

          const hitDropdown = config.getDropdownByName(comp, "Hit type");
          hitDropdown.simulate("click");
          const hitOptions = config.getOptions(comp, "hit-type");
          config.selectByText(hitOptions, "Sanctions");

          expect(
            mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
          ).toEqual([4, 1]);

          config.selectByText(relevanceOptions, "Name mismatch");

          expect(
            mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
          ).toEqual([3]);
        });
      });
    });
  });
});
