import {
  AddRounded,
  EscalatorWarningOutlined,
  Person2Rounded,
  RemoveRounded,
  Search,
} from "@mui/icons-material";
import { Alert, Button, Card, Container, IconButton } from "@mui/material";
import { amber, grey } from "@mui/material/colors";
import { useMemo, useState } from "react";
import { Field, FormSpy, useFormState } from "react-final-form";
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
import { isNil, over, set } from "lodash";
import TextOverflow from "../_src_shared/components/TextOverflow";
import Htag from "../components/typography/Htag";
import Logo from "../components/Logo";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const CatteryWaiverScreen = ({ children }) => {
  const navigate = useNavigate();
  const init = useMemo(() => {
    return { adultCount: 0, minorCount: 0 };
  }, []);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(init);

  const handleReset = () => {
    setSuccess(false);
    setLoading(false);
    setError(false);
    setInitialData(init);
    // Optionally reset the form state if needed
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

  const submitWaiver = async (data) => {
    const transformedData = transformFormDataForBackend(data);
    console.log("Transformed for backend:", transformedData);

    // return;
    setLoading(true);
    const response = await axios
      .post(`${API_BASE_URL}/api/waivers/submit`, transformedData)
      .then((res) => {
        setSuccess(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error submitting waiver:", error);
        setLoading(false);
        setError(true);
        // throw error; // Re-throw to handle it in the calling function if needed
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
              <Button onClick={handleReset}>Restart Form</Button>
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
                <Logo height={84} />
                <Flx column gap={1}>
                  <Htag>General Cattery Waiver</Htag>
                  <Htag h3>General Cattery Waiver</Htag>
                </Flx>
              </Flx>
              <Flx ac gap={1}>
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
              </Flx>
            </Flx>
            <TextOverflow maxHeight="200px">
              <Txt sx={{ fontSize: "16px", mb: 2 }}>
                I hereby certify that I am over eighteen (18) years of age, and
                am of sound mind at the time of the execution of this Waiver,
                Release, Hold Harmless, and Indemnification Agreement
                (hereinafter “Release”) and agree to the terms and conditions of
                this document. If I am agreeing to this waiver on behalf of a
                minor I agree that references throughout to “I” or “me” apply to
                myself and the minor. I am aware that my signature acknowledging
                all agreements is valid from date of signature, up to and
                including any and all future entries to Catpurrccinos Cat Café.
              </Txt>

              <Txt sx={{ fontSize: "16px", mb: 2 }}>
                Catpurrccinos Cat Café has available certain cats and/or kittens
                to be played with by customers at the establishment and agrees
                to allow me to play with same in consideration of both the
                payment of the fees for same and my execution of this Release
                and agreeing to be bound by its terms.
              </Txt>

              <Txt sx={{ fontSize: "16px", mb: 2 }}>
                I am aware of and fully understand the inherent dangers involved
                in playing with cats and/or kittens, including the risk of death
                and/or personal injury or damage to myself, other persons, my
                property, and/or the property of others while participating in
                such activities or having my property at the site of such
                activities. I further acknowledge that participants in such
                activities and other person involved in these activities may not
                be covered under insurance of Catpurrccinos and that customers
                of Catpurrccinos may not have any right to file a claim against
                Catpurrccinos insurance policy.
              </Txt>

              <Txt sx={{ fontSize: "16px", mb: 2 }}>
                I freely and voluntarily execute this Release with such
                knowledge, and assume full and sole responsibility for the risk
                of death, personal injury and/or property loss arising from or
                in any way connected with my participation in the activities
                provided by Catpurrccinos.
              </Txt>

              <Txt sx={{ fontSize: "16px", mb: 2 }}>
                I agree to abide by all rules and regulations that Catpurrccinos
                may impose regarding the cats and/or kittens. I agree to follow
                all rules and to undertake all activities in a responsible
                manner. IF I AM UNWILLING OR UNABLE TO FOLLOW ANY RULES,
                CATPURRCCINOS WILL TERMINATE MY CONTINUATION OF SUCH ACTIVITIES,
                AND I WILL NOT BE ENTITLED TO ANY REFUND OF OUR FEES.
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
                negligent act or omission on the part of (i) any other customer
                of Catpurrccinos, (ii) any employee, agent, owners, or
                independent contractor of Catpurrccinos, or (iii) any other
                person at Catpurrccinos. Furthermore, I agree to pay any and all
                attorney’s fees and costs of the Catpurrccinos, their respective
                agents, employees, owners, and independent contractors if I
                bring any action, claim, or demand against Catpurrccinos, or any
                of their respective agents, employees, owners and independent
                contractors for any reason for which this Release applies.
              </Txt>

              <Txt sx={{ fontSize: "16px", mb: 2 }}>
                I agree to defend with counsel chosen by the indemnified party,
                indemnify, and hold harmless Catpurrccinos, their respective
                agents, employees, owners, and independent contractors, their
                sureties, insurers, successors, assigns, and legal
                representatives from any liability, claim, cause of action,
                demand or damages for injury, death or damages of any kind or
                nature whatsoever to any person or their property resulting from
                any actual or claimed intentional or wrongful act or omission by
                me arising from or as a result of my presence at Catpurrccinos
                or my participation in any activities at Catpurrccinos. I agree
                to provide said defense and indemnity regardless of the merit of
                the claim.
              </Txt>

              <Txt sx={{ fontSize: "16px", mb: 2 }}>
                I agree to and hereby bind my heirs, executors, assigns and all
                other legal representatives by executing this Release.
              </Txt>

              <Txt sx={{ fontSize: "16px", mb: 2 }}>
                I hereby acknowledge and agree that this Release is intended to
                be construed and interpreted as broad and inclusive as permitted
                by the laws of Huntington, NY. If any portion of this Release is
                found or declared to be invalid or unenforceable, such
                invalidity shall not affect the remainder of this Release not
                found to be invalid and the remainder of this Release shall
                remain in full force and effect. This Agreement shall be
                governed by the laws of Huntington, NY (without regard to the
                laws that might be applicable under principles of conflicts of
                law, and without regard to the jurisdiction in which any action
                or special proceedings may be instituted), as to all matters,
                including but not limited to matters of jurisdiction, validity,
                property rights, construction, effect and performance. All
                disputes shall be subject to litigation only within the courts
                of Huntington, NY.
              </Txt>

              <Txt sx={{ fontSize: "16px", mb: 2 }}>
                BY EXECUTING THIS RELEASE, I ACKNOWLEDGE THAT I HAVE READ THIS
                RELEASE, UNDERSTAND THE CONTENTS HEREOF, HAVE BEEN ADVISED AND
                HAD THE OPPORTUNITY TO SEEK INDEPENDENT COUNSEL OF MY CHOICE AND
                CERTIFY THAT I HAVE FREELY AND VOLUNTARILY EXECUTED THIS
                RELEASE. I ACKNOWLEDGE THAT, BUT FOR THE EXECUTION OF THIS
                RELEASE AND AGREEING TO BE BOUND BY THE TERMS HEREOF,
                CATPURRCCINOS WOULD NOT AUTHORIZE ME TO PARTICIPATE IN ANY
                ACTIVITIES AT CATPURRCCINOS.
              </Txt>
            </TextOverflow>
          </Flx>
          <FormQuestions />
        </RffForm>
        {error && <Alert severity="error">Could not submit waiver</Alert>}
      </Container>
    </Screen>
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
export default CatteryWaiverScreen;
