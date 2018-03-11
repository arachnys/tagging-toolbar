import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { TaggingToolbar, AntdTaggingToolbar } from "../src";

const taggingConfig = {
    "type": "standard",
    "groups": [
        {
            "displayName": "Alert status",
            "tags": [
                {
                    "tag": 869,
                    "label": "Applicable"
                },
                {
                    "tag": 866,
                    "label": "Not Applicable"
                }
            ]
        },
        {
            "displayName": "Risk Type",
            "condition": {
                "tagsAny": [869]
            },
            "tags": [
		{
                    "tag": 863,
                    "label": "Hit"
                },
		{
                    "tag": 856,
                    "label": "Litigation"
                },
		{
                    "tag": 885,
                    "label": "Supporting Evidence"
		}
            ]
        }
    ]
}

storiesOf("TaggingToolbar", module)
    .add("with a generic config", () => {
        return (
            <div style={{height: "200px"}}>
                <div style={{marginTop: "100px"}}>
                    <TaggingToolbar
                        selectedTags={[]}
                        taggingConfig={taggingConfig}
                        onChange={action('onChange')}
                    />
                </div>
            </div>
        );
    });

storiesOf("AntdTaggingToolbar", module)
  .add("with a generic config", () => {
        return (
            <div style={{height: "200px"}}>
                <div style={{marginTop: "100px"}}>
                    <AntdTaggingToolbar
                        selectedTags={[]}
                        taggingConfig={taggingConfig}
                        onChange={action('onChange')}
                    />
                </div>
            </div>
        );
    });
