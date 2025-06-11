import {
  AddRounded,
  EscalatorWarningOutlined,
  Person2Rounded,
  RemoveRounded,
  Search,
} from "@mui/icons-material";
import { Button, Card, Container, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { Field, FormSpy } from "react-final-form";
import RffDateField from "../components/finalForm/inputs/RffDateField";
import RffSelectToggleField from "../components/finalForm/inputs/RffSelectToggleField";
import RffSignatureField from "../components/finalForm/inputs/RffSignatureField";
import RffTextField from "../components/finalForm/inputs/RffTextField";
import RffForm from "../components/finalForm/RffForm";
import RffGroup from "../components/finalForm/shared/RffGroup";
import InputWrapper from "../components/inputs/shared/InputWrapper";
import Flx from "../components/layout/Flx";
import Txt from "../components/typography/Txt";
import TitledCard from "../components/ui/TitledCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedCheckmark from "../components/feedback/AnimatedCheckmark/AnimatedCheckMark";
import Screen from "../components/layout/Screen";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const CatteryWaiverScreen = ({ children }) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(false);
  const navigate = useNavigate();

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
          fullName: `${adult.lastName}, ${adult.firstName}`,
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

  const getAdultNameById = (participants, adultId) => {
    const adult = participants.find(
      (p) => p.id === adultId && p.type === "adult"
    );
    return adult ? adult.fullName : "";
  };

  const submitWaiver = async (data) => {
    const transformedData = transformFormDataForBackend(data);
    console.log("Transformed for backend:", transformedData);

    // return;
    setLoading(true);
    const response = await axios
      .post(`${API_BASE_URL}/api/waivers/submit`, transformedData)
      .then((res) => {
        setSuccess(true);
        return res;
      })
      .catch((error) => {
        console.error("Error submitting waiver:", error);

        throw error; // Re-throw to handle it in the calling function if needed
      })
      .finally(() => {
        setLoading(false);
      });
    console.log("Response from backend:", response.data);
    return response.data;
  };

  if (success) {
    return (
      <Screen sx={{ background: "#faf9f5" }}>
        <Container maxWidth="sm" sx={{ px: 2, py: 6 }}>
          <Card sx={{ py: 6, px: 2, background: "#fff" }}>
            <Flx column gap={3} center>
              <AnimatedCheckmark />
              <Txt sx={{ fontSize: "18px", fontWeight: "bold" }}>
                Waiver Submitted Successfully!
              </Txt>
              <Button onClick={() => setSuccess(false)}>Restart Form</Button>
            </Flx>
          </Card>
        </Container>
      </Screen>
    );
  }
  return (
    <>
      <RffForm
        className={"required"}
        success={success}
        formSpy
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
          background: "#faf9f5",
          ".input-wrapper-root.required": {
            border: "1px solid red",
          },
        }}
      >
        <Container maxWidth="md" sx={{ px: 2, py: 6 }}>
          <Flx center sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setInitialData(generateDummyData())}
            >
              Randomize Participants
            </Button>
          </Flx>
          <FormQuestions />
        </Container>
      </RffForm>
    </>
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
                  <TitledCard title={"Participation Details"}>
                    <Flx column gap={4}>
                      <RffSelectToggleField
                        name="participationType"
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
  const adultOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));

  const minorOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i.toString(),
    label: i.toString(),
  }));

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
        <Flx gap={6} sx={{ mt: 1 }}>
          <Flx gap={1} ac>
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
          <RffDateField
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
            icon={<EscalatorWarningOutlined className="thin" />}
            title={`Minor ${i + 1}`}
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
export default CatteryWaiverScreen;
