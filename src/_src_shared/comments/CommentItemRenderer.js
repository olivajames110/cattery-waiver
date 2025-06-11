import { isArray, isEmpty } from "lodash";
import Flx from "../../components/layout/Flx";
import Txt from "../../components/typography/Txt";
import CommentItem from "./CommentItem";
import { useMemo } from "react";

const CommentItemRenderer = ({ comments, sx, px, gap = 3, padding = 2 }) => {
  if (!isArray(comments) || isEmpty(comments)) {
    return (
      <RootContainer gap={gap} sx={sx} padding={padding}>
        <Txt>No comments added</Txt>
      </RootContainer>
    );
  }
  return (
    <RootContainer gap={gap} sx={sx} padding={padding}>
      {comments?.map((c) => {
        return (
          <CommentItem
            key={c?._id}
            px={px}
            createdDate={c?.commentDateTime}
            createdBy={c?.postedBy}
            htmlString={c?.htmlString}
            data={c?.data}
          />
        );
      })}
    </RootContainer>
  );
};

const RootContainer = ({ children, padding, sx }) => {
  const styles = useMemo(() => {
    return { p: padding, ...sx };
  }, [padding, sx]);
  return (
    <Flx column fw gap={3} sx={styles}>
      {children}
    </Flx>
  );
};

export default CommentItemRenderer;
