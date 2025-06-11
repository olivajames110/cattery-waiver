import { ContentState, convertToRaw, EditorState, RichUtils } from "draft-js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./draft-js-styles.css";
// import "draft-js/dist/Draft.css"; // Import default Draft.js styles
import { Editor } from "react-draft-wysiwyg";
import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { isEmpty, isString } from "lodash";

const HtmlTextBox = ({
  sx,
  onChange,
  editorRootSx,
  editorToolbarSx,
  editorMainSx,
  suppressOuterBorder,
  maxHeight = "340px",
  minHeight = "120px",
  borderRadius = "8px",
  autoHeight,
  backgroundColor = grey[100],
  fullHeight,
  children,
  /**
   * Accept an HTML string or a Draft.js EditorState
   * to prepopulate the editor.
   */
  value,
}) => {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // If "value" changes from the outside, update our local editor state
  useEffect(() => {
    // Using Lodash for type checking
    if (isString(value)) {
      // If value is a string, check if it’s non-empty
      const trimmedValue = value.trim();
      if (!isEmpty(trimmedValue)) {
        const blocksFromHtml = htmlToDraft(trimmedValue);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      } else {
        // If the HTML string is empty, create an empty EditorState
        setEditorState(EditorState.createEmpty());
      }
    } else if (value && value.getCurrentContent) {
      // If "value" is already a Draft.js EditorState
      setEditorState(value);
    }
    // If "value" is something else or undefined, we simply ignore and keep an empty editor
  }, [value]);

  // This is called whenever the user modifies the editor
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);

    // Convert editor content to raw Draft.js format
    const rawContentState = convertToRaw(newEditorState.getCurrentContent());

    // Convert raw content state to HTML
    const htmlString = draftToHtml(rawContentState);

    // Get plain text
    const plainText = newEditorState.getCurrentContent().getPlainText("\u0001");

    if (onChange) {
      onChange({
        editorState: newEditorState,
        plainText,
        htmlString,
        blocks: rawContentState.blocks,
      });
    }
  };

  const styles = useMemo(() => {
    const renderedHeight = fullHeight ? "100%" : "auto";
    const renderedMaxHeight = fullHeight
      ? "unset"
      : maxHeight
        ? maxHeight
        : "unset";

    return {
      ...sx,
      display: "flex",
      // flexDirection: fullHeight ? "column" : "row",
      flexDirection: "column",
      width: "100%",
      height: renderedHeight,
      overflow: "hidden",
      // background: grey[50],
      ".rdw-editor-wrapper": {
        borderRadius: borderRadius,
        border: suppressOuterBorder ? "none" : "1px solid #f1f1f1",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "hidden",
        ...editorRootSx,
      },
      ".rdw-editor-toolbar": {
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        ...editorToolbarSx,
      },
      ".rdw-editor-main": {
        backgroundColor: backgroundColor,
        minHeight,
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        maxHeight: renderedMaxHeight,
        ...editorMainSx,
      },
    };
  }, [
    editorMainSx,
    backgroundColor,
    borderRadius,
    editorToolbarSx,
    maxHeight,
    editorRootSx,
    fullHeight,
    minHeight,
    suppressOuterBorder,
    autoHeight,
    sx,
  ]);

  return (
    <Box sx={styles}>
      <Editor
        ref={editorRef}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder="Start typing..."
        mention={{
          separator: " ",
          trigger: "@",
          suggestions: [
            { text: "APPLE", value: "apple" },
            { text: "BANANA", value: "banana", url: "banana" },
            { text: "CHERRY", value: "cherry", url: "cherry" },
            { text: "DURIAN", value: "durian", url: "durian" },
            { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
            { text: "FIG", value: "fig", url: "fig" },
            { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
            { text: "HONEYDEW", value: "honeydew", url: "honeydew" },
          ],
        }}
        toolbar={toolbarConfig}
      />
      {children}
    </Box>
  );
};

const toolbarConfig = {
  options: [
    "fontSize",
    "colorPicker",
    "inline",
    "list",
    "link",
    "history",
    "remove",
  ], //['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
  inline: { inDropdown: true },
  list: { inDropdown: true },
  textAlign: { inDropdown: true },
  link: { inDropdown: true },
};

const getAllDraftJsMentions = (editorState) => {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  const mentions = [];

  // Iterate through each block in the content state
  rawContentState.blocks.forEach((block) => {
    // Check if the block has entities
    if (block.entityRanges.length > 0) {
      // Iterate through each entity in the block
      block.entityRanges.forEach((entityRange) => {
        const entity = rawContentState.entityMap[entityRange.key];
        // Check if the entity type is mention
        console.log("entity", entity);
        if (entity.type === "MENTION") {
          mentions.push(entity?.data?.url);
        }
      });
    }
  });

  console.log("Mentions:", mentions);
  return mentions;
};

export default HtmlTextBox;
