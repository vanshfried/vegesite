// EditableField.jsx
import React, { useState, useEffect } from "react";
import "../../css/SettingsPage.css";

const EditableField = ({ label, value: initialValue, readOnly, type = "text", onSave }) => {
  const [value, setValue] = useState(initialValue || "");
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => setValue(initialValue || ""), [initialValue]);

  const handleSave = async () => {
    try {
      if (onSave) await onSave(value);
      setEditing(false);
      setToast("Saved!");
      setTimeout(() => setToast(""), 1500);
    } catch (err) {
      console.error("Error saving:", err);
      setValue(initialValue);
      setToast("Failed to save");
      setTimeout(() => setToast(""), 1500);
    }
  };

  return (
    <div className="settings-field">
      <label className="field-label">{label}</label>
      {editing ? (
        <div className="field-edit">
          <input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={readOnly}
          />
          {!readOnly && <button className="save-btn" onClick={handleSave}>Save</button>}
        </div>
      ) : (
        <div className="field-display">
          <span className="value-text">{value || "Not set"}</span>
          {!readOnly && <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>}
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default EditableField;
