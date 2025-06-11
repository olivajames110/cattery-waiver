import { BusinessOutlined } from "@mui/icons-material";
import RffBooleanToggleField from "../../components/finalForm/inputs/RffBooleanToggleField";
import RffDateField from "../../components/finalForm/inputs/RffDateField";
import RffPercentField from "../../components/finalForm/inputs/RffPercentField";
import RffSelectField from "../../components/finalForm/inputs/RffSelectField";
import RffTextField from "../../components/finalForm/inputs/RffTextField";
import RffConditional from "../../components/finalForm/shared/RffConditional";
import RffGroup from "../../components/finalForm/shared/RffGroup";
import TitledCard from "../../components/ui/TitledCard/TitledCard";
import { selectOptionsEntityType } from "../../constants/selectOptions/selectOptionsEntityType";
import { selectOptionsUsaStates } from "../../constants/selectOptions/selectOptionsUsaStates";
import RffSelectAutocompleteField from "../../components/finalForm/inputs/RffSelectAutocompleteField";

const BorrowingEntitiesSection = ({ testing }) => {
  return (
    <TitledCard
      variant="h1"
      icon={<BusinessOutlined className="thin" />}
      title="Borrowering Entities"
    >
      <RffGroup suppressBottomMargin>
        <RffBooleanToggleField
          // required
          name="borrowerEntity.applicantHasExistingEntity"
          label="Does the borrower have an existing entity, such as an LLC that will be used for this transaction?"
        />
        <RffConditional
          testing={testing}
          field="borrowerEntity.applicantHasExistingEntity"
          value={false}
        >
          {/* <RffNumberField */}
          <RffPercentField
            name="borrowerEntity.applicantEntityPercentOwnership"
            label="What percentage ownership of borrower entity will you expect to own once established?"
          />
          <RffSelectField
            size={6}
            name="borrowerEntity.entityStateOfOrganization"
            label="What will be the US State of Organization for the entity?"
            options={selectOptionsUsaStates}
          />
          <RffSelectField
            name="borrowerEntity.entityType"
            size={6}
            label="Planned entity type?"
            options={selectOptionsEntityType}
          />
          <RffBooleanToggleField
            name="borrowerEntity.entityAssets"
            label="Will the entity be established to be a single asset entity? I.e. an entity set up to purchase real estate with ownership of a single property?"
          />
        </RffConditional>
        <RffConditional
          testing={testing}
          field="borrowerEntity.applicantHasExistingEntity"
          value={true}
        >
          <RffTextField name="borrowerEntity.entityName" label="Entity Name" />
          <RffPercentField
            name="borrowerEntity.applicantEntityPercentOwnership"
            label="What percentage ownership of the entity does the borrower have?"
            // label="What percentage ownership of borrower entity do you own?"
          />
          <RffSelectAutocompleteField
            size={4}
            name="borrowerEntity.entityStateOfOrganization"
            label="Entity State Of Organization"
            options={selectOptionsUsaStates}
          />
          <RffSelectField
            name="borrowerEntity.entityType"
            size={4}
            label="Entity Type"
            options={selectOptionsEntityType}
          />
          <RffDateField
            size={4}
            name="borrowerEntity.entityOrganizationDate"
            label="Entity Organization Date"
          />
          <RffBooleanToggleField
            name="borrowerEntity.entityAssets"
            label="Single asset entity structure"
          />
          <RffTextField
            name="borrowerEntity.entityEINNumber"
            label="EIN Number"
          />
        </RffConditional>
      </RffGroup>
    </TitledCard>
  );
};

export default BorrowingEntitiesSection;
