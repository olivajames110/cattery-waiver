export const newFormStepperScehma = {
  formTitle: "Example Form with All Data Types",
  formDescription: "Example description",
  initialValues: {
    borrowers: [
      {
        firstName: "ssd",
        middleName: "",
        lastName: "",
        phoneField: "",
        emailField: "",
        dollarField: "",
        percent: "",
      },
    ],
    // textField: " bnmbnm",
  },

  steps: [
    {
      id: "step-5",
      title: "Array",
      hideStepTitle: true,
      elements: [
        {
          id: "array-borrowers",
          type: "array",
          field: "borrowers",
          label: "Borrower",
          elements: [
            {
              id: "field-firstName",
              type: "field",
              field: "firstName",
              label: "First Name",
              required: true,
              size: 4,
              inputType: "text",
            },
            {
              id: "field-showIfsdsdcsA",
              type: "field",
              field: "otherName",
              label: "Other Name",
              condition: {
                rules: [{ field: "firstName", operator: "==", value: "j" }],
              },
            },
            {
              id: "field-middleName",
              type: "field",
              field: "middleName",
              label: "Middle Name",
              size: 4,
              inputType: "text",
            },
            {
              id: "field-lastName",
              type: "field",
              field: "lastName",
              label: "Last Name",
              size: 4,
              required: true,
              inputType: "text",
            },
            {
              id: "field-phoneField",
              type: "field",
              field: "phoneField",
              label: "Phone Number",
              size: 6,
              inputType: "phone",
            },
            {
              id: "field-emailField",
              type: "field",
              field: "emailField",
              label: "Email Address",
              size: 6,
              inputType: "email",
            },
            {
              id: "field-dollarField",
              type: "field",
              field: "dollarField",
              label: "Liquidity",
              size: 8,
              inputType: "dollar",
            },
            {
              id: "field-percent",
              type: "field",
              field: "percent",
              label: "Percent Value",
              size: 4,
              inputType: "percent",
            },
          ],
        },
      ],
    },
    // STEP 1 --------------------------------------------------------------
    {
      id: "step-1",
      title: "String Inputss",
      elements: [
        {
          id: "field-textField",
          type: "field",
          field: "textField",
          required: true,
          label: "Text Field",
          inputType: "array",
        },
        {
          id: "field-stringMultilineField",
          type: "field",
          field: "stringMultilineField",
          label: "String Multiline",
          inputType: "stringMultiline",
          // required: true,
          parameters: {
            rows: 4,
          },
        },
        {
          id: "field-dateField",
          type: "field",
          field: "dateField",
          label: "Date",
          size: 6,
          inputType: "date",
          // required: true,
        },
        {
          id: "field-dateTimeField",
          type: "field",
          field: "dateTimeField",
          label: "Date & Time",
          size: 6,
          inputType: "dateTime",
          // required: true,
        },
        {
          id: "field-phoneField",
          type: "field",
          field: "phoneField",
          label: "Phone Number",
          size: 6,
          inputType: "phone",
          // required: true,
        },
        {
          id: "field-emailField",
          type: "field",
          field: "emailField",
          label: "Email Address",
          size: 6,
          inputType: "email",
          // required: true,
        },
      ],
    },

    // STEP 2 --------------------------------------------------------------
    {
      id: "step-2",
      title: "Conditionals",
      elements: [
        {
          id: "field-csA",
          type: "field",
          field: "csA",
          required: true,
          label: "Conditional Selector A",
          size: 6,
          inputType: "selectToggle",
          choices: ["1", "2", "3", "4"],
        },
        {
          id: "field-csB",
          type: "field",
          field: "csB",
          label: "Conditional Selector B",
          size: 6,
          inputType: "selectToggle",
          choices: ["1", "2", "3", "4"],
        },
        {
          id: "field-showIfcsA",
          type: "field",
          field: "showIfcsA",
          label: "A === 1",
          condition: {
            rules: [{ field: "csA", operator: "==", value: "1" }],
          },
        },
        {
          id: "field-showIfcsAGreater1",
          type: "field",
          field: "showIfcsAGreater1",
          label: "A Greater Than 2",
          condition: {
            rules: [{ field: "csA", operator: ">", value: "2" }],
          },
        },
        {
          id: "field-showIfcsALess1",
          type: "field",
          field: "showIfcsALess1",
          label: "A Less Than 2",
          condition: {
            rules: [{ field: "csA", operator: "<", value: "2" }],
          },
        },
        {
          id: "field-showIfcsALessEqual1",
          type: "field",
          field: "showIfcsALessEqual1",
          label: "A Less or Equal to 2",
          condition: {
            rules: [{ field: "csA", operator: "<=", value: "2" }],
          },
        },
        {
          id: "field-showIfcsAGreaterEqual2",
          type: "field",
          field: "showIfcsAGreaterEqual2",
          label: "A Greater or Equal 2",
          condition: {
            rules: [{ field: "csA", operator: ">=", value: "2" }],
          },
        },
        {
          id: "field-showIfcsANot2",
          type: "field",
          field: "showIfcsANot2",
          label: "A !== 2",
          condition: {
            rules: [{ field: "csA", operator: "!=", value: "2" }],
          },
        },
        {
          id: "field-showIfcsA2Or3",
          type: "field",
          field: "showIfcsA2Or3",
          label: "A === 1 or 3",
          condition: {
            operator: "OR",
            rules: [
              { field: "csA", operator: "==", value: "1" },
              { field: "csA", operator: "==", value: "3" },
            ],
          },
        },
        {
          id: "field-showIfcsA2AndCsB3",
          type: "field",
          field: "showIfcsA2AndCsB3",
          label: "A === 2 && B === 3",
          condition: {
            operator: "AND",
            rules: [
              { field: "csA", operator: "==", value: "2" },
              { field: "csB", operator: "==", value: "3" },
            ],
          },
        },
      ],
    },

    // STEP 4 --------------------------------------------------------------
    {
      id: "step-4",
      title: "Selections",
      elements: [
        {
          id: "field-selectField",
          type: "field",
          field: "selectField",
          label: "Select",
          inputType: "select",
          helperText: "example",
          choices: ["1", "2", "3", "3+ properties"],
          // required: true,
        },
        {
          id: "field-selectAutocompleteField",
          type: "field",
          field: "selectAutocompleteField",
          label: "Select Autocomplete",
          inputType: "selectAutocomplete",
          choices: ["1", "2", "3"],
          // required: true,
        },
        {
          id: "field-selectMultiple",
          type: "field",
          field: "selectMultiple",
          label: "Select Multiple",
          inputType: "selectMultiple",
          choices: ["1", "2", "3", "3+ properties"],
          // required: true,
        },
        {
          id: "field-selectToggleField",
          type: "field",
          field: "selectToggleField",
          label: "Select Toggle (Exclusive)",
          inputType: "selectToggle",
          choices: ["1", "2", "3", "3+ properties"],
          // required: true,
        },
      ],
    },

    // STEP 5 --------------------------------------------------------------

    // STEP 6 --------------------------------------------------------------
    {
      id: "step-6",
      title: "Non Strings",
      elements: [
        {
          id: "field-numberField2",
          type: "field",
          field: "numberField",
          label: "Generic Number",
          inputType: "number",
          // required: true,
        },
        {
          id: "field-dollarField2",
          type: "field",
          field: "dollarField",
          label: "Dollar Amount",
          inputType: "dollar",
          // required: true,
        },
        {
          id: "field-percentField2",
          type: "field",
          field: "percentField",
          label: "Percent Value",
          inputType: "percent",
          // required: true,
        },
        {
          id: "field-floatField2",
          type: "field",
          field: "floatField",
          label: "Floating-Point Value",
          inputType: "float",
          // required: true,
        },
        {
          id: "field-integerField2",
          type: "field",
          field: "integerField",
          label: "Integer Value",
          inputType: "integer",
          // required: true,
        },
      ],
    },

    // STEP 7 --------------------------------------------------------------
    {
      id: "step-7",
      title: "Booleans",
      elements: [
        {
          id: "field-booleanCheckboxField",
          type: "field",
          field: "booleanCheckboxField",
          label: "Do you agree?",
          inputType: "booleanCheckbox",
          // required: true,
        },
        {
          id: "field-booleanToggleField",
          type: "field",
          field: "booleanToggleField",
          label: "Do you agree?",
          inputType: "booleanToggle",
          // required: true,
        },
      ],
    },
  ],
};

export default newFormStepperScehma;
