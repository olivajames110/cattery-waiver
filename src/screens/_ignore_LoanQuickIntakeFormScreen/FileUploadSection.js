import { AttachmentOutlined } from "@mui/icons-material";
import { useMemo, useState } from "react";
import RffFileUploadField from "../../components/finalForm/inputs/RffFileUploadField";
import RffGroup from "../../components/finalForm/shared/RffGroup";
import Flx from "../../components/layout/Flx";
import ToggleTabSwitcher from "../../components/navigation/ToggleTabSwitcher";
import Txt from "../../components/typography/Txt";
import TitledCard from "../../components/ui/TitledCard/TitledCard";
import {
  fileDocGroups,
  getDocTypesByGroup,
} from "../../config/fileDocGroupAndTypes";
import { isEmpty, size } from "lodash";
import { useFormState } from "react-final-form";

const FileUploadSection = ({ testing }) => {
  const { values } = useFormState();
  const [group, setGroup] = useState(0);

  // const [group, setGroup] = useState("Entity Docs");

  const activeDocGroup = useMemo(() => fileDocGroups[group], [group]);

  const docGroups = useMemo(() => {
    if (isEmpty(values?.uploadMetadata)) {
      return fileDocGroups;
    }
    return fileDocGroups?.map((gp) => {
      const count = size(
        values?.uploadMetadata?.filter((f) => f?.docGroup === gp)
      );
      if (count === 0) {
        return gp;
      }
      return `${gp} (${count})`;
    });
  }, [values?.uploadMetadata]);

  return (
    <TitledCard
      variant="h1"
      icon={<AttachmentOutlined className="thin" />}
      title="Upload Loan Files"
      cardSx={{
        "& .titled-group-body-root": {
          paddingLeft: 0.5,
        },
      }}
    >
      {/* <RffGroup suppressBottomMargin>
        
      </RffGroup> */}

      <Flx gap={2}>
        <ToggleTabSwitcher
          orientation="vertical"
          tabs={docGroups}
          value={group}
          onChange={setGroup}
          useIndex
        />
        <RffDocGroupTypes docGroup={activeDocGroup} />
      </Flx>
    </TitledCard>
  );
};

const RffDocGroupTypes = ({ docGroup }) => {
  const docTypes = useMemo(() => getDocTypesByGroup(docGroup), [docGroup]);

  if (isEmpty(docTypes)) {
    return (
      <Flx column fw g={2}>
        <Txt body2>
          No document types available for this group. Please select another
          group.
        </Txt>
      </Flx>
    );
  }
  return (
    <Flx column fw g={2}>
      <Flx column sx={{ mt: 1 }}>
        <Txt bold>{docGroup}</Txt>
        <Txt body2>
          Drag & drop or click the following boxes to upload files.
        </Txt>
      </Flx>
      <RffGroup columnSpacing={1} suppressBottomMargin rowSpacing={1}>
        <RffFileUploadField
          name={`${docGroup}`}
          uploadText={`Unassigned ${docGroup}`}
          size={12}
          height="100px"
          docGroup={docGroup}
          suppressButton
        />
        {docTypes?.map((docType) => {
          const getSize = (type) => {
            if (size(docTypes) <= 5) {
              return 12;
            }

            return 6;
          };
          return (
            <RffFileUploadField
              key={docType}
              name={`${docGroup}.${docType}`}
              uploadText={docType}
              size={getSize(docType)}
              height="64px"
              docType={docType}
              docGroup={docGroup}
              // suppressButton
              suppressButton
              borderSize={2}
              suppressIcon
              // required={testing?.required}
            />
          );
        })}
      </RffGroup>
    </Flx>
  );
};

export default FileUploadSection;
