export const proposedFormStepperSchema = {
  formTitle: "Example Form with All Data Types",
  initialValues: { borrowers: [{}] },
  steps: [
    {
      label: "Array",
      fields: [
        {
          type: "heading",
          label: "Heading Text",
          headingParams: {
            title: "Add All Borrowers",
            description: "Example description text",
          },
        },
        {
          field: "borrowers",
          label: "Borrower",
          type: "array",
          fields: [
            {
              field: "firstName",
              label: "First Name",
              size: 4,
            },

            {
              field: "middleName",
              label: "Middle Name",
              size: 4,
            },
            {
              field: "lastName",
              label: "Last Name",

              size: 4,
            },
            {
              field: "phoneField",
              size: 6,
              label: "Phone Number",
              type: "phone",
            },
            {
              field: "emailField",
              size: 6,
              label: "Email Address",
              type: "email",
            },

            {
              field: "dollarField",
              label: "Liquidity",
              type: "dollar",
              size: 8,
            },
            {
              field: "percent",
              label: "Percent Value",
              type: "percent",
              size: 4,
            },
          ],
        },
      ],
    },

    {
      label: "Conditionals",
      fields: [
        {
          field: "csA",
          label: "Conditional Selector A",
          size: 6,
          type: "selectToggle",
          choices: ["1", "2", "3", "4"],
        },
        {
          field: "csB",
          size: 6,
          label: "Conditional Selector B",
          type: "selectToggle",
          choices: ["1", "2", "3", "4"],
        },
        {
          field: "showIfcsA",
          label: "A === 1",
          condition: {
            rules: [{ field: "csA", operator: "==", value: "1" }],
          },
        },
        {
          field: "showIfcsAGreater1",
          label: "A Greater Than 2",
          condition: {
            rules: [{ field: "csA", operator: ">", value: "2" }],
          },
        },
        {
          field: "showIfcsALess1",
          label: "A Less Than 2",
          condition: {
            rules: [{ field: "csA", operator: "<", value: "2" }],
          },
        },
        {
          field: "showIfcsALessEqual1",
          label: "A Less or Equal to 2",
          condition: {
            rules: [{ field: "csA", operator: "<=", value: "2" }],
          },
        },
        {
          field: "showIfcsAGreaterEqual2",
          label: "A Greater or Equal 2",
          condition: {
            rules: [{ field: "csA", operator: ">=", value: "2" }],
          },
        },
        {
          field: "showIfcsANot2",
          label: "A !== 2",
          condition: {
            rules: [{ field: "csA", operator: "!=", value: "2" }],
          },
        },
        {
          field: "citizenshipStatus",
          label: "Citizenship Status",
          choices: [
            "US Citizen",
            "Foreign National with SSN",
            "Foreign National",
            "Foreign National Non-Resident",
            "Other - Options do not apply",
          ],
        },
        {
          field: "borrowerHasSSN",
          label: "Borrower Has SSN (Example One)",
          condition: {
            operator: "AND",
            rules: [
              {
                field: "citzenshipStatus",
                operator: "!=",
                value: "Foreign National Non-Resident",
              },
              {
                field: "citzenshipStatus",
                operator: "!=",
                value: "Other - Options do not apply",
              },
            ],
          },
        },
        {
          field: "borrowerHasSSN",
          label: "Borrower Has SSN (Example Two)",
          condition: {
            operator: "OR",
            rules: [
              {
                field: "citzenshipStatus",
                operator: "==",
                value: "US Citizen",
              },
              {
                field: "citzenshipStatus",
                operator: "==",
                value: "Foreign National with SSN",
              },
              {
                field: "citzenshipStatus",
                operator: "==",
                value: "Foreign National",
              },
            ],
          },
        },
        {
          field: "showIfcsA2AndCsB3",
          label: "A ===  2 && B === 3",
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
    {
      label: "Groups",
      groups: [
        {
          title: "Group Title 1",
          fields: [
            {
              field: "numberField",
              label: "Generic Number",
              type: "number",
            },

            {
              field: "dollarField",
              label: "Dollar Amount",
              type: "dollar",
            },
            {
              field: "percentField",
              label: "Percent Value",
              type: "percent",
            },
            {
              field: "floatField",
              label: "Floating-Point Value",
              type: "float",
            },
            {
              field: "integerField",
              label: "Integer Value",
              type: "integer",
            },
          ],
        },
        {
          title: "Group Title 2",
          fields: [
            {
              field: "properties",
              label: "Properties",
              type: "array",
              fields: [
                {
                  field: "firstName",
                  label: "First Name",
                  size: 4,
                },
                {
                  field: "middleName",
                  label: "Middle Name",
                  size: 4,
                },
                {
                  field: "lastName",
                  label: "Last Name",

                  size: 4,
                },
                {
                  field: "phoneField",
                  size: 6,
                  label: "Phone Number",
                  type: "phone",
                },
                {
                  field: "emailField",
                  size: 6,
                  label: "Email Address",
                  type: "email",
                },

                {
                  field: "dollarField",
                  label: "Liquidity",
                  type: "dollar",
                  size: 8,
                },
                {
                  field: "percent",
                  label: "Percent Value",
                  type: "percent",
                  size: 4,
                },
                {
                  field: "units",
                  label: "units",
                  type: "array",
                  fields: [
                    {
                      field: "firstName",
                      label: "First Name",
                      size: 4,
                    },
                    {
                      field: "middleName",
                      label: "Middle Name",
                      size: 4,
                    },
                    {
                      field: "lastName",
                      label: "Last Name",

                      size: 4,
                    },
                    {
                      field: "phoneField",
                      size: 6,
                      label: "Phone Number",
                      type: "phone",
                    },
                    {
                      field: "emailField",
                      size: 6,
                      label: "Email Address",
                      type: "email",
                    },

                    {
                      field: "dollarField",
                      label: "Liquidity",
                      type: "dollar",
                      size: 8,
                    },
                    {
                      field: "percent",
                      label: "Percent Value",
                      type: "percent",
                      size: 4,
                    },
                  ],
                },
              ],
            },
            {
              field: "numberField",
              label: "Generic Number",
              type: "number",
            },

            {
              field: "dollarField",
              label: "Dollar Amount",
              type: "dollar",
            },
            {
              field: "percentField",
              label: "Percent Value",
              type: "percent",
            },
            {
              field: "floatField",
              label: "Floating-Point Value",
              type: "float",
            },
            {
              field: "integerField",
              label: "Integer Value",
              type: "integer",
            },
          ],
        },
      ],
    },

    {
      label: "Selections",
      fields: [
        {
          field: "selectField",
          label: "Select",
          helperText: "example",
          type: "select",
          choices: ["1", "2", "3", "3+ properties"],
          required: true,
        },
        {
          field: "selectAutocompleteField",
          label: "Select Autocomplete",
          type: "selectAutocomplete",
          required: true,
          choices: ["1", "2", "3"],
        },
        {
          field: "selectMultiple",
          label: "Select Multiple",
          type: "selectMultiple",
          choices: ["1", "2", "3", "3+ properties"],
          required: true,
        },
        {
          field: "selectToggleField",
          label: "Select Toggle (Exclusive)",
          type: "selectToggle",
          required: true,
          choices: ["1", "2", "3", "3+ properties"],
        },
      ],
    },
    {
      label: "String Inputs",
      fields: [
        { field: "textField", label: "Text Field" },
        {
          field: "stringMultilineField",
          label: "String Multiline",
          type: "stringMultiline",
          required: true,
          parameters: {
            rows: 4,
          },
        },

        {
          field: "dateField",
          size: 6,
          label: "Date",
          type: "date",
          required: true,
        },
        {
          field: "dateTimeField",
          label: "Date & Time",
          size: 6,
          type: "dateTime",
          required: true,
        },
        {
          field: "phoneField",
          size: 6,
          label: "Phone Number",
          type: "phone",

          required: true,
        },
        {
          field: "emailField",
          size: 6,
          label: "Email Address",
          type: "email",
          required: true,
        },
      ],
    },

    {
      label: "Non Strings",
      fields: [
        {
          field: "numberField",
          label: "Generic Number",
          type: "number",
          required: true,
        },

        {
          field: "dollarField",
          label: "Dollar Amount",
          type: "dollar",
          required: true,
        },
        {
          field: "percentField",
          label: "Percent Value",
          type: "percent",
          required: true,
        },
        {
          field: "floatField",
          label: "Floating-Point Value",
          type: "float",
          required: true,
        },
        {
          field: "integerField",
          label: "Integer Value",
          type: "integer",
          required: true,
        },
      ],
    },
    {
      label: "Booleans",
      fields: [
        {
          field: "booleanCheckboxField",
          label: "Do you agree?",
          type: "booleanCheckbox",
          required: true,
        },
        {
          field: "booleanToggleField",
          label: "Do you agree?",
          type: "booleanToggle",
          required: true,
        },
      ],
    },
  ],
};
