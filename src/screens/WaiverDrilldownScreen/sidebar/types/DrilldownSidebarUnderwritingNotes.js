import { Button } from "@mui/material";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HtmlTextEditor from "../../../../components/inputs/HtmlTextEditor";
import Flx from "../../../../components/layout/Flx";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import { sidebarClear } from "../../../../redux/actions/sidebarActions";
import DrilldownSidebarPane from "../DrilldownSidebarPane";

const DrilldownSidebarUnderwritingNotes = memo(() => {
  const loan = useSelector((state) => state.loanDrilldown);

  return (
    <DrilldownSidebarPane
      title="Underwriting Notes"
      // maxWidth="40vw"
      // initialWidth={"700px"}
      // variant="fixed"
    >
      <Notepad />
    </DrilldownSidebarPane>
  );
});

const Notepad = memo(() => {
  const loan = useSelector((state) => state.loanDrilldown);
  const underwritingNotes = useMemo(() => loan?.underwritingNotes, [loan]);
  const [comment, setComment] = useState(null); // Fix initialization
  const { updateUnderwritingNotes, loading } = useUnderwritingHook();
  const dispatch = useDispatch();

  const onSubmit = () => {
    console.log("comment", comment);
    // Remove return statement that prevents function from executing
    // return;
    updateUnderwritingNotes({
      loanId: loan?._id,
      data: comment,
      onSuccessFn: (response) => {
        dispatch(loanDrilldownSet(response));
        setComment(null);
      },
    });
  };

  useEffect(() => {
    console.log("underwritingNotes", underwritingNotes);
    // Check if underwritingNotes exists and has the expected format
    if (underwritingNotes?.htmlString) {
      setComment(underwritingNotes.htmlString); // Pass the HTML string instead of the whole object
    }
  }, [underwritingNotes]);

  return (
    <Flx column fw gap={1}>
      <HtmlTextEditor
        value={comment}
        onChange={(newValue) => {
          setComment(newValue); // Save the entire result object
        }}
        placeholder="Add a new comment..."
      />
      <Flx fw end>
        {comment?.plainText?.trim() && (
          <Button loading={loading} onClick={onSubmit} size="small">
            Update Underwriting Notes
          </Button>
        )}
      </Flx>
    </Flx>
  );
});

const no = {
  editorState: {
    _immutable: {
      allowUndo: true,
      currentContent: {
        entityMap: {},
        blockMap: {
          "1d4v2": {
            key: "1d4v2",
            type: "unstyled",
            text: "asdasd",
            characterList: [
              {
                style: [],
                entity: null,
              },
              {
                style: [],
                entity: null,
              },
              {
                style: [],
                entity: null,
              },
              {
                style: [],
                entity: null,
              },
              {
                style: [],
                entity: null,
              },
              {
                style: [],
                entity: null,
              },
            ],
            depth: 0,
            data: {},
          },
          "9lrlm": {
            key: "9lrlm",
            type: "unstyled",
            text: "",
            characterList: [],
            depth: 0,
            data: {},
          },
          ehvfm: {
            key: "ehvfm",
            type: "unstyled",
            text: "asd",
            characterList: [
              {
                style: [],
                entity: null,
              },
              {
                style: [],
                entity: null,
              },
              {
                style: [],
                entity: null,
              },
            ],
            depth: 0,
            data: {},
          },
          "93cll": {
            key: "93cll",
            type: "unstyled",
            text: "asd",
            characterList: [
              {
                style: [],
                entity: null,
              },
              {
                style: [],
                entity: null,
              },
              {
                style: [],
                entity: null,
              },
            ],
            depth: 0,
            data: {},
          },
          "5gli6": {
            key: "5gli6",
            type: "unstyled",
            text: "",
            characterList: [],
            depth: 0,
            data: {},
          },
        },
        selectionBefore: {
          anchorKey: "93cll",
          anchorOffset: 3,
          focusKey: "93cll",
          focusOffset: 3,
          isBackward: false,
          hasFocus: true,
        },
        selectionAfter: {
          anchorKey: "5gli6",
          anchorOffset: 0,
          focusKey: "5gli6",
          focusOffset: 0,
          isBackward: false,
          hasFocus: true,
        },
      },
      decorator: {
        _decorators: [{}, {}, {}],
      },
      directionMap: {
        "1d4v2": "LTR",
        "9lrlm": "LTR",
        ehvfm: "LTR",
        "93cll": "LTR",
        "5gli6": "LTR",
      },
      forceSelection: false,
      inCompositionMode: false,
      inlineStyleOverride: null,
      lastChangeType: "split-block",
      nativelyRenderedContent: null,
      redoStack: [],
      selection: {
        anchorKey: "5gli6",
        anchorOffset: 0,
        focusKey: "5gli6",
        focusOffset: 0,
        isBackward: false,
        hasFocus: false,
      },
      treeMap: {
        "1d4v2": [
          {
            start: 0,
            end: 6,
            decoratorKey: null,
            leaves: [
              {
                start: 0,
                end: 6,
              },
            ],
          },
        ],
        "9lrlm": [
          {
            start: 0,
            end: 0,
            decoratorKey: null,
            leaves: [
              {
                start: 0,
                end: 0,
              },
            ],
          },
        ],
        ehvfm: [
          {
            start: 0,
            end: 3,
            decoratorKey: null,
            leaves: [
              {
                start: 0,
                end: 3,
              },
            ],
          },
        ],
        "93cll": [
          {
            start: 0,
            end: 3,
            decoratorKey: null,
            leaves: [
              {
                start: 0,
                end: 3,
              },
            ],
          },
        ],
        "5gli6": [
          {
            start: 0,
            end: 0,
            decoratorKey: null,
            leaves: [
              {
                start: 0,
                end: 0,
              },
            ],
          },
        ],
      },
      undoStack: [
        {
          entityMap: {},
          blockMap: {
            "1d4v2": {
              key: "1d4v2",
              type: "unstyled",
              text: "asdasd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
            "9lrlm": {
              key: "9lrlm",
              type: "unstyled",
              text: "",
              characterList: [],
              depth: 0,
              data: {},
            },
            ehvfm: {
              key: "ehvfm",
              type: "unstyled",
              text: "asd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
            "93cll": {
              key: "93cll",
              type: "unstyled",
              text: "asd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
          },
          selectionBefore: {
            anchorKey: "93cll",
            anchorOffset: 0,
            focusKey: "93cll",
            focusOffset: 0,
            isBackward: false,
            hasFocus: true,
          },
          selectionAfter: {
            anchorKey: "93cll",
            anchorOffset: 3,
            focusKey: "93cll",
            focusOffset: 3,
            isBackward: false,
            hasFocus: true,
          },
        },
        {
          entityMap: {},
          blockMap: {
            "1d4v2": {
              key: "1d4v2",
              type: "unstyled",
              text: "asdasd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
            "9lrlm": {
              key: "9lrlm",
              type: "unstyled",
              text: "",
              characterList: [],
              depth: 0,
              data: {},
            },
            ehvfm: {
              key: "ehvfm",
              type: "unstyled",
              text: "asd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
            "93cll": {
              key: "93cll",
              type: "unstyled",
              text: "",
              characterList: [],
              depth: 0,
              data: {},
            },
          },
          selectionBefore: {
            anchorKey: "ehvfm",
            anchorOffset: 3,
            focusKey: "ehvfm",
            focusOffset: 3,
            isBackward: false,
            hasFocus: true,
          },
          selectionAfter: {
            anchorKey: "93cll",
            anchorOffset: 0,
            focusKey: "93cll",
            focusOffset: 0,
            isBackward: false,
            hasFocus: true,
          },
        },
        {
          entityMap: {},
          blockMap: {
            "1d4v2": {
              key: "1d4v2",
              type: "unstyled",
              text: "asdasd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
            "9lrlm": {
              key: "9lrlm",
              type: "unstyled",
              text: "",
              characterList: [],
              depth: 0,
              data: {},
            },
            ehvfm: {
              key: "ehvfm",
              type: "unstyled",
              text: "asd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
          },
          selectionBefore: {
            anchorKey: "ehvfm",
            anchorOffset: 0,
            focusKey: "ehvfm",
            focusOffset: 0,
            isBackward: false,
            hasFocus: true,
          },
          selectionAfter: {
            anchorKey: "ehvfm",
            anchorOffset: 3,
            focusKey: "ehvfm",
            focusOffset: 3,
            isBackward: false,
            hasFocus: true,
          },
        },
        {
          entityMap: {},
          blockMap: {
            "1d4v2": {
              key: "1d4v2",
              type: "unstyled",
              text: "asdasd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
            "9lrlm": {
              key: "9lrlm",
              type: "unstyled",
              text: "",
              characterList: [],
              depth: 0,
              data: {},
            },
            ehvfm: {
              key: "ehvfm",
              type: "unstyled",
              text: "",
              characterList: [],
              depth: 0,
              data: {},
            },
          },
          selectionBefore: {
            anchorKey: "9lrlm",
            anchorOffset: 0,
            focusKey: "9lrlm",
            focusOffset: 0,
            isBackward: false,
            hasFocus: true,
          },
          selectionAfter: {
            anchorKey: "ehvfm",
            anchorOffset: 0,
            focusKey: "ehvfm",
            focusOffset: 0,
            isBackward: false,
            hasFocus: true,
          },
        },
        {
          entityMap: {},
          blockMap: {
            "1d4v2": {
              key: "1d4v2",
              type: "unstyled",
              text: "asdasd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
            "9lrlm": {
              key: "9lrlm",
              type: "unstyled",
              text: "",
              characterList: [],
              depth: 0,
              data: {},
            },
          },
          selectionBefore: {
            anchorKey: "1d4v2",
            anchorOffset: 6,
            focusKey: "1d4v2",
            focusOffset: 6,
            isBackward: false,
            hasFocus: true,
          },
          selectionAfter: {
            anchorKey: "9lrlm",
            anchorOffset: 0,
            focusKey: "9lrlm",
            focusOffset: 0,
            isBackward: false,
            hasFocus: true,
          },
        },
        {
          entityMap: {},
          blockMap: {
            "1d4v2": {
              key: "1d4v2",
              type: "unstyled",
              text: "asdasd",
              characterList: [
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
                {
                  style: [],
                  entity: null,
                },
              ],
              depth: 0,
              data: {},
            },
          },
          selectionBefore: {
            anchorKey: "1d4v2",
            anchorOffset: 0,
            focusKey: "1d4v2",
            focusOffset: 0,
            isBackward: false,
            hasFocus: true,
          },
          selectionAfter: {
            anchorKey: "1d4v2",
            anchorOffset: 6,
            focusKey: "1d4v2",
            focusOffset: 6,
            isBackward: false,
            hasFocus: true,
          },
        },
        {
          entityMap: {},
          blockMap: {
            "1d4v2": {
              key: "1d4v2",
              type: "unstyled",
              text: "",
              characterList: [],
              depth: 0,
              data: {},
            },
          },
          selectionBefore: {
            anchorKey: "1d4v2",
            anchorOffset: 0,
            focusKey: "1d4v2",
            focusOffset: 0,
            isBackward: false,
            hasFocus: false,
          },
          selectionAfter: {
            anchorKey: "1d4v2",
            anchorOffset: 0,
            focusKey: "1d4v2",
            focusOffset: 0,
            isBackward: false,
            hasFocus: false,
          },
        },
      ],
    },
  },
  plainText: "asdasd\u0001\u0001asd\u0001asd\u0001",
  htmlString: "<p>asdasd</p>\n<p></p>\n<p>asd</p>\n<p>asd</p>\n<p></p>\n",
  blocks: [
    {
      key: "1d4v2",
      text: "asdasd",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "9lrlm",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "ehvfm",
      text: "asd",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "93cll",
      text: "asd",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "5gli6",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};
export default DrilldownSidebarUnderwritingNotes;
