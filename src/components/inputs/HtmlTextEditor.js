import { Box, useTheme } from "@mui/material";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { isEmpty, isString } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useSelector } from "react-redux";

const HtmlTextEditor = ({
  sx,
  onChange,
  editorRootSx,
  editorToolbarSx,
  editorMainSx,
  suppressOuterBorder,
  maxHeight = "240px",
  readOnly = false,
  // maxHeight = "540px",
  minHeight,
  placeholder = "Start typing...",
  borderRadius = "8px",
  backgroundColor,

  children,
  /**
   * Accepts an HTML string or a Draft.js EditorState to pre-populate the editor.
   */
  value,
}) => {
  const theme = useTheme();
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // For setting default font size
  const [editorInitialized, setEditorInitialized] = useState(false);

  const users = useSelector((state) => state?.users);
  const mentions = useMemo(
    () =>
      (users || [])
        .map((user) => ({
          url: user?.fullName,
          text: `${user?.fullName} <${user?.emailAddress}>`,
          value: user?.emailAddress,
        }))
        .sort((a, b) => a.value.localeCompare(b.value)),
    [users]
  );

  // If "value" changes from outside, update local editor state
  useEffect(() => {
    if (isString(value)) {
      const trimmedValue = value.trim();
      if (!isEmpty(trimmedValue)) {
        const { contentBlocks, entityMap } = htmlToDraft(trimmedValue);
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setEditorState(EditorState.createEmpty());
      }
    } else if (value && value.getCurrentContent) {
      // If "value" is already a Draft.js EditorState
      setEditorState(value);
    }
    // Otherwise, assume an empty editor.
  }, [value]);

  // Called whenever the user modifies the editor
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);

    // Convert editor content to raw Draft.js format
    const rawContentState = convertToRaw(newEditorState.getCurrentContent());
    // Convert raw content state to HTML
    const htmlString = draftToHtml(rawContentState);
    // Plain text
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

  // Determine if the editor is empty, to hide the toolbar if so
  const isEditorEmpty = useMemo(
    () => !editorState.getCurrentContent().hasText(),
    [editorState]
  );

  // Setup default font size when editor is initialized
  useEffect(() => {
    if (editorRef.current && !editorInitialized) {
      // Find the font size dropdown button and simulate a click
      setTimeout(() => {
        const fontSizeButton = document.querySelector(
          ".rdw-fontsize-wrapper button"
        );
        if (fontSizeButton) {
          fontSizeButton.click();

          // Find and click the 12px option
          setTimeout(() => {
            const fontSizeOptions = document.querySelectorAll(
              ".rdw-fontsize-dropdown-option-button"
            );
            for (let i = 0; i < fontSizeOptions.length; i++) {
              if (fontSizeOptions[i].textContent === "12") {
                fontSizeOptions[i].click();
                setEditorInitialized(true);
                break;
              }
            }
          }, 50);
        }
      }, 100);
    }
  }, [editorRef.current, editorInitialized]);

  // Styles
  const styles = useMemo(() => {
    if (readOnly) {
      return {
        ".rdw-editor-main": {
          "div, span, p": {
            fontFamily: "var(--primaryFont)",
            fontSize: "12px", // Default font size for read-only mode
          },
          ...editorMainSx,
        },
      };
    }
    return {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      ".rdw-editor-wrapper": {
        borderRadius,
        backgroundColor: "#fff",
        border: suppressOuterBorder
          ? "none"
          : `1px solid ${theme.palette.separator}`,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        ...editorRootSx,
      },
      ".rdw-editor-toolbar": {
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        border: "none",
        // borderColor: theme.palette.separator,
        borderBottom: `1px solid ${theme.palette.separator}`,
        mb: 0,
        ...editorToolbarSx,
      },
      ".rdw-editor-main": {
        backgroundColor,
        minHeight: isEditorEmpty ? minHeight : "220px",
        maxHeight,
        // overflowY: "hidden",
        height: "auto",
        // overflowY: "auto",
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
        pl: 1,
        pr: 1,
        "div, span, p": {
          fontFamily: "var(--primaryFont)",
          fontSize: "12px", // Set default font size for all text
        },
        ...editorMainSx,
      },
      ".public-DraftEditor-content": {
        fontSize: "12px", // Additional target for font size
      },
      ...sx,
    };
  }, [
    borderRadius,
    suppressOuterBorder,
    editorRootSx,
    editorToolbarSx,
    editorMainSx,
    backgroundColor,
    minHeight,
    maxHeight,
    sx,
    theme,
    readOnly,
    isEditorEmpty,
  ]);

  return (
    <Box sx={styles}>
      <Editor
        ref={editorRef}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder={placeholder}
        toolbar={toolbarConfig}
        handlePastedText={() => false}
        readOnly={readOnly}
        editorClassName="custom-editor-12px" // Add custom class for additional styling
        toolbarHidden={isEditorEmpty || readOnly}
        mention={{
          separator: " ",
          trigger: "@",
          suggestions: mentions,
        }}
      />
      {children}

      {/* Hidden style tag to override default styles */}
      <style jsx global>{`
        .custom-editor-12px {
          font-size: 12px !important;
        }
        .custom-editor-12px .public-DraftStyleDefault-block {
          font-size: 12px !important;
        }
      `}</style>
    </Box>
  );
};

export const getAllDraftJsMentions = (editorState) => {
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  const mentions = [];

  rawContentState.blocks.forEach((block) => {
    if (block.entityRanges.length > 0) {
      block.entityRanges.forEach((entityRange) => {
        const entity = rawContentState.entityMap[entityRange.key];
        if (entity.type === "MENTION") {
          mentions.push(entity?.data?.url);
        }
      });
    }
  });

  return mentions;
};

// Modify toolbar config to select 12 as default font size
const toolbarConfig = {
  options: [
    "fontSize",
    "colorPicker",
    "inline",
    "list",
    "link",
    "history",
    "remove",
  ],
  inline: { inDropdown: true },
  list: { inDropdown: true },
  textAlign: { inDropdown: true },
  link: { inDropdown: true },
  fontSize: {
    options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
  },
};

export default HtmlTextEditor;
