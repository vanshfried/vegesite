// ProfileTab.jsx
import React from "react";
import EditableField from "./EditableField";

const ProfileTab = ({ user, handleSaveField, addressExpanded, setAddressExpanded }) => {
  return (
    <div className="profile-section">
      <EditableField
        label="Name"
        value={user.name}
        onSave={(val) => handleSaveField("name", val)}
      />
      <EditableField
        label="Mobile Number"
        value={user.mobile}
        readOnly={true} // Mobile number is read-only
      />

      <div className={`address-box ${addressExpanded ? "expanded" : "collapsed"}`}>
        <h3 onClick={() => setAddressExpanded(!addressExpanded)}>
          Address {addressExpanded ? "▲" : "▼"}
        </h3>
        <div className="address-fields-container">
          <EditableField
            label="House / Apt No"
            value={user.address.houseNo}
            onSave={(val) => handleSaveField("address.houseNo", val)}
          />
          <EditableField
            label="Lane / Sector"
            value={user.address.laneOrSector}
            onSave={(val) => handleSaveField("address.laneOrSector", val)}
          />
          <EditableField
            label="Landmark"
            value={user.address.landmark}
            onSave={(val) => handleSaveField("address.landmark", val)}
          />
          <EditableField
            label="Pincode"
            value={user.address.pincode}
            type="number"
            onSave={(val) => handleSaveField("address.pincode", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
