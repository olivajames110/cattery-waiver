import { AddOutlined, AttachFileOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { AgCharts } from "ag-charts-react";
import { isEmpty, size, uniq } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import TitledCard from "../../../components/ui/TitledCard";
import LoanDocumentsGroupFilesTable from "./LoanDocumentsGroupFilesTable";
import LoanFileUploader from "./LoanFileUploader";
import LoanDocumentGroupIcon from "./LoanDocumentGroupIcon";
import { is } from "immutable";

const LoanDocumentGroupFilesCard = ({
  title,
  docGroup,
  showIfEmpty,
  showGroupIcon,
  sx,
}) => {
  const loanDocuments = useSelector(
    (state) => state.loanDrilldown?.loanDocuments
  );

  const filteredDocGroupDocuments = useMemo(() => {
    if (isEmpty(loanDocuments)) {
      return [];
    }
    return loanDocuments.filter((doc) => {
      return doc?.docGroup === docGroup;
    });
  }, [loanDocuments, docGroup]);

  const cardTitle = useMemo(() => {
    if (title) {
      return `${title} (${size(filteredDocGroupDocuments)})`;
    }
    return `${docGroup} (${size(filteredDocGroupDocuments)})`;
  }, [title, docGroup, loanDocuments]);

  if (isEmpty(filteredDocGroupDocuments) && !showIfEmpty) {
    return null;
  }
  return (
    <TitledCard
      variant="h3"
      title={cardTitle}
      cardSx={{
        flexGrow: 0,
        flexShrink: 0,
        minWidth: "440px",
        ...sx,
      }}
      icon={
        showGroupIcon ? (
          <LoanDocumentGroupIcon docGroup={docGroup} />
        ) : (
          <AttachFileOutlined className="thin" />
        )
      }
      headerEndContent={<FileUploaderIconButton docGroup={docGroup} />}
    >
      <LoanDocumentsGroupFilesPieChart
        docGroup={docGroup}
        loanDocuments={filteredDocGroupDocuments}
      />
      <LoanDocumentsGroupFilesTable loanDocuments={filteredDocGroupDocuments} />
    </TitledCard>
  );
};

const FileUploaderIconButton = ({ docGroup }) => {
  const [addFiles, setAddFiles] = useState(false);
  return (
    <>
      <IconButton
        onClick={() => setAddFiles(true)}
        sx={{ position: "absolute", right: 12, top: 16 }}
        size="small"
      >
        <AddOutlined />
      </IconButton>
      {addFiles ? (
        <LoanFileUploader
          show={addFiles}
          onClose={setAddFiles}
          defaultDocGroup={docGroup}
        />
      ) : null}
    </>
  );
};

const LoanDocumentsGroupFilesPieChart = ({ docGroup, loanDocuments }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Filter documents by the specified docGroup if provided
    const filteredDocs = docGroup
      ? loanDocuments.filter((doc) => doc.docGroup === docGroup)
      : loanDocuments;

    // Count the number of files per docType
    const docTypeCounts = filteredDocs.reduce((acc, doc) => {
      const docType = doc.docType || "Unknown";
      acc[docType] = (acc[docType] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format for AG Charts
    const chartDataArray = Object.entries(docTypeCounts).map(
      ([docType, count]) => ({
        docType,
        count,
      })
    );

    setChartData(chartDataArray);
  }, [loanDocuments, docGroup]);

  const chartOptions = {
    padding: {
      top: 16,
      right: 30,
      bottom: 16,
      left: 0,
    },
    height: 220,
    // height: 200,
    width: 480,
    autoSize: false,
    legend: {
      enabled: true,
      position: "right",
      item: {
        // paddingX: 32,
        paddingY: 15,
        marker: {
          shape: "circle",
          size: 10,
        },
        // label: {
        //   fontSize: 12,
        // },
      },
    },

    series: [
      {
        type: "pie",
        labelKey: "docType",
        legendItemKey: "docType",
        angleKey: "count",
        sectorLabelKey: "count",
        // calloutLabelKey: "docType",
        // innerRadiusRatio: 0.5,
      },
    ],
    data: chartData,
  };
  // if (size(loanDocuments) <= 1) {
  //   return null;
  // }
  // if (
  //   size(loanDocuments) <= 1 ||
  //   size(uniq(loanDocuments.map((doc) => doc.docType))) <= 1
  // ) {
  //   return null;
  // }
  return <AgCharts options={chartOptions} />;
};
export default LoanDocumentGroupFilesCard;
