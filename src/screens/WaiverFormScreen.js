import {
  AddRounded,
  EscalatorWarningOutlined,
  Person2Rounded,
  RemoveRounded,
  RestartAlt,
  Search,
} from "@mui/icons-material";
import { Alert, Box, Button, Card, Container, IconButton } from "@mui/material";
import { amber, grey, yellow } from "@mui/material/colors";
import axios from "axios";
import { isNil, over } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Field, FormSpy, useFormState } from "react-final-form";
import { useNavigate } from "react-router-dom";
import TextOverflow from "../_src_shared/components/TextOverflow";
import AnimatedCheckmark from "../components/feedback/AnimatedCheckmark/AnimatedCheckMark";
import RffDateAdultField from "../components/finalForm/inputs/RffDateAdultField";
import RffSelectToggleField from "../components/finalForm/inputs/RffSelectToggleField";
import RffSignatureField from "../components/finalForm/inputs/RffSignatureField";
import RffTextField from "../components/finalForm/inputs/RffTextField";
import RffForm from "../components/finalForm/RffForm";
import RffGroup from "../components/finalForm/shared/RffGroup";
import InputWrapper from "../components/inputs/shared/InputWrapper";
import Flx from "../components/layout/Flx";
import Screen from "../components/layout/Screen";
import Logo from "../components/Logo";
import Htag from "../components/typography/Htag";
import Txt from "../components/typography/Txt";
import TitledCard from "../components/ui/TitledCard";
import RffDateField from "../components/finalForm/inputs/RffDateField";
import { formatDateShort } from "../utils/dates/formatDateShort";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const WaiverFormScreen = ({ children }) => {
  const navigate = useNavigate();
  const init = useMemo(() => {
    return { adultCount: 0, minorCount: 0 };
  }, []);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(init);

  const wakeUpServer = async () => {
    try {
      console.log("Waking up server...");

      // const response = await axios.get(`${API_BASE_URL}/api/waivers/wake-up`, {
      const response = await axios.get(
        `${API_BASE_URL}/api/waivers/wake-up-with-db`,
        {
          timeout: 30000, // 30 second timeout
        }
      );

      console.log("Server wake-up successful:", response.status);
      return true;
    } catch (error) {
      console.log("Server wake-up request completed:", error.message);
      // Don't treat this as a real error since the goal is just to wake up the server
      return false;
    }
  };

  // Add useEffect to wake up server when component mounts
  useEffect(() => {
    wakeUpServer();
  }, []);

  const handleReset = () => {
    setSuccess(false);
    setLoading(false);
    setError(false);
    setInitialData(init);
    return;
  };
  // Transform form data into a structure optimized for backend storage and searching
  const transformFormDataForBackend = (formData) => {
    const waiverId = generateWaiverId();
    const submissionDate = new Date().toISOString();

    const participants = [];

    // Process adults first
    for (let i = 0; i < parseInt(formData.adultCount || 0); i++) {
      const adult = formData[`adult_${i}`];
      if (adult && adult.firstName && adult.lastName) {
        participants.push({
          id: `${waiverId}_adult_${i}`,
          type: "adult",
          firstName: adult.firstName,
          lastName: adult.lastName,
          fullName: `${adult.firstName} ${adult.lastName}`,
          dateOfBirth: adult.dateOfBirth,
          signature: adult.signature,
          age: calculateAge(adult.dateOfBirth),
          isSigningAdult: false, // Will be updated if they sign for minors
          minorsSignedFor: [], // Will be populated if they sign for minors
        });
      }
    }

    // Process minors second, now that all adults are in the participants array
    for (let i = 0; i < parseInt(formData.minorCount || 0); i++) {
      const minor = formData[`minor_${i}`];
      if (minor && minor.firstName && minor.lastName) {
        // Convert the frontend signingAdult reference to full participant ID
        let signingAdultId = null;
        let signingAdultName = "";

        if (minor.signingAdult) {
          // Extract the adult index from the signingAdult field (e.g., "adult_0" -> "0")
          const adultIndex = minor.signingAdult.split("_").pop();
          signingAdultId = `${waiverId}_adult_${adultIndex}`;

          // Find the signing adult in our participants array
          const signingAdult = participants.find(
            (p) => p.id === signingAdultId
          );
          if (signingAdult) {
            signingAdultName = signingAdult.fullName;

            // Update the signing adult's record
            signingAdult.isSigningAdult = true;
            signingAdult.minorsSignedFor.push({
              id: `${waiverId}_minor_${i}`,
              name: `${minor.firstName} ${minor.lastName}`,
            });
          }
        }

        participants.push({
          id: `${waiverId}_minor_${i}`,
          type: "minor",
          firstName: minor.firstName,
          lastName: minor.lastName,
          fullName: `${minor.lastName}, ${minor.firstName}`,
          dateOfBirth: minor.dateOfBirth,
          age: calculateAge(minor.dateOfBirth),
          signingAdultId: signingAdultId,
          signingAdultName: signingAdultName,
        });
      }
    }

    // Create searchable indexes
    const searchIndexes = {
      names: participants.map((p) => p.fullName.toLowerCase()),
      firstNames: participants.map((p) => p.firstName.toLowerCase()),
      lastNames: participants.map((p) => p.lastName.toLowerCase()),
      allParticipants: participants.map((p) => ({
        id: p.id,
        name: p.fullName,
        type: p.type,
        age: p.age,
      })),
    };

    return {
      waiverId,
      submissionDate,
      participationType: formData.participationType,
      totalParticipants: participants.length,
      adultCount: participants.filter((p) => p.type === "adult").length,
      minorCount: participants.filter((p) => p.type === "minor").length,
      participants,
      searchIndexes,
      // For waiver lookup table
      waiverSummary: {
        id: waiverId,
        dateSubmitted: submissionDate.split("T")[0], // YYYY-MM-DD format
        participantNames: participants.map((p) => p.fullName).join(", "),
        participantCount: participants.length,
        hasMinors: participants.some((p) => p.type === "minor"),
        signingAdults: participants
          .filter((p) => p.isSigningAdult)
          .map((p) => p.fullName),
      },
    };
  };

  const generateWaiverId = () => {
    return `W${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const submitWaiver = async (data) => {
    const transformedData = transformFormDataForBackend(data);
    console.log("Transformed for backend:", transformedData);

    // return;
    setLoading(true);
    const response = await axios
      .post(`${API_BASE_URL}/api/waivers/submit`, transformedData)
      .then((res) => {
        setSuccess(transformedData);
        // setSuccess(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error submitting waiver:", error);
        setLoading(false);
        setError(true);
        // throw error; // Re-throw to handle it in the calling function if needed
      });

    console.log("Response from backend:", response?.data);
    return;
    // return response.data;
  };

  const pe = {
    waiverId: "W1751979962908_7a06c9hos",
    submissionDate: "2025-07-08T13:06:02.908Z",
    participationType: "Adult(s) and Minor(s)",
    totalParticipants: 2,
    adultCount: 1,
    minorCount: 1,
    participants: [
      {
        id: "W1751979962908_7a06c9hos_adult_0",
        type: "adult",
        firstName: "Test4",
        lastName: "Test4",
        fullName: "Test4 Test4",
        dateOfBirth: "1993-10-10T04:00:00.000Z",
        signature:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLEAAADSCAYAAAC1kFKzAAAAAXNSR0IArs4c6QAAHpdJREFUeF7t3bGrLdd1B+BlcCFICpVpgvy6lGqCUwQkdUmn/0B6f0Fw6UoSOF0guEgZntQHkjKdLBKIi0BSGmKwHqhw4UJFAioMzlnO2fZkdO49M+fsM7Nm5hu43Kv75uy95tv7Cd6Pvfd8J1wECBAgQIAAAQIECBAgQIAAAQIEigt8p3h9yiNAgAABAgQIECBAgAABAgQIECAQQiyTgAABAgQIECBAgAABAgQIECBAoLyAEKv8ECmQAAECBAgQIECAAAECBAgQIEBAiGUOECBAgAABAgQIECBAgAABAgQIlBcQYpUfIgUSIECAAAECBAgQIECAAAECBAgIscwBAgQIECBAgAABAgQIECBAgACB8gJCrPJDpEACBAgQIECAAAECBAgQIECAAAEhljlAgAABAgQIECBAgAABAgQIECBQXkCIVX6IFEiAAAECBAgQIECAAAECBAgQICDEMgcIECBAgAABAgQIECBAgAABAgTKCwixyg+RAgkQIECAAAECBAgQIECAAAECBIRY5gABAgQIECBAgAABAgQIECBAgEB5ASFW+SFSIAECBAgQIECAAAECBAgQIECAgBDLHCBAgAABAgQIECBAgAABAgQIECgvIMQqP0QKJECAAAECBAgQIECAAAECBAgQEGKZAwQIECBAgAABAgQIECBAgAABAuUFhFjlh0iBBAgQIECAAAECBAgQIECAAAECQixzgAABAgQIECBAgAABAgQIECBAoLyAEKv8ECmQAAECBAgQIECAAAECBAgQIEBAiGUOECBAgAABAgQIECBAgAABAgQIlBcQYpUfIgUSIECAAAECBAgQIECAAAECBAgIscwBAgQIECBAgAABAgQIECBAgACB8gJCrPJDpEACBAgQIECAAAECBAgQIECAAAEhljlAgAABAgQIECBAgAABAgQIECBQXkCIVX6IFEiAAAECBAgQIECAAAECBAgQICDEMgcIECBAgAABAgQIECBAgAABAgTKCwixyg+RAgkQIECAAAECBAgQIECAAAECBIRY5gABAgQIECBAgAABAgQIECBAgEB5ASFW+SFSIAECBAgQIECAAAECBAgQIECAgBDLHCBAgAABAgQIECBAgAABAgQIECgvIMQqP0QKJECAAAECBAgQIECAAAECBAgQEGKZAwQIECBAgAABAgQIECBAgAABAuUFhFjlh0iBBAgQIECAAAECBAgQIECAAAECQixzgAABAgQIECBAgAABAgQIECBAoLyAEKv8ECmQAAECBAgQIECAAAECBAgQIEBAiGUOECBAgAABAgQIECBAgAABAgQIlBcQYpUfIgUSIECAAAECBAgQIECAAAECBAgIscwBAgQIECBAgAABAgQIECBAgACB8gJCrPJDpEACBAgQIECAAAECBAgQIECAAAEhljlAgAABAgQIECBAgAABAgQIECBQXkCIVX6IFEiAAAECBAgQIECAAAECBAgQICDEMgcIECBAgAABAgQIECBAgAABAgTKCwixyg+RAgkQIECAAAECBAgQIECAAAECBIRY5gABAgQIECBAgAABAgQIECBAgEB5ASFW+SFSIAECBAgQIECAAAECBAgQIECAgBDLHCBAgAABAgQIECBAgAABAgQIECgvIMQqP0QKJECAAAECBAgQIECAAAECBAgQEGKZAwQIECBAgAABAgQIECBAgAABAuUFhFjlh0iBBAgQIECAAAECBAgQIECAAAECQixzgAABAgQIECBAgAABAgQIECBAoLyAEKv8ECmQAAECBAgQIECAAAECBAgQIEBAiGUOECBAgAABAgQIECBAgAABAgQIlBcQYpUfIgUSIECAAAECBAgQIECAAAECBAgIscwBAgQIECBAgAABAgQIECBAgACB8gJCrPJDpEACBAgQIECAAAECBAgQIECAAAEhljlAgAABAgQIECBAgAABAgQIECBQXkCIVX6IFEiAAAECBAgQIECAAAECBAgQICDEMgcIECBAgAABAgQIECBAgAABAgTKCwixyg+RAgkQIECAAAECBAgQIECAAAECBIRY5gABAgQIECBAgAABAgQIECBAgEB5ASFW+SFSIAECBAgQIECAAAECBAgQIECAgBDLHCBAgAABAgQIECBAgAABAgQIECgvIMQqP0QKJECAAAECBAgQIECAAAECBAgQEGKZAwQIECBAgAABAgQIECBAgAABAuUFhFjlh0iBBAgQIECAAAECBAgQIECAAAECQixzgAABAgQIECBAgAABAgQIECBAoLyAEKv8ECmQAAECBAgQIECAAAECBAgQIEBAiGUOECBAgAABAgQIECBAgAABAgQIlBcQYpUfIgUSIECAAAECBAgQIECAAAECBAgIscwBAgQIECBAgAABAgQIECBAgACB8gJCrPJDpEACBAgQIECAAAECBAgQIECAAAEhljlAgAABAgQIECBAgAABAgQIECBQXkCIVX6IFEiAAAECBAgQIECAAAECBAgQICDEMgcIECBAgAABAgQIECBAgAABAgTKCwixyg+RAgkQIECAAAECBAgQIECAAAECBIRY5gABAgQIECBAgAABAgQIECBAgEB5ASFW+SFSIAECBAgQIECAAAECBAgQIECAgBDLHCBAgAABAgQIECBAgAABAgQIECgvIMQqP0QKJECAAAECBAgQIECAAAECBAgQEGKZAwQIECBAgAABAgQIECBAgAABAuUFhFjlh0iBBAgQIECAAAECBAgQIECAAAECQixzgAABAgQIECBAgAABAgQIECBAoLyAEKv8ECmQQBeB751bye/t5y8jon3l7/Ln9r1LpxohQIAAAQIECBAgQIAAAQK9BIRYvSS1Q6CWwLsR8RcR8f2IyJ/nXF9HRH59GhGvz+HWT+Y04F4CBAgQIECAAAECBAgQINBbQIjVW1R7BJYTaKuq3jl3mWHV3MDqlmpzxVZebeVWBlwvb2nIZwgQIECAAAECBAgQIECAwFQBIdZUKfcRqCGQwdUH57BqicBq6lN/HBGfTL3ZfQQIECBAgAABAgQIECBAYK6AEGuumPsJrCPw0Wnl04eD86zWqeLpXnProdVY1UZFPQQIECBAgAABAgQIENiRgBBrR4PpUXYn0FZd5Sqn6td7p9Vhzs2qPkrqI0CAAAECBAgQIECAwIYFhFgbHjyllxRob/7LrX5vnSsc/m5YdPt9/q6dM5W/+2VE/OH569aH/HVEfDci2vdb2xl/Lg98z6sd/v7mObz64vz7XJHlDYe9tLVDgAABAgQIECBAgAABAr8TEGKZDARuExiHVRlatYPWb2txX5/KVVnp8XcR8QcR0UKu4aHw+3piT0OAAAECBAgQIECAAAECDxUQYj2UV+M7EWjb+l6fD1WfG1a14KZxjIOct8+BT65qmnL9d0T8e0R8ExE/PX/gf85hUf5n1pmrwC59b28UzPuGq7/y5+Gf5Z8PV4rlf7eVZcMD5a8dLj9eCdb6aP2171lrruJyESBAgAABAgQIECBAgACBiwJCLBODwO8FMrRpocw75y1z75//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AQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLCDE6gyqOQIECBAgQIAAAQIECBAgQIAAgf4CQqz+plokQIAAAQIECBAgQIAAAQIECBDoLPC/KNsy8Z0ZruIAAAAASUVORK5CYII=",
        age: 31,
        isSigningAdult: true,
        minorsSignedFor: [
          {
            id: "W1751979962908_7a06c9hos_minor_0",
            name: "Emma asd",
          },
        ],
      },
      {
        id: "W1751979962908_7a06c9hos_minor_0",
        type: "minor",
        firstName: "Emma",
        lastName: "asd",
        fullName: "asd, Emma",
        dateOfBirth: "2025-03-12T04:00:00.000Z",
        age: 0,
        signingAdultId: "W1751979962908_7a06c9hos_adult_0",
        signingAdultName: "Test4 Test4",
      },
    ],
    searchIndexes: {
      names: ["test4 test4", "asd, emma"],
      firstNames: ["test4", "emma"],
      lastNames: ["test4", "asd"],
      allParticipants: [
        {
          id: "W1751979962908_7a06c9hos_adult_0",
          name: "Test4 Test4",
          type: "adult",
          age: 31,
        },
        {
          id: "W1751979962908_7a06c9hos_minor_0",
          name: "asd, Emma",
          type: "minor",
          age: 0,
        },
      ],
    },
    waiverSummary: {
      id: "W1751979962908_7a06c9hos",
      dateSubmitted: "2025-07-08",
      participantNames: "Test4 Test4, asd, Emma",
      participantCount: 2,
      hasMinors: true,
      signingAdults: ["Test4 Test4"],
    },
  };

  if (success) {
    return (
      <Screen
        sx={{
          background: "#faf9f5",
          // px: 2,
          //
          py: 2,
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Container
          maxWidth="sm"
          //
          sx={{}}
        >
          <Card sx={{ py: 6, px: 3, background: "#fff" }}>
            <Flx column gap={3} center>
              <Flx column ac gap={2}>
                <Logo height={100} />
              </Flx>
              <Flx column gap={0.5} center>
                <Txt sx={{ fontSize: "18px", fontWeight: "bold" }}>
                  Waiver Submitted Successfully!
                </Txt>
                <Txt center secondary>
                  Upon arrival, please present this waiver to a staff member —
                  or give us your name and we’ll look it up for you. We look
                  forward to your visit!
                </Txt>
              </Flx>
              <AnimatedCheckmark size={60} />
              <Flx fw column gap={1} sx={{ mt: 4 }}>
                <Flx fw jb ac wrap>
                  <Htag h3 sx={{ fontWeight: "bold" }}>
                    Participant Details:
                  </Htag>
                  <Flx gap={0.5} ac wrap>
                    <Htag h3 sx={{ fontWeight: 600 }}>
                      Submitted:
                    </Htag>
                    <Txt>{formatDateShort(pe?.submissionDate)}</Txt>
                  </Flx>
                </Flx>
                <SubmissionOverview payload={pe} />
              </Flx>
              {/* <SubmissionOverview payload={success}/> */}
              <Button
                size="large"
                startIcon={<RestartAlt />}
                onClick={handleReset}
              >
                Restart Form
              </Button>
            </Flx>
          </Card>
        </Container>
      </Screen>
    );
  }
  return (
    <Screen
      sx={{
        background: "#faf9f5",
        position: "absolute",
        left: 0,
        right: 0,
        height: "100%",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <Container maxWidth="md" sx={{ px: 2, pt: 4, pb: 12 }}>
        <RffForm
          className={"required"}
          success={success}
          // formSpy
          loading={loading}
          // initialValues={init}
          initialValues={initialData}
          // initialValues={{
          //   participationType: "Adult(s) Only",
          //   adultCount: "1",
          //   minorCount: "0",
          // }}
          onSubmit={submitWaiver}
          formTitle={"Catpurrccinos Cat Cafe General Cattery Waiver"}
          formDescription="Please provide the required information below for all participants."
          finalStepLabel="Submit Waiver"
          sx={{
            // background: "#faf9f5",
            ".input-wrapper-root.required": {
              border: "1px solid red",
            },
          }}
        >
          <Flx column gap={2} sx={{ mb: 4 }}>
            <Flx fw wrap jb ac gap={2}>
              <Flx ac wrap gap={2}>
                <Logo height={72} />
                <Flx column gap={0.5}>
                  <Htag sx={{ fontSize: "18px" }}>
                    Catpurrccinos Cattery Waiver
                  </Htag>
                  <Txt secondary sx={{ fontWeight: 400 }}>
                    Release agreement and visitor information
                  </Txt>
                </Flx>
              </Flx>
              {/* <Flx ac gap={1}>
                <Button
                  variant="outlined"
                  onClick={() => setInitialData(generateDummyData())}
                >
                  Randomize People (For Testing)
                </Button>
                <Button
                  onClick={() => navigate("/waivers")}
                  endIcon={<Search />}
                >
                  Waiver Search
                </Button>
              </Flx> */}
            </Flx>
            <Flx column sx={{ mt: 4 }} gap={1}>
              <Htag h2 sx={{ lineHeight: 1.4 }}>
                Waiver, release, hold harmless and indemnification agreement
              </Htag>
              <TextOverflow maxHeight="180px">
                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I hereby certify that I am over eighteen (18) years of age,
                  and am of sound mind at the time of the execution of this
                  Waiver, Release, Hold Harmless, and Indemnification Agreement
                  (hereinafter “Release”) and agree to the terms and conditions
                  of this document. If I am agreeing to this waiver on behalf of
                  a minor I agree that references throughout to “I” or “me”
                  apply to myself and the minor. I am aware that my signature
                  acknowledging all agreements is valid from date of signature,
                  up to and including any and all future entries to
                  Catpurrccinos Cat Café.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  Catpurrccinos Cat Café has available certain cats and/or
                  kittens to be played with by customers at the establishment
                  and agrees to allow me to play with same in consideration of
                  both the payment of the fees for same and my execution of this
                  Release and agreeing to be bound by its terms.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I am aware of and fully understand the inherent dangers
                  involved in playing with cats and/or kittens, including the
                  risk of death and/or personal injury or damage to myself,
                  other persons, my property, and/or the property of others
                  while participating in such activities or having my property
                  at the site of such activities. I further acknowledge that
                  participants in such activities and other person involved in
                  these activities may not be covered under insurance of
                  Catpurrccinos and that customers of Catpurrccinos may not have
                  any right to file a claim against Catpurrccinos insurance
                  policy.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I freely and voluntarily execute this Release with such
                  knowledge, and assume full and sole responsibility for the
                  risk of death, personal injury and/or property loss arising
                  from or in any way connected with my participation in the
                  activities provided by Catpurrccinos.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I agree to abide by all rules and regulations that
                  Catpurrccinos may impose regarding the cats and/or kittens. I
                  agree to follow all rules and to undertake all activities in a
                  responsible manner. IF I AM UNWILLING OR UNABLE TO FOLLOW ANY
                  RULES, CATPURRCCINOS WILL TERMINATE MY CONTINUATION OF SUCH
                  ACTIVITIES, AND I WILL NOT BE ENTITLED TO ANY REFUND OF OUR
                  FEES.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I acknowledge that playing with cats and/or kittens may not be
                  supervised, and Catpurrccinos staff will not be with me the
                  entire time I am in contact with the cats and/or kittens, but
                  Catpurrccinos staff will remain on the premises to monitor the
                  activity of all current participants, offer guidance and
                  encouragement, and be available to assist in the event of
                  participant difficulty.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I have no physical or emotional issue(s), including, but not
                  limited to, any allergies, which would adversely affect my
                  ability to play with the cats and/or kittens in a safe and
                  appropriate manner.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I agree not to engage in any activity that will injure or
                  otherwise hurt the cats and/or kittens in any manner.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I hereby release and forever discharge Catpurrccinos, their
                  respective agents, owners, employees, and independent
                  contractors, and their respective sureties, insurers,
                  successors, assigns, and legal representatives, from any
                  liability, claim, cause of action, demand and damages for
                  injury, death or damages of any kind or nature whatsoever to
                  myself or my property as a result of my engaging in any
                  activities at Catpurrccinos, including, but not limited to,
                  playing with the cats and/or kittens, whether such injury,
                  death, or property damage is caused by the intentional or
                  negligent act or omission on the part of (i) any other
                  customer of Catpurrccinos, (ii) any employee, agent, owners,
                  or independent contractor of Catpurrccinos, or (iii) any other
                  person at Catpurrccinos. Furthermore, I agree to pay any and
                  all attorney’s fees and costs of the Catpurrccinos, their
                  respective agents, employees, owners, and independent
                  contractors if I bring any action, claim, or demand against
                  Catpurrccinos, or any of their respective agents, employees,
                  owners and independent contractors for any reason for which
                  this Release applies.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I agree to defend with counsel chosen by the indemnified
                  party, indemnify, and hold harmless Catpurrccinos, their
                  respective agents, employees, owners, and independent
                  contractors, their sureties, insurers, successors, assigns,
                  and legal representatives from any liability, claim, cause of
                  action, demand or damages for injury, death or damages of any
                  kind or nature whatsoever to any person or their property
                  resulting from any actual or claimed intentional or wrongful
                  act or omission by me arising from or as a result of my
                  presence at Catpurrccinos or my participation in any
                  activities at Catpurrccinos. I agree to provide said defense
                  and indemnity regardless of the merit of the claim.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I agree to and hereby bind my heirs, executors, assigns and
                  all other legal representatives by executing this Release.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  I hereby acknowledge and agree that this Release is intended
                  to be construed and interpreted as broad and inclusive as
                  permitted by the laws of Huntington, NY. If any portion of
                  this Release is found or declared to be invalid or
                  unenforceable, such invalidity shall not affect the remainder
                  of this Release not found to be invalid and the remainder of
                  this Release shall remain in full force and effect. This
                  Agreement shall be governed by the laws of Huntington, NY
                  (without regard to the laws that might be applicable under
                  principles of conflicts of law, and without regard to the
                  jurisdiction in which any action or special proceedings may be
                  instituted), as to all matters, including but not limited to
                  matters of jurisdiction, validity, property rights,
                  construction, effect and performance. All disputes shall be
                  subject to litigation only within the courts of Huntington,
                  NY.
                </Txt>

                <Txt sx={{ fontSize: "16px", mb: 2 }}>
                  BY EXECUTING THIS RELEASE, I ACKNOWLEDGE THAT I HAVE READ THIS
                  RELEASE, UNDERSTAND THE CONTENTS HEREOF, HAVE BEEN ADVISED AND
                  HAD THE OPPORTUNITY TO SEEK INDEPENDENT COUNSEL OF MY CHOICE
                  AND CERTIFY THAT I HAVE FREELY AND VOLUNTARILY EXECUTED THIS
                  RELEASE. I ACKNOWLEDGE THAT, BUT FOR THE EXECUTION OF THIS
                  RELEASE AND AGREEING TO BE BOUND BY THE TERMS HEREOF,
                  CATPURRCCINOS WOULD NOT AUTHORIZE ME TO PARTICIPATE IN ANY
                  ACTIVITIES AT CATPURRCCINOS.
                </Txt>
              </TextOverflow>
            </Flx>
          </Flx>
          <FormQuestions />
        </RffForm>
        {error && <Alert severity="error">Could not submit waiver</Alert>}
      </Container>
    </Screen>
  );
};

const SubmissionOverview = ({ payload }) => {
  return (
    <Flx column gap={1}>
      {/* <Flx fw jb ac wrap>
          <Htag h3 sx={{ fontWeight: "bold" }}>
            Participant Details:
          </Htag>
          <Flx gap={0.5} ac wrap>
            <Htag h3 sx={{ fontWeight: 600 }}>
              Submitted on:
            </Htag>
            <Txt>{formatDateShort(payload?.submissionDate)}</Txt>
          </Flx>
        </Flx> */}
      {payload?.participants?.map((p) => {
        return (
          <Flx
            key={p.id}
            gap={1}
            ac
            wrap
            sx={{
              border: "1px solid #ccc",
              p: 1,
              borderRadius: "4px",
              background: p?.type === "adult" ? "#ffffff" : yellow[50],
            }}
          >
            <Txt sx={{ fontWeight: "bold" }}>
              {p.type === "adult" ? "Adult" : "Minor"}:
            </Txt>
            <Txt>{`${p?.firstName} ${p?.lastName}`}</Txt>
          </Flx>
        );
      })}
    </Flx>
  );
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        p: 2,
        mb: 4,
        width: "100%",
      }}
    >
      <Flx column gap={1}>
        {/* <Flx fw jb ac wrap>
          <Htag h3 sx={{ fontWeight: "bold" }}>
            Participant Details:
          </Htag>
          <Flx gap={0.5} ac wrap>
            <Htag h3 sx={{ fontWeight: 600 }}>
              Submitted on:
            </Htag>
            <Txt>{formatDateShort(payload?.submissionDate)}</Txt>
          </Flx>
        </Flx> */}
        {payload?.participants?.map((p) => {
          return (
            <Flx
              key={p.id}
              gap={1}
              ac
              wrap
              sx={{
                border: "1px solid #ccc",
                p: 1,
                borderRadius: "4px",
                background: p?.type === "adult" ? "#ffffff" : yellow[50],
              }}
            >
              <Txt sx={{ fontWeight: "bold" }}>
                {p.type === "adult" ? "Adult" : "Minor"}:
              </Txt>
              <Txt>{`${p?.firstName} ${p?.lastName}`}</Txt>
            </Flx>
          );
        })}
      </Flx>
    </Box>
  );
};

const FormQuestions = () => {
  return (
    <Field name="participationType">
      {({ input: participationTypeInput }) => (
        <Field name="adultCount">
          {({ input: adultCountInput }) => (
            <Field name="minorCount">
              {({ input: minorCountInput }) => (
                <>
                  <Flx column sx={{ mt: 4 }} gap={1}>
                    <Htag h2>Participation Details</Htag>
                    <TitledCard
                    //  title={"Participation Details"}
                    >
                      <Flx column gap={4}>
                        <RffSelectToggleField
                          name="participationType"
                          required
                          label="Who is participating?"
                          options={["Adult(s) Only", "Adult(s) and Minor(s)"]}
                          onChange={(value) => {
                            participationTypeInput.onChange(value);
                            if (value === "Adult(s) Only") {
                              minorCountInput.onChange("0");
                            }
                          }}
                        />

                        <ParticipantCountSelector
                          participationType={participationTypeInput.value}
                          adultCount={adultCountInput.value}
                          minorCount={minorCountInput.value}
                          onAdultCountChange={adultCountInput.onChange}
                          onMinorCountChange={minorCountInput.onChange}
                        />
                      </Flx>
                    </TitledCard>
                  </Flx>

                  <Flx column gap={2} sx={{ mt: 4 }}>
                    <AdultSections
                      count={parseInt(adultCountInput.value || 0)}
                    />

                    {participationTypeInput.value ===
                      "Adult(s) and Minor(s)" && (
                      <MinorSections
                        count={parseInt(minorCountInput.value || 0)}
                        adultCount={parseInt(adultCountInput.value || 0)}
                      />
                    )}
                  </Flx>
                </>
              )}
            </Field>
          )}
        </Field>
      )}
    </Field>
  );
};

const ParticipantCountSelector = ({
  participationType,
  adultCount,
  minorCount,
  onAdultCountChange,
  onMinorCountChange,
}) => {
  const { values } = useFormState();

  if (isNil(values?.participationType)) {
    return;
  }

  return (
    <>
      <InputWrapper
        label="How many participants?"
        column
        sx={{ mt: 6 }}
        // disableGrid
        // style={{ gap: "20px", alignItems: "center" }}
      >
        {/* Adults Number selcetor */}
        <Flx wrap gap={4} sx={{ mt: 1 }}>
          <Flx gap={1} ac sx={{ mr: 4 }}>
            <Flx ac g={1.5}>
              <DecrementButton
                onClick={() =>
                  onAdultCountChange(
                    Math.max(1, parseInt(adultCount) - 1).toString()
                  )
                }
              />
              <Txt sx={{ fontSize: "18px" }}>{adultCount}</Txt>
              <IncrementButton
                onClick={() =>
                  onAdultCountChange((parseInt(adultCount) + 1).toString())
                }
              />
            </Flx>
            <Txt sx={{ fontSize: "18px" }}>Adult(s)</Txt>
          </Flx>
          {/* Minors Number selcetor */}
          {participationType === "Adult(s) and Minor(s)" && (
            <Flx gap={1} ac>
              <Flx ac g={1.5}>
                <DecrementButton
                  onClick={() =>
                    onMinorCountChange(
                      Math.max(0, parseInt(minorCount) - 1).toString()
                    )
                  }
                />
                <Txt sx={{ fontSize: "18px" }}>{minorCount}</Txt>
                <IncrementButton
                  onClick={() =>
                    onMinorCountChange((parseInt(minorCount) + 1).toString())
                  }
                />
              </Flx>
              <Txt sx={{ fontSize: "18px" }}>Minor(s)</Txt>
            </Flx>
          )}
        </Flx>
      </InputWrapper>
    </>
  );
};

const AdultSections = ({ count }) => {
  const sections = [];

  for (let i = 0; i < count; i++) {
    sections.push(
      <TitledCard
        variant="h3"
        icon={<Person2Rounded className="thin" />}
        key={`adult-${i}`}
        title={`Adult ${i + 1}`}
      >
        <RffGroup suppressBottomMargin>
          <RffTextField
            name={`adult_${i}.firstName`}
            label="First Name"
            size={4}
            required
          />
          <RffTextField
            name={`adult_${i}.lastName`}
            label="Last Name"
            size={4}
            required
          />
          <RffDateAdultField
            name={`adult_${i}.dateOfBirth`}
            label="Date of Birth"
            size={4}
            required
          />
          <RffSignatureField
            name={`adult_${i}.signature`}
            label="Signature"
            required
          />
        </RffGroup>
      </TitledCard>
    );
  }

  return (
    <Flx column g={2}>
      {sections}
    </Flx>
  );
};

const MinorSections = ({ count, adultCount }) => {
  const sections = [];

  // Create options for signing adults
  const getSigningAdultOptions = (formValues) => {
    const options = [];

    // Handle case where formValues might be undefined
    if (!formValues) {
      // Return default options when form values aren't available yet
      for (let i = 0; i < adultCount; i++) {
        options.push({
          value: `W${Date.now()}_adult_${i}`,
          label: `Adult ${i + 1}`,
        });
      }
      return options;
    }

    for (let i = 0; i < adultCount; i++) {
      const adult = formValues[`adult_${i}`];
      let label = `Adult ${i + 1}`;

      // If adult has both first and last name, use those
      if (adult?.firstName && adult?.lastName) {
        label = `${adult.firstName} ${adult.lastName}`;
      }

      options.push({
        value: `adult_${i}`,
        label: label,
      });
    }
    return options;
  };

  for (let i = 0; i < count; i++) {
    sections.push(
      <FormSpy key={`minor-${i}`} subscription={{ values: true }}>
        {({ values }) => (
          <TitledCard
            variant="h3"
            icon={<EscalatorWarningOutlined className="thin" />}
            title={`Minor ${i + 1}`}
            cardSx={{ borderLeft: `8px solid ${amber[100]}` }}
          >
            <RffGroup suppressBottomMargin>
              <RffTextField
                name={`minor_${i}.firstName`}
                label="First Name"
                size={4}
                required
              />
              <RffTextField
                name={`minor_${i}.lastName`}
                label="Last Name"
                size={4}
                required
              />
              <RffDateField
                name={`minor_${i}.dateOfBirth`}
                label="Date of Birth"
                size={4}
                required
              />

              <RffSelectToggleField
                name={`minor_${i}.signingAdult`}
                label="The following adult is signing on behalf of this minor..."
                options={getSigningAdultOptions(values)}
                required
              />
            </RffGroup>
          </TitledCard>
        )}
      </FormSpy>
    );
  }

  return <>{sections}</>;
};

const DecrementButton = ({ onClick }) => {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      // color="primary"
      sx={{
        width: "24px",
        height: "24px",
        background: grey[200],
      }}
    >
      <RemoveRounded sx={{ fontSize: "16px" }} />
    </IconButton>
  );
};

const IncrementButton = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      // color="primary"
      size="small"
      sx={{
        width: "24px",
        height: "24px",
        background: grey[200],
      }}
    >
      <AddRounded sx={{ fontSize: "16px" }} />
    </IconButton>
  );
};

const init = {
  participationType: "Adult(s) and Minor(s)",
  adultCount: "3",
  minorCount: "2",
  adult_0: {
    firstName: "Jimmy",
    lastName: "Oliva",
    dateOfBirth: "1992-11-10T05:00:00.000Z",
  },
  adult_1: {
    firstName: "Carly",
    dateOfBirth: "1994-04-09T04:00:00.000Z",
    lastName: "Oliva",
  },
  adult_2: {
    firstName: "Brittany",
    lastName: "Cafiero",
    dateOfBirth: "1993-12-29T05:00:00.000Z",
  },
  minor_0: {
    firstName: "Gianna",
    dateOfBirth: "2003-03-12T05:00:00.000Z",
    lastName: "Cafiero",
    signingAdult: "W1749093629661_adult_2",
  },
  minor_1: {
    firstName: "Some",
    lastName: "Kid",
    dateOfBirth: "2025-06-01T04:00:00.000Z",
    signingAdult: "W1749093630634_adult_2",
  },
};

function generateDummyData(adultCount, minorCount) {
  // If no parameters provided, generate random counts
  if (adultCount === undefined && minorCount === undefined) {
    adultCount = Math.floor(Math.random() * 5) + 1; // 1-5 adults
    minorCount = Math.floor(Math.random() * 4); // 0-3 minors
  } else if (adultCount === undefined) {
    adultCount = Math.floor(Math.random() * 5) + 1; // 1-5 adults
  } else if (minorCount === undefined) {
    minorCount = Math.floor(Math.random() * 4); // 0-3 minors
  }
  // Sample first names
  const firstNames = [
    "Jimmy",
    "Carly",
    "Brittany",
    "Michael",
    "Sarah",
    "David",
    "Emma",
    "James",
    "Ashley",
    "Robert",
    "Jessica",
    "John",
    "Amanda",
    "William",
    "Gianna",
    "Ethan",
    "Olivia",
    "Noah",
    "Sophia",
    "Liam",
    "Isabella",
    "Mason",
    "Mia",
    "Jacob",
    "Charlotte",
    "Lucas",
    "Amelia",
    "Alexander",
  ];

  // Sample last names
  const lastNames = [
    "Oliva",
    "Cafiero",
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
  ];

  // Helper function to generate random date
  function generateRandomDate(minAge, maxAge) {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - maxAge, 0, 1);
    const maxDate = new Date(today.getFullYear() - minAge, 11, 31);
    const randomTime =
      minDate.getTime() +
      Math.random() * (maxDate.getTime() - minDate.getTime());
    return new Date(randomTime).toISOString();
  }

  // Helper function to get random item from array
  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Determine participation type
  let participationType;
  if (adultCount > 0 && minorCount > 0) {
    participationType = "Adult(s) and Minor(s)";
  } else if (adultCount > 0) {
    participationType = "Adult(s) Only";
  } else {
    participationType = "Minor(s) Only";
  }

  const data = {
    participationType,
    adultCount: adultCount.toString(),
    minorCount: minorCount.toString(),
  };

  // Generate adults
  for (let i = 0; i < adultCount; i++) {
    data[`adult_${i}`] = {
      firstName: getRandomItem(firstNames),
      lastName: getRandomItem(lastNames),
      dateOfBirth: generateRandomDate(18, 65),
    };
  }

  // Generate minors
  for (let i = 0; i < minorCount; i++) {
    // Generate a random signing adult ID (if adults exist)
    let signingAdult = null;
    if (adultCount > 0) {
      const randomAdultIndex = Math.floor(Math.random() * adultCount);
      const randomId = Math.floor(Math.random() * 1000000000000);
      signingAdult = `W${randomId}_adult_${randomAdultIndex}`;
    }

    data[`minor_${i}`] = {
      firstName: getRandomItem(firstNames),
      lastName: getRandomItem(lastNames),
      dateOfBirth: generateRandomDate(0, 17),
      // ...(signingAdult && { signingAdult }),
    };
  }

  return data;
}

// Example usage:
// console.log("Random counts (no parameters):");
// console.log(generateDummyData());

// console.log("\nAnother random generation:");
// console.log(generateDummyData());

// console.log("\nCustom (2 adults, 1 minor):");
// console.log(generateDummyData(2, 1));

// console.log("\nAdults only (4 adults, 0 minors):");
// console.log(generateDummyData(4, 0));
export default WaiverFormScreen;
